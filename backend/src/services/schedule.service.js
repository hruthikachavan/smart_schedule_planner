const { query } = require('../config/prisma');

const DAY_MAP = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const toMins  = (t) => { const [h,m] = t.split(':').map(Number); return h*60+m; };

const generateWeeklySchedule = async (userId, startDate, endDate) => {
  const start = new Date(startDate || new Date());
  const end   = new Date(endDate   || new Date(start.getTime() + 7*86400000));
  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);

  // Delete existing planned schedule for this range
  await query(
    `DELETE FROM "DailySchedule" WHERE "userId"=$1 AND date >= $2 AND date <= $3 AND status='PLANNED'`,
    [userId, start, end]
  );

  const tasksRes = await query(
    `SELECT * FROM "Task" WHERE "userId"=$1 AND status!='COMPLETED' ORDER BY "priorityScore" DESC NULLS LAST`,
    [userId]
  );
  const slotsRes = await query(
    `SELECT * FROM "AvailabilitySlot" WHERE "userId"=$1 ORDER BY "dayOfWeek" ASC, "startTime" ASC`,
    [userId]
  );

  if (!tasksRes.rows.length || !slotsRes.rows.length) {
    return getWeekSchedule(userId, startDate, endDate);
  }

  // get current version
  const vRes = await query(`SELECT MAX("generationVersion") as v FROM "DailySchedule" WHERE "userId"=$1`, [userId]);
  const version = (parseInt(vRes.rows[0]?.v) || 0) + 1;

  // slot map: dayOfWeek -> [{startMins, endMins}]
  const slotMap = {};
  for (const s of slotsRes.rows) {
    if (!slotMap[s.dayOfWeek]) slotMap[s.dayOfWeek] = [];
    slotMap[s.dayOfWeek].push({ startMins: toMins(s.startTime), endMins: toMins(s.endTime) });
  }

  // Use aiPredictedTime if available, else userEstimatedTime, else 60
  const taskRemaining = {};
  for (const t of tasksRes.rows) {
    taskRemaining[t.id] = t.aiPredictedTime || t.userEstimatedTime || 60;
  }

  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay();
    const daySlots = slotMap[dow] || [];

    for (const slot of daySlots) {
      let cursor = slot.startMins;

      for (const task of tasksRes.rows) {
        if ((taskRemaining[task.id] || 0) <= 0) continue;
        // Skip if task due date is before this day
        const taskDue = new Date(task.dueDate);
        taskDue.setHours(23,59,59,999);
        if (taskDue < cur) continue;

        const available = slot.endMins - cursor;
        if (available <= 5) break;

        const allocate = Math.min(taskRemaining[task.id], available);
        if (allocate <= 0) continue;

        const dateOnly = new Date(cur); dateOnly.setHours(0,0,0,0);
        const startDT  = new Date(cur); startDT.setHours(Math.floor(cursor/60), cursor%60, 0, 0);
        const endMins  = cursor + allocate;
        const endDT    = new Date(cur); endDT.setHours(Math.floor(endMins/60), endMins%60, 0, 0);

        await query(
          `INSERT INTO "DailySchedule" ("userId","taskId",date,"startTime","endTime","allocatedMinutes","generationVersion",status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,'PLANNED')`,
          [userId, task.id, dateOnly, startDT, endDT, allocate, version]
        );
        taskRemaining[task.id] -= allocate;
        cursor += allocate + 5; // 5-min buffer between tasks
      }
    }
    cur.setDate(cur.getDate() + 1);
  }

  return getWeekSchedule(userId, startDate, endDate);
};

