import { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { getRandomQuote } from '../../theme/quotes';

export default function ProductivityQuote() {
  const [quote, setQuote] = useState(() => getRandomQuote());
  return (
    <div className="card p-5 bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-900/10">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
          <Quote className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">"{quote.text}"</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">— {quote.author}</p>
        </div>
        <button onClick={() => setQuote(getRandomQuote())} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0" aria-label="New quote">
          <RefreshCw size={13} />
        </button>
      </div>
    </div>
  );
}
