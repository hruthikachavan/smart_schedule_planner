import { Target } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import ProgressRing from '../common/ProgressRing';

export default function FocusScoreCard({ score = 0 }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : score > 0 ? '#ef4444' : '#94a3b8';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score > 0 ? 'Needs Work' : 'No Data Yet';
  return (
    <Card>
      <CardHeader title="Focus Score" subtitle="Today's performance" icon={Target} />
      <div className="flex flex-col items-center py-4">
        <ProgressRing value={score} size={120} stroke={10} color={color}>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}</p>
            <p className="text-xs text-slate-400">/ 100</p>
          </div>
        </ProgressRing>
        <p className="mt-3 text-sm font-semibold" style={{ color }}>{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center max-w-[160px]">
          {score === 0 ? 'Complete tasks to build your score.' : score >= 80 ? "You're in the zone! Keep it up." : score >= 60 ? 'Good progress. Push a bit more.' : 'Take a break and refocus.'}
        </p>
      </div>
    </Card>
  );
}