const getWeekSchedule = async (userId, startDate, endDate) => {
  const start = new Date(startDate || new Date());
  const end   = new Date(endDate   || new Date(start.getTime() + 7*86400000));
  start.setHours(0,0,0,0); end.setHours(23,59,59,999);

  const res = await query(
    `SELECT ds.*, t.title, t.category, t."priorityQuadrant", t.importance
     FROM "DailySchedule" ds JOIN "Task" t ON ds."taskId"=t.id
     WHERE ds."userId"=$1 AND ds.date >= $2 AND ds.date <= $3
     ORDER BY ds.date ASC, ds."startTime" ASC`,
    [userId, start, end]
  );

  const byDate = {};
  for (const r of res.rows) {
    const key = new Date(r.date).toISOString().split('T')[0];
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(r);
  }

  const days = [];
  const cur = new Date(start);
  while (cur <= end) {
    const key = cur.toISOString().split('T')[0];
    const recs = byDate[key] || [];
    days.push({
      date:       key,
      day:        DAY_MAP[cur.getDay()],
      blocks:     recs.map(formatBlock),
      totalHours: +(recs.reduce((s,r) => s + r.allocatedMinutes, 0) / 60).toFixed(1),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
};

const getTodaySchedule = async (userId) => {
  const today    = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  const res = await query(
    `SELECT ds.*, t.title, t.category, t."priorityQuadrant", t.importance
     FROM "DailySchedule" ds JOIN "Task" t ON ds."taskId"=t.id
     WHERE ds."userId"=$1 AND ds.date >= $2 AND ds.date < $3
     ORDER BY ds."startTime" ASC`,
    [userId, today, tomorrow]
  );
  return res.rows.map(formatBlock);
};

const regenerateSchedule = async (userId, startDate, endDate) =>
  generateWeeklySchedule(userId, startDate, endDate);

const getScheduleStats = async (userId) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const end   = new Date(today); end.setDate(end.getDate()+7);

  const schedRes = await query(
    `SELECT ds."taskId", ds."allocatedMinutes", ds."generationVersion"
     FROM "DailySchedule" ds WHERE ds."userId"=$1 AND ds.date >= $2 AND ds.date <= $3`,
    [userId, today, end]
  );

  // Compute total available minutes from slots for next 7 days
  const slotsRes = await query(
    `SELECT "dayOfWeek", "startTime", "endTime" FROM "AvailabilitySlot" WHERE "userId"=$1`,
    [userId]
  );

  // Calculate available hours across the 7-day window
  let totalAvailableMins = 0;
  const cur = new Date(today);
  for (let i = 0; i < 7; i++) {
    const dow = cur.getDay();
    const daySlots = slotsRes.rows.filter(s => s.dayOfWeek === dow);
    for (const s of daySlots) {
      const [sh, sm] = s.startTime.split(':').map(Number);
      const [eh, em] = s.endTime.split(':').map(Number);
      totalAvailableMins += (eh * 60 + em) - (sh * 60 + sm);
    }
    cur.setDate(cur.getDate() + 1);
  }

  const records = schedRes.rows;
  const vRes = await query(`SELECT MAX("generationVersion") as v FROM "DailySchedule" WHERE "userId"=$1`, [userId]);
  const totalMins = records.reduce((s,r) => s + r.allocatedMinutes, 0);
  const availableHours = +(totalAvailableMins / 60).toFixed(1);
  return {
    tasksScheduled: new Set(records.map(r => r.taskId)).size,
    scheduledHours: +(totalMins/60).toFixed(1),
    version:        parseInt(vRes.rows[0]?.v) || 0,
    availableHours,
    remainingHours: +(Math.max(0, availableHours - totalMins/60)).toFixed(1),
    utilization:    availableHours > 0 ? Math.min(100, Math.round((totalMins/60/availableHours)*100)) : 0,
  };
};

function formatBlock(r) {
  const COLORS = { DO_FIRST:'red', SCHEDULE:'blue', DELEGATE:'amber', ELIMINATE:'slate' };
  const TYPES  = { DO_FIRST:'deep-work', SCHEDULE:'task', DELEGATE:'task', ELIMINATE:'task' };
  const q = r.priorityQuadrant || 'SCHEDULE';
  const st = new Date(r.startTime);
  const et = new Date(r.endTime);
  return {
    id:               r.id,
    taskId:           r.taskId,
    title:            r.title || 'Task',
    startTime:        `${String(st.getHours()).padStart(2,'0')}:${String(st.getMinutes()).padStart(2,'0')}`,
    endTime:          `${String(et.getHours()).padStart(2,'0')}:${String(et.getMinutes()).padStart(2,'0')}`,
    allocatedMinutes: r.allocatedMinutes,
    color:            COLORS[q] || 'indigo',
    type:             TYPES[q]  || 'task',
    status:           r.status,
    category:         r.category,
    priority:         q,
    generationVersion: r.generationVersion,
  };
}

module.exports = { generateWeeklySchedule, getWeekSchedule, getTodaySchedule, regenerateSchedule, getScheduleStats };