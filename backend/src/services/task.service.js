const { query } = require('../config/prisma');
const scheduleService = require('./schedule.service');
const { getWeekRange } = require('../utils/dateUtils');

const computePriority = (importance, dueDate) => {
  const hoursLeft = (new Date(dueDate) - new Date()) / 3_600_000;
  const urgencyScore   = hoursLeft <= 0 ? 100 : Math.max(0, 100 - (hoursLeft / (7*24))*100);
  const importanceScore = ((importance - 1) / 4) * 100;
  const priorityScore   = (urgencyScore * 0.5) + (importanceScore * 0.5);
  const isUrgent    = urgencyScore    >= 50;
  const isImportant = importanceScore >= 50;
  const priorityQuadrant =
    isUrgent && isImportant   ? 'DO_FIRST'  :
    !isUrgent && isImportant  ? 'SCHEDULE'  :
    isUrgent && !isImportant  ? 'DELEGATE'  : 'ELIMINATE';
  return { priorityScore, priorityQuadrant };
};

// Predict time based on user's past behavior for similar tasks
const predictTime = async (userId, category, importance, userEstimatedTime) => {
  if (!userEstimatedTime) return null;

  // Look for behavior data for this category/importance
  const behaviorRes = await query(
    `SELECT "originalEstimatedTime", "actualTime"
     FROM "UserBehavior"
     WHERE "userId"=$1
       AND "actualTime" IS NOT NULL
       AND "originalEstimatedTime" IS NOT NULL
       AND ($2::TEXT IS NULL OR "taskCategory"=$2)
     ORDER BY "createdAt" DESC LIMIT 20`,
    [userId, category || null]
  );

  if (behaviorRes.rows.length >= 2) {
    const ratios = behaviorRes.rows.map(b => b.actualTime / b.originalEstimatedTime);
    const avgRatio = ratios.reduce((a,b)=>a+b,0) / ratios.length;
    return Math.round(parseInt(userEstimatedTime) * avgRatio);
  }

  // If not enough category data, use all behavior data
  const allBehaviorRes = await query(
    `SELECT "originalEstimatedTime", "actualTime"
     FROM "UserBehavior"
     WHERE "userId"=$1
       AND "actualTime" IS NOT NULL
       AND "originalEstimatedTime" IS NOT NULL
     ORDER BY "createdAt" DESC LIMIT 30`,
    [userId]
  );

  if (allBehaviorRes.rows.length >= 2) {
    const ratios = allBehaviorRes.rows.map(b => b.actualTime / b.originalEstimatedTime);
    const avgRatio = ratios.reduce((a,b)=>a+b,0) / ratios.length;
    return Math.round(parseInt(userEstimatedTime) * avgRatio);
  }

  // Fallback: slight adjustment based on importance
  const imp = parseInt(importance);
  return Math.round(parseInt(userEstimatedTime) * (1 + (imp - 3) * 0.05));
};

const autoRegenerateSchedule = async (userId) => {
  try {
    const { startDate, endDate } = getWeekRange();
    await scheduleService.generateWeeklySchedule(userId, startDate, endDate);
  } catch (e) {
    console.error('Auto-regeneration failed:', e.message);
  }
};

/**
 * Check if a task can be completed before its deadline given the user's
 * availability slots. Returns { feasible, reason }.
 *
 * Logic:
 *  1. Find all availability slots (dayOfWeek, startTime, endTime).
 *  2. Walk each day from today (or now) up to dueDate.
 *  3. For each day, sum up available minutes in matching slots.
 *     On today's date, only count time remaining from the current time.
 *  4. If total available minutes >= requiredMinutes → feasible.
 */
