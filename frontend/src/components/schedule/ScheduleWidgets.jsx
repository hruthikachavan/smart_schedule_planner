import { Battery, AlertTriangle, RefreshCw } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export function CapacityWidget({ stats }) {
  if (!stats) return null;
  const pct = stats.availableHours > 0 ? Math.round((stats.scheduledHours / stats.availableHours) * 100) : 0;
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Battery className="w-4 h-4 text-indigo-500" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Weekly Capacity</h3>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        {[
          { label:'Available', value:`${stats.availableHours}h`, color:'text-slate-700 dark:text-slate-300' },
          { label:'Scheduled', value:`${stats.scheduledHours}h`, color:'text-indigo-600 dark:text-indigo-400' },
          { label:'Remaining', value:`${stats.remainingHours}h`, color:'text-green-600 dark:text-green-400' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700" style={{ width:`${Math.min(pct,100)}%` }} />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-slate-400">0%</span>
        <span className="text-xs font-medium text-indigo-500">{pct}% used</span>
        <span className="text-xs text-slate-400">100%</span>
      </div>
    </div>
  );
}

export function ScheduleStats({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label:'Tasks Scheduled', value: stats.tasksScheduled },
        { label:'Focus Hours',     value: `${stats.scheduledHours}h` },
        { label:'Utilization',     value: `${stats.utilization}%` },
      ].map(({ label, value }) => (
        <div key={label} className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function GenerationVersionBadge({ version = 0 }) {
  if (!version) return null;
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">v{version}</span>
    </div>
  );
}

export function ScheduleRegenerationModal({ isOpen, onClose, onConfirm, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regenerate Schedule" size="sm">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">Regenerate your schedule?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">This replaces your current schedule with a new AI-optimised plan based on your tasks and availability.</p>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mb-6 text-left">
          <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-0.5 list-disc list-inside">
            <li>Current schedule will be replaced</li>
            <li>Schedule version will increment</li>
          </ul>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Keep current</Button>
          <Button variant="primary" className="flex-1" loading={loading} icon={RefreshCw} onClick={onConfirm}>Regenerate</Button>
        </div>
      </div>
    </Modal>
  );
}

export function DeadlineWarnings({ tasks = [] }) {
  const atRisk = tasks.filter(t => {
    if (t.status === 'COMPLETED') return false;
    const h = (new Date(t.dueDate) - new Date()) / 3_600_000;
    return h < 48;
  });
  if (!atRisk.length) return null;
  return (
    <div className="card p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Upcoming Deadlines</h3>
      </div>
      <div className="space-y-2">
        {atRisk.map(task => {
          const h = Math.round((new Date(task.dueDate) - new Date()) / 3_600_000);
          const overdue = h < 0;
          return (
            <div key={task.id} className={`flex items-center justify-between p-2.5 rounded-xl ${overdue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-white dark:bg-slate-800'}`}>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{task.title}</p>
              <span className={`text-xs font-semibold ${overdue ? 'text-red-500' : 'text-amber-500'}`}>{overdue ? 'Overdue' : `${h}h left`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
