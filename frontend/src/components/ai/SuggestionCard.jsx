import { Sparkles, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

const IMPACT = {
  high:   'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  low:    'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
};

export default function SuggestionCard({ suggestion, onAccept, onDismiss }) {
  return (
    <div className="card p-4 hover:shadow-md transition-all border-l-4 border-indigo-500">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{suggestion.title}</h4>
            <span className={clsx('text-xs px-1.5 py-0.5 rounded-md font-medium', IMPACT[suggestion.impact] || IMPACT.medium)}>{suggestion.impact}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{suggestion.description}</p>
          <div className="flex gap-3 mt-3">
            {onAccept && (
              <button onClick={() => onAccept(suggestion)} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                Apply <ArrowRight size={12} />
              </button>
            )}
            {onDismiss && (
              <button onClick={() => onDismiss(suggestion.id)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Dismiss</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
