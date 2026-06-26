import { Clock, Calendar, Check, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import PriorityBadge from './PriorityBadge';
import { formatDate, formatDuration, isOverdue } from '../../utils/date';
import { clsx } from 'clsx';

export default function TaskCard({ task, onEdit, onDelete, onComplete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = task.status !== 'COMPLETED' && isOverdue(task.dueDate);
  const done    = task.status === 'COMPLETED';

  return (
    <div className={clsx('card p-4 hover:shadow-md transition-all duration-200 group relative', done && 'opacity-60', overdue && 'border-red-200 dark:border-red-900/60')}>
      <div className="flex items-start gap-3">
        {/* Complete toggle */}
        <button onClick={() => !done && onComplete?.(task.id)}
          className={clsx('w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors',
            done ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400')}>
          {done && <Check size={11} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className={clsx('text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug', done && 'line-through text-slate-400')}>{task.title}</h3>
            <div className="relative flex-shrink-0">
              <button onClick={() => setMenuOpen(m => !m)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={15} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 animate-scale-in">
                    <button onClick={() => { onEdit?.(task); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                      <Edit size={13} /> Edit
                    </button>
                    <button onClick={() => { onDelete?.(task.id); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-2">{task.description}</p>}

          <div className="flex flex-wrap gap-2 mb-2">
            <PriorityBadge quadrant={task.priorityQuadrant} importance={task.importance} size="xs" />
            {task.category && (
              <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">{task.category}</span>
            )}
            {done && <span className="text-xs px-2 py-0.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">Completed</span>}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            {task.dueDate && (
              <span className={clsx('flex items-center gap-1', overdue && 'text-red-500 font-medium')}>
                <Calendar size={11} /> {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
              </span>
            )}
            {task.userEstimatedTime && (
              <span className="flex items-center gap-1"><Clock size={11} /> {formatDuration(task.userEstimatedTime)}</span>
            )}
            {task.importance && (
              <span className="flex items-center gap-1">Imp: {task.importance}/5</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
