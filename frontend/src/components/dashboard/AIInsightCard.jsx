import { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import Button from '../common/Button';

const impactColors = {
  high:   'text-red-500 bg-red-50 dark:bg-red-900/20',
  medium: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  low:    'text-green-500 bg-green-50 dark:bg-green-900/20',
};

export default function AIInsightCard({ recommendations = [] }) {
  const [dismissed, setDismissed] = useState([]);
  const [accepted,  setAccepted]  = useState([]);
  const visible = recommendations.filter(r => !dismissed.includes(r.id) && !accepted.includes(r.id));

  return (
    <Card>
      <CardHeader title="AI Recommendations" subtitle={`${visible.length} suggestion${visible.length !== 1 ? 's' : ''}`} icon={Sparkles} />
      {visible.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">All caught up! No new recommendations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.slice(0,3).map(rec => (
            <div key={rec.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rec.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${impactColors[rec.impact] || impactColors.medium}`}>{rec.impact}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{rec.description}</p>
                </div>
                <button onClick={() => setDismissed(d => [...d, rec.id])} className="text-slate-400 hover:text-slate-600 flex-shrink-0"><X size={14} /></button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="xs" icon={Check} onClick={() => setAccepted(a => [...a, rec.id])}>Accept</Button>
                <Button size="xs" variant="ghost" onClick={() => setDismissed(d => [...d, rec.id])}>Dismiss</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
