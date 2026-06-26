import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useSchedule } from '../../context/ScheduleContext';

export default function ScheduleToast() {
  const { toast, showToast } = useSchedule();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
    } else {
      // Fade out before removing
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!toast && !visible) return null;

  return (
    <div
      className={clsx(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl',
        'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
        'transition-all duration-300',
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
        <Sparkles size={15} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Schedule Updated</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{toast?.message}</p>
      </div>
      <button
        onClick={() => showToast(null)}
        className="ml-1 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
      >
        <X size={13} />
      </button>
    </div>
  );
}
