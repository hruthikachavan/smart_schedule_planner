const router  = require('express').Router();
const protect = require('../middlewares/auth.middleware');
const scheduleController = require('../controllers/schedule.controller');

router.use(protect);

router.post('/generate',    scheduleController.generateSchedule);
router.post('/regenerate',  scheduleController.regenerateSchedule);
router.get('/today',        scheduleController.getTodaySchedule);
router.get('/week',         scheduleController.getWeekSchedule);
router.get('/stats',        scheduleController.getScheduleStats);

module.exports = router;
