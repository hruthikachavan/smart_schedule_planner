import { CheckCircle2, Clock, AlertCircle, ListChecks } from 'lucide-react';

export default function TaskStats({ total = 0, completed = 0, pending = 0 }) {
  const items = [
    { label: 'Total',     value: total,     icon: ListChecks,  color: 'text-indigo-500' },
    { label: 'Completed', value: completed,  icon: CheckCircle2,color: 'text-green-500' },
    { label: 'Pending',   value: pending,    icon: Clock,       color: 'text-amber-500' },
  ];
  return (
    <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
      {items.map(({ label, value, icon: Icon, color }) => (
        <span key={label} className="flex items-center gap-1.5">
          <Icon size={14} className={color} />
          <span className="font-semibold text-slate-700 dark:text-slate-300">{value}</span>
          <span>{label}</span>
        </span>
      ))}
    </div>
  );
}