const checkDeadlineFeasibility = async (userId, dueDate, requiredMinutes) => {
  if (!requiredMinutes || requiredMinutes <= 0) return { feasible: true };

  const slotsRes = await query(
    `SELECT "dayOfWeek", "startTime", "endTime" FROM "AvailabilitySlot" WHERE "userId"=$1 ORDER BY "dayOfWeek" ASC, "startTime" ASC`,
    [userId]
  );

  if (!slotsRes.rows.length) {
    return {
      feasible: false,
      reason: 'Task cannot be completed before the deadline — you have no availability slots set up. Please add availability in the Availability page first.',
    };
  }

  // Build slot map: dayOfWeek (0=Sun…6=Sat) -> [{startMins, endMins}]
  const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const slotMap = {};
  for (const s of slotsRes.rows) {
    if (!slotMap[s.dayOfWeek]) slotMap[s.dayOfWeek] = [];
    slotMap[s.dayOfWeek].push({ startMins: toMins(s.startTime), endMins: toMins(s.endTime) });
  }

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const deadline = new Date(dueDate);
  deadline.setSeconds(59, 999);

  let totalAvailable = 0;
  const cur = new Date(now);
  cur.setHours(0, 0, 0, 0);

  while (cur <= deadline) {
    const dow = cur.getDay();
    const isToday = cur.toDateString() === now.toDateString();
    const isDeadlineDay = cur.toDateString() === deadline.toDateString();
    const daySlots = slotMap[dow] || [];

    for (const slot of daySlots) {
      let slotStart = slot.startMins;
      let slotEnd   = slot.endMins;

      // On today, only count future time
      if (isToday) slotStart = Math.max(slotStart, nowMins);

      // On deadline day, only count time up to the deadline's time
      if (isDeadlineDay) {
        const deadlineMins = deadline.getHours() * 60 + deadline.getMinutes();
        slotEnd = Math.min(slotEnd, deadlineMins);
      }

      if (slotEnd > slotStart) totalAvailable += slotEnd - slotStart;
    }

    if (totalAvailable >= requiredMinutes) return { feasible: true };

    cur.setDate(cur.getDate() + 1);
  }

  // Format helpers for the error message
  const fmtMins = (m) => {
    const h = Math.floor(m / 60), min = m % 60;
    if (h > 0 && min > 0) return `${h}h ${min}m`;
    if (h > 0) return `${h}h`;
    return `${min}m`;
  };

  return {
    feasible: false,
    reason: `Task cannot be completed before the deadline — only ${fmtMins(totalAvailable)} of availability found before the deadline, but this task needs ${fmtMins(requiredMinutes)}. Please extend the deadline or add more availability slots.`,
  };
};

const createTask = async (userId, body) => {
  const { title, description, category, importance, dueDate, userEstimatedTime } = body;
  if (!title || !dueDate || importance === undefined) {
    const err = new Error('title, dueDate and importance are required'); err.statusCode = 400; throw err;
  }

  const { priorityScore, priorityQuadrant } = computePriority(parseInt(importance), dueDate);
  const imp = parseInt(importance);
  const aiPredictedTime = await predictTime(userId, category, imp, userEstimatedTime);

  // Use AI-predicted time if available, else user estimate, else 60 min default
  const requiredMinutes = aiPredictedTime || (userEstimatedTime ? parseInt(userEstimatedTime) : 60);

  // Feasibility check: block creation if the task cannot fit before the deadline
  const { feasible, reason } = await checkDeadlineFeasibility(userId, dueDate, requiredMinutes);
  if (!feasible) {
    const err = new Error(reason); err.statusCode = 422; throw err;
  }

  const res = await query(
    `INSERT INTO "Task" ("userId",title,description,category,importance,"dueDate","userEstimatedTime","aiPredictedTime","priorityScore","priorityQuadrant",status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'PENDING') RETURNING *`,
    [userId, title, description||null, category||null, imp, new Date(dueDate),
     userEstimatedTime ? parseInt(userEstimatedTime) : null, aiPredictedTime, priorityScore, priorityQuadrant]
  );

  // Auto-regenerate schedule
  await autoRegenerateSchedule(userId);

  return res.rows[0];
};

const getTasks = async (userId) => {
  const res = await query(
    `SELECT * FROM "Task" WHERE "userId"=$1 ORDER BY "priorityScore" DESC NULLS LAST, "createdAt" DESC`, [userId]);
  return res.rows;
};

const getTaskById = async (id, userId) => {
  const res = await query(`SELECT * FROM "Task" WHERE id=$1 AND "userId"=$2`, [id, userId]);
  if (!res.rows.length) { const err = new Error('Task not found'); err.statusCode = 404; throw err; }
  return res.rows[0];
};

