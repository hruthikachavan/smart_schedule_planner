import { formatDate, formatDuration } from '../../utils/date';
import PriorityBadge from './PriorityBadge';
import { clsx } from 'clsx';

export default function TaskTimeline({ tasks }) {
  const sorted = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return (
    <div className="relative pl-6">
      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-4">
        {sorted.map(task => (
          <div key={task.id} className="relative flex gap-4">
            <div className={clsx('absolute -left-4 w-3 h-3 rounded-full border-2 border-white dark:border-slate-950 mt-1.5',
              task.status === 'COMPLETED' ? 'bg-green-500' : task.priorityQuadrant === 'DO_FIRST' ? 'bg-red-500' : 'bg-indigo-500')} />
            <div className="card p-3.5 flex-1 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</h4>
                <PriorityBadge quadrant={task.priorityQuadrant} importance={task.importance} size="xs" />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>Due {formatDate(task.dueDate)}</span>
                {task.userEstimatedTime && <span>· {formatDuration(task.userEstimatedTime)}</span>}
                {task.category && <span>· {task.category}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
