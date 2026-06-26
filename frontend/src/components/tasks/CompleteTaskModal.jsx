import { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatDuration } from '../../utils/date';

const hmToMins = (h, m) => parseInt(h || 0) * 60 + parseInt(m || 0);

export default function CompleteTaskModal({ isOpen, onClose, task, onConfirm, loading }) {
  const [hours,   setHours]   = useState(0);
  const [minutes, setMinutes] = useState(task?.userEstimatedTime ? task.userEstimatedTime % 60 : 30);

  // Reset when task changes
  useState(() => {
    if (task?.userEstimatedTime) {
      setHours(Math.floor(task.userEstimatedTime / 60));
      setMinutes(task.userEstimatedTime % 60);
    }
  }, [task]);

  const totalMins = hmToMins(hours, minutes);

  const handleConfirm = () => {
    if (totalMins < 1) return;
    onConfirm(totalMins);
  };

  if (!task) return null;

  const estimated = task.userEstimatedTime;
  const aiPredicted = task.aiPredictedTime;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Task" size="sm">
      <div className="space-y-5">
        {/* Task title */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</p>
            {task.category && (
              <span className="text-xs text-slate-400">{task.category}</span>
            )}
          </div>
        </div>

        {/* Time comparison */}
        {(estimated || aiPredicted) && (
          <div className="grid grid-cols-2 gap-3">
            {estimated && (
              <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs text-blue-500 font-medium mb-0.5">Your Estimate</p>
                <p className="text-base font-bold text-blue-700 dark:text-blue-300">{formatDuration(estimated)}</p>
              </div>
            )}
            {aiPredicted && (
              <div className="text-center p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                <p className="text-xs text-indigo-500 font-medium mb-0.5">AI Predicted</p>
                <p className="text-base font-bold text-indigo-700 dark:text-indigo-300">{formatDuration(aiPredicted)}</p>
              </div>
            )}
          </div>
        )}

        {/* Actual time input */}
        <div>
          <label className="label flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" /> Actual Time Taken *
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                className="input text-center"
                type="number" min="0" max="23" step="1"
                value={hours}
                onChange={e => setHours(e.target.value)}
                placeholder="0"
              />
              <span className="text-sm text-slate-500 flex-shrink-0">h</span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <input
                className="input text-center"
                type="number" min="0" max="55" step="5"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                placeholder="30"
              />
              <span className="text-sm text-slate-500 flex-shrink-0">min</span>
            </div>
          </div>
          {totalMins > 0 && (
            <p className="text-xs text-slate-400 mt-1.5">
              Total: {formatDuration(totalMins)}
              {estimated && totalMins !== estimated && (
                <span className={`ml-2 font-medium ${totalMins > estimated ? 'text-amber-500' : 'text-green-500'}`}>
                  ({totalMins > estimated ? '+' : ''}{formatDuration(Math.abs(totalMins - estimated))} vs estimate)
                </span>
              )}
            </p>
          )}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          This helps the AI learn your work patterns and improve future time predictions.
        </p>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            loading={loading}
            onClick={handleConfirm}
            disabled={totalMins < 1}
          >
            Mark Complete
          </Button>
        </div>
      </div>
    </Modal>
  );
}