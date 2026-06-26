import { Plus, Sparkles, Clock, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ROUTES } from '../../constants/routes';

const ACTIONS = [
  { label: 'Create Task',         icon: Plus,      path: ROUTES.TASKS,        color: 'from-indigo-500 to-blue-600' },
  { label: 'Generate Schedule',   icon: Sparkles,  path: ROUTES.SCHEDULE,     color: 'from-purple-500 to-indigo-600' },
  { label: 'Set Availability',    icon: Clock,     path: ROUTES.AVAILABILITY, color: 'from-blue-500 to-cyan-600' },
  { label: 'View Insights',       icon: BarChart3, path: ROUTES.INSIGHTS,     color: 'from-emerald-500 to-teal-600' },
];

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map(({ label, icon: Icon, path, color }) => (
          <button key={label} onClick={() => navigate(path)}
            className={clsx('flex flex-col items-center gap-2.5 p-4 rounded-2xl text-white font-medium text-xs bg-gradient-to-br shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200', color)}>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"><Icon size={18} /></div>
            <span className="text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
