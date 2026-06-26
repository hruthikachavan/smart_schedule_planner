const router  = require('express').Router();
const protect = require('../middlewares/auth.middleware');
const taskController = require('../controllers/task.controller');

router.use(protect);

router.get('/',                     taskController.getTasks);
router.post('/',                    taskController.createTask);
router.post('/preview-ai',          taskController.previewAiTime);
router.post('/check-feasibility',   taskController.checkFeasibility);
router.get('/prioritized',          taskController.getPrioritizedTasks);
router.get('/quadrants',            taskController.getQuadrantTasks);
router.get('/:id',                  taskController.getTaskById);
router.put('/:id',                  taskController.updateTask);
router.delete('/:id',               taskController.deleteTask);
router.patch('/:id/complete',       taskController.completeTask);

module.exports = router;
