const { query } = require('../config/prisma');
const { checkFeasibilityOnly } = require('./task.service');

const createSlot = async (userId, body) => {
  const { dayOfWeek, startTime, endTime } = body;
  if (dayOfWeek === undefined || !startTime || !endTime) {
    const err = new Error('dayOfWeek, startTime and endTime are required'); err.statusCode = 400; throw err;
  }
  const exists = await query(
    `SELECT id FROM "AvailabilitySlot" WHERE "userId"=$1 AND "dayOfWeek"=$2 AND "startTime"=$3 AND "endTime"=$4`,
    [userId, parseInt(dayOfWeek), startTime, endTime]);
  if (exists.rows.length) return { slot: exists.rows[0], infeasibleTasks: [] };

  const res = await query(
    `INSERT INTO "AvailabilitySlot" ("userId","dayOfWeek","startTime","endTime") VALUES ($1,$2,$3,$4) RETURNING *`,
    [userId, parseInt(dayOfWeek), startTime, endTime]);
  return { slot: res.rows[0], infeasibleTasks: [] };
};

const getSlots = async (userId) => {
  const res = await query(
    `SELECT * FROM "AvailabilitySlot" WHERE "userId"=$1 ORDER BY "dayOfWeek" ASC, "startTime" ASC`, [userId]);
  return res.rows;
};

const updateSlot = async (id, userId, body) => {
  const check = await query(`SELECT id FROM "AvailabilitySlot" WHERE id=$1 AND "userId"=$2`, [id, userId]);
  if (!check.rows.length) { const err = new Error('Slot not found'); err.statusCode = 404; throw err; }
  const { dayOfWeek, startTime, endTime } = body;
  const res = await query(
    `UPDATE "AvailabilitySlot" SET "dayOfWeek"=COALESCE($1,"dayOfWeek"),"startTime"=COALESCE($2,"startTime"),"endTime"=COALESCE($3,"endTime"),"updatedAt"=NOW() WHERE id=$4 RETURNING *`,
    [dayOfWeek !== undefined ? parseInt(dayOfWeek) : null, startTime || null, endTime || null, id]);

  const infeasibleTasks = await getInfeasibleTasks(userId);
  return { slot: res.rows[0], infeasibleTasks };
};

const deleteSlot = async (id, userId) => {
  const check = await query(`SELECT id FROM "AvailabilitySlot" WHERE id=$1 AND "userId"=$2`, [id, userId]);
  if (!check.rows.length) { const err = new Error('Slot not found'); err.statusCode = 404; throw err; }
  await query(`DELETE FROM "AvailabilitySlot" WHERE id=$1`, [id]);

  const infeasibleTasks = await getInfeasibleTasks(userId);
  return { infeasibleTasks };
};

const bulkReplaceSlots = async (userId, slots) => {
  await query(`DELETE FROM "AvailabilitySlot" WHERE "userId"=$1`, [userId]);
  if (!slots || !slots.length) {
    // All slots removed — every pending task is now infeasible
    const infeasibleTasks = await getInfeasibleTasks(userId);
    return { slots: [], infeasibleTasks };
  }
  for (const { dayOfWeek, startTime, endTime } of slots) {
    await query(
      `INSERT INTO "AvailabilitySlot" ("userId","dayOfWeek","startTime","endTime") VALUES ($1,$2,$3,$4)`,
      [userId, parseInt(dayOfWeek), startTime, endTime]);
  }
  const newSlots = await getSlots(userId);
  const infeasibleTasks = await getInfeasibleTasks(userId);
  return { slots: newSlots, infeasibleTasks };
};

/**
 * After any availability change, check all pending tasks against the
 * (now updated) slots. Returns tasks that can no longer be completed
 * before their deadline.
 */
const getInfeasibleTasks = async (userId) => {
  const tasksRes = await query(
    `SELECT id, title, "dueDate", "userEstimatedTime", "aiPredictedTime"
     FROM "Task"
     WHERE "userId"=$1 AND status != 'COMPLETED'
     ORDER BY "dueDate" ASC`,
    [userId]
  );

  const infeasible = [];
  for (const task of tasksRes.rows) {
    const requiredMinutes = task.aiPredictedTime || task.userEstimatedTime || 60;
    const result = await checkFeasibilityOnly(userId, task.dueDate, requiredMinutes);
    if (!result.feasible) {
      infeasible.push({
        id:       task.id,
        title:    task.title,
        dueDate:  task.dueDate,
        reason:   result.reason,
      });
    }
  }
  return infeasible;
};

module.exports = { createSlot, getSlots, updateSlot, deleteSlot, bulkReplaceSlots, getInfeasibleTasks };
