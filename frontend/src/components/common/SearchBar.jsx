import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function SearchBar({ value, onChange, placeholder='Search…', className='' }) {
  return (
    <div className={clsx('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input pl-9 pr-9" />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
