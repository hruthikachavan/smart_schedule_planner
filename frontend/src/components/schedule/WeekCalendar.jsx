import { clsx } from 'clsx';
import { format } from 'date-fns';

const COLOR_MAP = {
  red:    { bar: 'bg-red-100 dark:bg-red-900/30 border-l-red-500',    text: 'text-red-700 dark:text-red-300',    sub: 'text-red-500',    dot: 'bg-red-400' },
  blue:   { bar: 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500',   text: 'text-blue-700 dark:text-blue-300',   sub: 'text-blue-400',   dot: 'bg-blue-400' },
  amber:  { bar: 'bg-amber-50 dark:bg-amber-900/20 border-l-amber-500', text: 'text-amber-700 dark:text-amber-300', sub: 'text-amber-400',  dot: 'bg-amber-400' },
  green:  { bar: 'bg-green-50 dark:bg-green-900/20 border-l-green-500', text: 'text-green-700 dark:text-green-300', sub: 'text-green-400',  dot: 'bg-green-400' },
  slate:  { bar: 'bg-slate-50 dark:bg-slate-800 border-l-slate-400',   text: 'text-slate-600 dark:text-slate-300', sub: 'text-slate-400',  dot: 'bg-slate-400' },
  indigo: { bar: 'bg-indigo-50 dark:bg-indigo-900/20 border-l-indigo-500', text: 'text-indigo-700 dark:text-indigo-300', sub: 'text-indigo-400', dot: 'bg-indigo-400' },
};

const PRIORITY_LABELS = {
  DO_FIRST:  'Do First',
  SCHEDULE:  'Scheduled',
  DELEGATE:  'Delegate',
  ELIMINATE: 'Eliminate',
};

function TaskBlock({ block }) {
  const c = COLOR_MAP[block.color] || COLOR_MAP.indigo;
  const mins = block.allocatedMinutes;
  const dur = mins >= 60
    ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ''}`
    : `${mins}m`;

  return (
    <div className={clsx('rounded-lg border-l-4 px-3 py-2.5 transition-all hover:shadow-sm', c.bar)}>
      <div className="flex items-start justify-between gap-2">
        <p className={clsx('text-sm font-semibold leading-snug', c.text)}>{block.title}</p>
        <span className={clsx('text-xs font-semibold flex-shrink-0 mt-0.5', c.sub)}>{dur}</span>
      </div>
      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          {block.startTime} – {block.endTime}
        </span>
        {block.category && (
          <span className="text-xs px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-white/50 dark:border-slate-700">
            {block.category}
          </span>
        )}
        {block.priority && (
          <span className={clsx('text-xs font-medium', c.sub)}>
            {PRIORITY_LABELS[block.priority]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function WeekCalendar({ weekSchedule = [], selectedDay, onSelectDay }) {
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-2">
      {weekSchedule.map(({ day, date, blocks, totalHours }) => {
        const isToday    = date === todayStr;
        const isSelected = date === selectedDay;
        const hasBlocks  = blocks && blocks.length > 0;

        return (
          <div
            key={date}
            className={clsx(
              'rounded-xl border transition-all',
              isToday    ? 'border-indigo-300 dark:border-indigo-700' : 'border-slate-200 dark:border-slate-700',
              isSelected ? 'ring-2 ring-indigo-400 dark:ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900' : ''
            )}
          >
            {/* Day header row — click to expand */}
            <button
              onClick={() => onSelectDay?.(date === selectedDay ? null : date)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
            >
              {/* Date badge */}
              <div className={clsx(
                'w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0',
                isToday ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'
              )}>
                <span className={clsx('text-xs font-semibold leading-none', isToday ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400')}>
                  {day}
                </span>
                <span className={clsx('text-xl font-black leading-tight', isToday ? 'text-white' : 'text-slate-800 dark:text-slate-100')}>
                  {date ? format(new Date(date + 'T00:00:00'), 'd') : '—'}
                </span>
              </div>

              {/* Summary */}
              <div className="flex-1 min-w-0">
                {hasBlocks ? (
                  <>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {totalHours}h scheduled
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        · {blocks.length} task{blocks.length !== 1 ? 's' : ''}
                      </span>
                      {isToday && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium">
                          Today
                        </span>
                      )}
                    </div>
                    {/* Color bar preview */}
                    <div className="flex gap-1 items-center">
                      {blocks.slice(0, 7).map((b, i) => (
                        <div
                          key={i}
                          title={b.title}
                          className={clsx(
                            'h-1.5 rounded-full flex-1 max-w-[36px]',
                            (COLOR_MAP[b.color] || COLOR_MAP.indigo).dot
                          )}
                        />
                      ))}
                      {blocks.length > 7 && (
                        <span className="text-xs text-slate-400 ml-0.5">+{blocks.length - 7}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500">No tasks scheduled</span>
                )}
              </div>

              {/* Chevron */}
              {hasBlocks && (
                <svg
                  className={clsx('w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200', isSelected && 'rotate-180')}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* Expanded detail */}
            {isSelected && hasBlocks && (
              <div className="px-3 pb-3 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">
                  {blocks.length} task{blocks.length !== 1 ? 's' : ''} · {totalHours}h total
                </p>
                {blocks.map(block => (
                  <TaskBlock key={block.id} block={block} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}