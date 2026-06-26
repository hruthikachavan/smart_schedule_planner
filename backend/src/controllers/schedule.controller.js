const scheduleService = require('../services/schedule.service');

const generateSchedule = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const schedule = await scheduleService.generateWeeklySchedule(req.user.id, startDate, endDate);
    res.status(200).json({ success: true, data: schedule });
  } catch (error) { next(error); }
};

const getWeekSchedule = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await scheduleService.getWeekSchedule(req.user.id, startDate, endDate);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const getTodaySchedule = async (req, res, next) => {
  try {
    const data = await scheduleService.getTodaySchedule(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

const regenerateSchedule = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await scheduleService.regenerateSchedule(req.user.id, startDate, endDate);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const getScheduleStats = async (req, res, next) => {
  try {
    const stats = await scheduleService.getScheduleStats(req.user.id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

module.exports = { generateSchedule, getWeekSchedule, getTodaySchedule, regenerateSchedule, getScheduleStats };
