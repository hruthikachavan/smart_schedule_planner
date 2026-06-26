import { clsx } from 'clsx';

export default function Card({ children, className='', hover=false, padding=true, ...props }) {
  return (
    <div className={clsx('card', padding && 'p-5', hover && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon: Icon, className='' }) {
  return (
    <div className={clsx('flex items-start justify-between mb-4', className)}>
      <div className="flex items-center gap-3">
        {Icon && <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0"><Icon className="text-white" size={17} /></div>}
        <div>
          {title    && <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
