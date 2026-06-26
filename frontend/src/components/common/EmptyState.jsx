import Button from './Button';

export default function EmptyState({ icon:Icon, title, description, action, actionLabel, secondaryAction, secondaryLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/20 flex items-center justify-center mb-4 shadow-inner">
          <Icon className="w-8 h-8 text-indigo-400 dark:text-indigo-500" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6 leading-relaxed">{description}</p>}
      {action && (
        <div className="flex gap-3">
          <Button onClick={action} size="sm">{actionLabel||'Get Started'}</Button>
          {secondaryAction && <Button onClick={secondaryAction} size="sm" variant="outline">{secondaryLabel}</Button>}
        </div>
      )}
    </div>
  );
}
