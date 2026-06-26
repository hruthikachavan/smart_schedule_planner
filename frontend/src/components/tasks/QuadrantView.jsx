import TaskCard from './TaskCard';
import { clsx } from 'clsx';

const QUADRANTS = [
  { id: 'DO_FIRST',  label: 'Do First',  subtitle: 'Urgent & Important',    colorBorder: 'border-red-400 dark:border-red-700',    colorBg: 'bg-red-50 dark:bg-red-900/10' },
  { id: 'SCHEDULE',  label: 'Schedule',  subtitle: 'Important, Not Urgent',  colorBorder: 'border-blue-400 dark:border-blue-700',  colorBg: 'bg-blue-50 dark:bg-blue-900/10' },
  { id: 'DELEGATE',  label: 'Delegate',  subtitle: 'Urgent, Not Important',  colorBorder: 'border-amber-400 dark:border-amber-700',colorBg: 'bg-amber-50 dark:bg-amber-900/10' },
  { id: 'ELIMINATE', label: 'Eliminate', subtitle: 'Neither',                colorBorder: 'border-slate-300 dark:border-slate-600',colorBg: 'bg-slate-50 dark:bg-slate-900/20' },
];

export default function QuadrantView({ tasks, onEdit, onDelete, onComplete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {QUADRANTS.map(q => {
        const qTasks = tasks.filter(t => (t.priorityQuadrant || 'ELIMINATE') === q.id);
        return (
          <div key={q.id} className={clsx('rounded-2xl border-2 p-4', q.colorBorder, q.colorBg)}>
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.label}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{q.subtitle} · {qTasks.length} task{qTasks.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="space-y-2 min-h-[80px]">
              {qTasks.length === 0
                ? <p className="text-xs text-slate-400 italic py-4 text-center">No tasks here</p>
                : qTasks.map(t => <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onComplete={onComplete} />)
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
