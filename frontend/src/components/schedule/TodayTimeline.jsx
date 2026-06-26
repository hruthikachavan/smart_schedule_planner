import { clsx } from 'clsx';

const COLOR_MAP = {
  red:    { bg:'bg-red-500',    light:'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  blue:   { bg:'bg-blue-500',   light:'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  green:  { bg:'bg-green-500',  light:'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  amber:  { bg:'bg-amber-500',  light:'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  purple: { bg:'bg-purple-500', light:'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  indigo: { bg:'bg-indigo-500', light:'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' },
  slate:  { bg:'bg-slate-400',  light:'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700' },
};

const TYPE_LABELS = { 'deep-work':'Deep Work 🎯', break:'Break ☕', learning:'Learning 📚', task:'Task ✓' };

export default function TodayTimeline({ schedule }) {
  if (!schedule?.length) return (
    <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No blocks scheduled for today.</p>
  );
  return (
    <div className="space-y-2">
      {schedule.map((block, i) => {
        const colors = COLOR_MAP[block.color] || COLOR_MAP.indigo;
        return (
          <div key={block.id} className="flex items-stretch gap-3 group">
            <div className="flex flex-col items-center w-14 flex-shrink-0 pt-3">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">{block.startTime}</span>
              {i < schedule.length - 1 && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 mt-1" />}
            </div>
            <div className={clsx('flex-1 p-3.5 rounded-xl border transition-all hover:shadow-sm group-hover:-translate-x-0.5', colors.light)}>
              <div className="flex items-center gap-2 mb-0.5">
                <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', colors.bg)} />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{TYPE_LABELS[block.type] || 'Block'}</span>
                <span className="ml-auto text-xs text-slate-400">{block.allocatedMinutes}m</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{block.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{block.startTime} – {block.endTime}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
