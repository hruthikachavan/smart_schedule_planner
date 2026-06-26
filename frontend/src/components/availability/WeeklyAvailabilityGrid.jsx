import { clsx } from 'clsx';

const DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DOW   = [1,2,3,4,5,6,0]; // Mon=1 … Sun=0 (JS getDay)
const HOURS = Array.from({length:18},(_,i) => {
  const h = i + 6;
  return { label:`${h < 12 ? h : h === 12 ? 12 : h - 12}${h < 12 ? 'am' : 'pm'}`, start:`${String(h).padStart(2,'0')}:00`, end:`${String(h+1).padStart(2,'0')}:00` };
});

/**
 * slots: array of { dayOfWeek:number, startTime:"HH:MM", endTime:"HH:MM" }
 * onChange: (newSlots) => void
 */
export default function WeeklyAvailabilityGrid({ slots = [], onChange }) {
  const isActive = (dow, startTime) => slots.some(s => s.dayOfWeek === dow && s.startTime === startTime);

  const toggle = (dow, startTime, endTime) => {
    if (isActive(dow, startTime)) {
      onChange(slots.filter(s => !(s.dayOfWeek === dow && s.startTime === startTime)));
    } else {
      onChange([...slots, { dayOfWeek: dow, startTime, endTime }]);
    }
  };

  return (
    <div className="overflow-x-auto -mx-1">
      <div className="min-w-[480px] px-1">
        {/* Header */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div />
          {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-1">{d}</div>)}
        </div>
        {/* Grid */}
        {HOURS.map(({ label, start, end }) => (
          <div key={start} className="grid grid-cols-8 gap-1 mb-1">
            <div className="flex items-center justify-end pr-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{label}</span>
            </div>
            {DOW.map(dow => {
              const active = isActive(dow, start);
              return (
                <button key={dow} onClick={() => toggle(dow, start, end)} aria-pressed={active}
                  className={clsx('h-6 rounded transition-all duration-100',
                    active ? 'bg-indigo-500 hover:bg-indigo-600 shadow-sm shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700')} />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
