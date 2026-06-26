import { clsx } from 'clsx';

const STATUS_OPTS = [
  { value: 'all',       label: 'All' },
  { value: 'PENDING',   label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
];
const QUAD_OPTS = [
  { value: 'all',      label: 'All' },
  { value: 'DO_FIRST', label: 'Do First' },
  { value: 'SCHEDULE', label: 'Schedule' },
  { value: 'DELEGATE', label: 'Delegate' },
];

export default function TaskFilters({ filters, onChange }) {
  const set = (k) => (v) => onChange({ ...filters, [k]: v });
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <FilterGroup label="Status"   value={filters.status}   options={STATUS_OPTS} onChange={set('status')} />
      <FilterGroup label="Priority" value={filters.quadrant} options={QUAD_OPTS}   onChange={set('quadrant')} />
    </div>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">{label}:</span>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={clsx('px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
            value === o.value
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700')}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
