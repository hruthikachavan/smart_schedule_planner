import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25',
  secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
  ghost:     'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
  outline:   'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
  success:   'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20',
};
const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-3 py-2 text-sm rounded-xl gap-2',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-5 py-3 text-base rounded-xl gap-2.5',
};

export default function Button({ children, variant='primary', size='md', loading=false, disabled=false, icon:Icon, className='', onClick, type='button', ...props }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled||loading}
      className={clsx('inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variants[variant], sizes[size], className)} {...props}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4 flex-shrink-0" /> : null}
      {children}
    </button>
  );
}
