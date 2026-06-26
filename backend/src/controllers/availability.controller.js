const availabilityService = require('../services/availability.service');
const scheduleService     = require('../services/schedule.service');
const { getWeekRange }    = require('../utils/DateUtils');

const autoRegen = async (userId) => {
  try {
    const { startDate, endDate } = getWeekRange();
    await scheduleService.generateWeeklySchedule(userId, startDate, endDate);
  } catch (e) { console.error('Availability regen failed:', e.message); }
};

const createSlot = async (req, res, next) => {
  try {
    const { slot, infeasibleTasks } = await availabilityService.createSlot(req.user.id, req.body);
    await autoRegen(req.user.id);
    res.status(201).json({ success: true, data: slot, infeasibleTasks });
  } catch (error) { next(error); }
};

const getSlots = async (req, res, next) => {
  try {
    const slots = await availabilityService.getSlots(req.user.id);
    res.status(200).json({ success: true, data: slots });
  } catch (error) { next(error); }
};

const updateSlot = async (req, res, next) => {
  try {
    const { slot, infeasibleTasks } = await availabilityService.updateSlot(req.params.id, req.user.id, req.body);
    await autoRegen(req.user.id);
    res.status(200).json({ success: true, data: slot, infeasibleTasks });
  } catch (error) { next(error); }
};

const deleteSlot = async (req, res, next) => {
  try {
    const { infeasibleTasks } = await availabilityService.deleteSlot(req.params.id, req.user.id);
    await autoRegen(req.user.id);
    res.status(200).json({ success: true, message: 'Slot deleted', infeasibleTasks });
  } catch (error) { next(error); }
};

const bulkReplaceSlots = async (req, res, next) => {
  try {
    const { slots, infeasibleTasks } = await availabilityService.bulkReplaceSlots(req.user.id, req.body.slots);
    await autoRegen(req.user.id);
    res.status(200).json({ success: true, data: slots, infeasibleTasks });
  } catch (error) { next(error); }
};

module.exports = { createSlot, getSlots, updateSlot, deleteSlot, bulkReplaceSlots };
