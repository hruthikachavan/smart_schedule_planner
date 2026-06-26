const taskService = require('../services/task.service');

const createTask          = async (req, res, next) => { try { const d = await taskService.createTask(req.user.id, req.body); res.status(201).json({ success:true, data:d }); } catch(e){ next(e); } };
const getTasks            = async (req, res, next) => { try { const d = await taskService.getTasks(req.user.id); res.status(200).json({ success:true, data:d }); } catch(e){ next(e); } };
const getTaskById         = async (req, res, next) => { try { const d = await taskService.getTaskById(req.params.id, req.user.id); res.status(200).json({ success:true, data:d }); } catch(e){ next(e); } };
const updateTask          = async (req, res, next) => { try { const d = await taskService.updateTask(req.params.id, req.user.id, req.body); res.status(200).json({ success:true, data:d }); } catch(e){ next(e); } };
const deleteTask          = async (req, res, next) => { try { await taskService.deleteTask(req.params.id, req.user.id); res.status(200).json({ success:true, message:'Deleted' }); } catch(e){ next(e); } };
const completeTask        = async (req, res, next) => { try { const d = await taskService.completeTask(req.params.id, req.user.id, req.body.actualTime); res.status(200).json({ success:true, data:d }); } catch(e){ next(e); } };
const getPrioritizedTasks = async (req, res, next) => { try { const d = await taskService.getPrioritizedTasks(req.user.id); res.status(200).json({ success:true, data:d }); } catch(e){ next(e); } };
const getQuadrantTasks    = async (req, res, next) => { try { const d = await taskService.getQuadrantTasks(req.user.id); res.status(200).json({ success:true, data:d }); } catch(e){ next(e); } };
const previewAiTime       = async (req, res, next) => { try { const d = await taskService.previewAiTime(req.user.id, req.body.category, req.body.importance, req.body.userEstimatedTime); res.status(200).json({ success:true, data:d }); } catch(e){ next(e); } };

/**
 * POST /tasks/check-feasibility
 * Lightweight read-only endpoint: checks if the task can fit before its deadline.
 * Returns 200 { feasible: true } or propagates a 422 error with a human-readable reason.
 */
const checkFeasibility = async (req, res, next) => {
  try {
    const { dueDate, userEstimatedTime, importance, category } = req.body;
    if (!dueDate) {
      const err = new Error('dueDate is required'); err.statusCode = 400; throw err;
    }
    const { aiPredictedTime } = await taskService.previewAiTime(
      req.user.id, category, importance, userEstimatedTime
    );
    const requiredMinutes = aiPredictedTime || (userEstimatedTime ? parseInt(userEstimatedTime) : 60);
    const result = await taskService.checkFeasibilityOnly(req.user.id, dueDate, requiredMinutes);
    if (!result.feasible) {
      const err = new Error(result.reason); err.statusCode = 422; throw err;
    }
    res.status(200).json({ success: true, data: { feasible: true } });
  } catch (e) { next(e); }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, completeTask, getPrioritizedTasks, getQuadrantTasks, previewAiTime, checkFeasibility };