const updateTask = async (id, userId, body) => {
  const existing = await getTaskById(id, userId);
  const { title, description, category, importance, dueDate, userEstimatedTime, status } = body;
  const { priorityScore, priorityQuadrant } = (importance || existing.importance) && (dueDate || existing.dueDate)
    ? computePriority(parseInt(importance || existing.importance), dueDate || existing.dueDate)
    : { priorityScore: existing.priorityScore, priorityQuadrant: existing.priorityQuadrant };

  // Recalculate AI predicted time if estimate changed
  let aiPredictedTime = existing.aiPredictedTime;
  if (userEstimatedTime && parseInt(userEstimatedTime) !== existing.userEstimatedTime) {
    aiPredictedTime = await predictTime(
      userId,
      category || existing.category,
      importance || existing.importance,
      userEstimatedTime
    );
  }

  // Always re-run feasibility for pending tasks — availability may have changed
  // since the task was created, even if deadline/estimate haven't moved.
  const effectiveStatus = status || existing.status;
  if (effectiveStatus !== 'COMPLETED') {
    const effectiveDueDate  = dueDate || existing.dueDate;
    const effectiveEstimate = userEstimatedTime ? parseInt(userEstimatedTime) : existing.userEstimatedTime;
    const requiredMinutes   = aiPredictedTime || effectiveEstimate || 60;
    const { feasible, reason } = await checkDeadlineFeasibility(userId, effectiveDueDate, requiredMinutes);
    if (!feasible) {
      const err = new Error(reason); err.statusCode = 422; throw err;
    }
  }

  const res = await query(
    `UPDATE "Task" SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      category = COALESCE($3, category),
      importance = COALESCE($4, importance),
      "dueDate" = COALESCE($5, "dueDate"),
      "userEstimatedTime" = COALESCE($6, "userEstimatedTime"),
      "aiPredictedTime" = COALESCE($7, "aiPredictedTime"),
      status = COALESCE($8, status),
      "priorityScore" = $9,
      "priorityQuadrant" = $10,
      "updatedAt" = NOW()
     WHERE id=$11 RETURNING *`,
    [title||null, description||null, category||null,
     importance ? parseInt(importance) : null,
     dueDate ? new Date(dueDate) : null,
     userEstimatedTime ? parseInt(userEstimatedTime) : null,
     aiPredictedTime,
     status||null,
     priorityScore, priorityQuadrant,
     id]
  );

  // Auto-regenerate schedule
  await autoRegenerateSchedule(userId);

  return res.rows[0];
};

const deleteTask = async (id, userId) => {
  await getTaskById(id, userId);
  await query(`DELETE FROM "DailySchedule" WHERE "taskId"=$1`, [id]);
  const res = await query(`DELETE FROM "Task" WHERE id=$1 RETURNING *`, [id]);

  // Auto-regenerate schedule
  await autoRegenerateSchedule(userId);

  return res.rows[0];
};

const completeTask = async (id, userId, actualTime) => {
  const task = await getTaskById(id, userId);
  const res = await query(
    `UPDATE "Task" SET status='COMPLETED',"completedAt"=NOW(),"actualTime"=COALESCE($1,"actualTime"),"updatedAt"=NOW()
     WHERE id=$2 RETURNING *`,
    [actualTime ? parseInt(actualTime) : null, id]
  );

  // Record behavior data for AI learning
  if (actualTime) {
    const scheduledHour = new Date().getHours();
    await query(
      `INSERT INTO "UserBehavior" ("userId","taskId","taskCategory",importance,"originalEstimatedTime","aiPredictedTime","actualTime","scheduledHour","completedHour")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [userId, id, task.category, task.importance, task.userEstimatedTime, task.aiPredictedTime,
       parseInt(actualTime), scheduledHour, new Date().getHours()]
    );
  }

  // Remove this task's schedule blocks and auto-regenerate
  await query(`DELETE FROM "DailySchedule" WHERE "taskId"=$1`, [id]);
  await autoRegenerateSchedule(userId);

  return res.rows[0];
};

const getPrioritizedTasks = async (userId) => {
  const res = await query(
    `SELECT * FROM "Task" WHERE "userId"=$1 AND status!='COMPLETED' ORDER BY "priorityScore" DESC NULLS LAST`, [userId]);
  return res.rows;
};

const getQuadrantTasks = async (userId) => {
  const tasks = await getPrioritizedTasks(userId);
  const quadrants = { DO_FIRST: [], SCHEDULE: [], DELEGATE: [], ELIMINATE: [] };
  for (const t of tasks) {
    const q = t.priorityQuadrant || 'ELIMINATE';
    if (quadrants[q]) quadrants[q].push(t);
  }
  return quadrants;
};

// Returns AI predicted time estimate for frontend preview
const previewAiTime = async (userId, category, importance, userEstimatedTime) => {
  const predicted = await predictTime(userId, category, importance, userEstimatedTime);
  return { aiPredictedTime: predicted };
};

// Exposed for the check-feasibility endpoint (read-only, no task creation)
const checkFeasibilityOnly = (userId, dueDate, requiredMinutes) =>
  checkDeadlineFeasibility(userId, dueDate, requiredMinutes);

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, completeTask, getPrioritizedTasks, getQuadrantTasks, previewAiTime, checkFeasibilityOnly };
