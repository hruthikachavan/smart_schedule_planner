import { CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react';
import { Skeleton } from '../common/Loader';

const STATS = [
  { key:'tasksCompleted', label:'Completed',    icon:CheckCircle2, color:'text-green-500',  bg:'bg-green-50 dark:bg-green-900/20',   trend:'Tasks done' },
  { key:'pendingTasks',   label:'Pending',      icon:Clock,        color:'text-amber-500',  bg:'bg-amber-50 dark:bg-amber-900/20',   trend:'In queue' },
  { key:'focusHours',    label:'Focus Hours',   icon:Zap,          color:'text-blue-500',   bg:'bg-blue-50 dark:bg-blue-900/20',     trend:'Today' },
  { key:'productivityScore', label:'Score',     icon:TrendingUp,   color:'text-indigo-500', bg:'bg-indigo-50 dark:bg-indigo-900/20', trend:'Overall' },
];

export default function StatsCards({ stats, loading }) {
  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
    </div>
  );
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(({ key, label, icon:Icon, color, bg, trend }) => (
        <div key={key} className="card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
            <Icon size={18} className={color} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {key==='focusHours' ? `${stats?.[key]??0}h` : key==='productivityScore' ? `${stats?.[key]??0}%` : (stats?.[key]??0)}
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          <p className="text-xs text-indigo-500 mt-1 font-medium">{trend}</p>
        </div>
      ))}
    </div>
  );
}
