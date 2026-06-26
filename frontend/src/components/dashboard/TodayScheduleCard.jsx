import { Calendar, ChevronRight } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import { CardSkeleton } from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const colorMap = { red:'bg-red-500', blue:'bg-blue-500', green:'bg-green-500', amber:'bg-amber-500', purple:'bg-purple-500', indigo:'bg-indigo-500', slate:'bg-slate-400' };
const bgMap    = { 'deep-work':'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800', task:'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', break:'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' };

export default function TodayScheduleCard({ schedule, loading }) {
  const navigate = useNavigate();
  if (loading) return <CardSkeleton rows={4} />;
  return (
    <Card>
      <CardHeader title="Today's Schedule" icon={Calendar}
        action={<button onClick={() => navigate(ROUTES.SCHEDULE)} className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1 font-medium">View all <ChevronRight size={14} /></button>}
      />
      {!schedule?.length ? (
        <EmptyState icon={Calendar} title="No schedule yet" description="Generate your AI schedule to see today's plan." action={() => navigate(ROUTES.SCHEDULE)} actionLabel="Generate Schedule" />
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {schedule.map(block => (
            <div key={block.id} className={clsx('flex items-center gap-3 p-3 rounded-xl border text-sm', bgMap[block.type] || bgMap.task)}>
              <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', colorMap[block.color] || 'bg-indigo-500')} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{block.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{block.startTime} – {block.endTime}</p>
              </div>
              {block.allocatedMinutes && <span className="text-xs text-slate-400 flex-shrink-0">{block.allocatedMinutes}m</span>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
