import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { availabilityApi } from '../api';
import { useSchedule } from '../context/ScheduleContext';
import PageHeader from '../components/common/PageHeader';
import WeeklyAvailabilityGrid from '../components/availability/WeeklyAvailabilityGrid';
import AvailabilityForm from '../components/availability/AvailabilityForm';
import { CardSkeleton } from '../components/common/Loader';

// Default prefs used only as form fallback — never shown in summary until saved
const DEFAULT_PREFS = {
  wakeTime: '07:00',
  sleepTime: '23:00',
  deepWorkStart: '09:00',
  deepWorkEnd: '12:00',
  preferredStudyTime: 'evening',
};

export default function Availability() {
  const [slots,           setSlots]           = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [saved,           setSaved]           = useState(false);
  const [prefs,           setPrefs]           = useState(DEFAULT_PREFS);
  const [prefsSaved,      setPrefsSaved]      = useState(false);
  const [selDay,          setSelDay]          = useState('Mon');
  // Tasks that can no longer be completed after an availability change
  const [infeasible,      setInfeasible]      = useState([]);
  const [dismissedIds,    setDismissedIds]    = useState(new Set());

  const { refreshSchedule } = useSchedule();

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const r = await availabilityApi.getAll();
      setSlots(r.data || []);
    } catch { setSlots([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  /** After any slot mutation, persist new infeasible task list */
  const applyInfeasible = (tasks = []) => {
    setInfeasible(tasks);
    setDismissedIds(new Set()); // reset dismissals on each change
  };

  const handleGridChange = async (newSlots) => {
    setSlots(newSlots);
    try {
      const r = await availabilityApi.bulkReplace(newSlots);
      applyInfeasible(r.infeasibleTasks || []);
      await refreshSchedule('Availability updated — schedule regenerated.');
    } catch { /* silent fail */ }
  };

  const handleSavePrefs = async (values) => {
    setSaving(true);
    try {
      const r = await availabilityApi.bulkReplace(slots);
      applyInfeasible(r.infeasibleTasks || []);
      setPrefs(values);
      setPrefsSaved(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await refreshSchedule('Preferences saved — schedule regenerated.');
    } catch {} finally { setSaving(false); }
  };

  const dismissTask = (id) =>
    setDismissedIds(prev => new Set([...prev, id]));

  const visibleInfeasible = infeasible.filter(t => !dismissedIds.has(t.id));

  // Summary stats
  const totalSlots    = slots.length;
  const daysWithSlots = new Set(slots.map(s => s.dayOfWeek)).size;
  const summaryWakeTime = prefsSaved ? prefs.wakeTime : '—';
  const summaryDeepWork = prefsSaved ? `${prefs.deepWorkStart}–${prefs.deepWorkEnd}` : '—';

  // Day preview
  const dowIndex = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(selDay);
  const dow      = dowIndex === 6 ? 0 : dowIndex + 1;
  const daySlots = slots.filter(s => s.dayOfWeek === dow);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Availability"
        subtitle="Configure when you're available to work and study"
        action={saved
          ? <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Saved!</span>
          : null}
      />

      {/* ── Infeasibility warnings ── */}
      {visibleInfeasible.length > 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {visibleInfeasible.length === 1
                ? '1 task can no longer be completed before its deadline'
                : `${visibleInfeasible.length} tasks can no longer be completed before their deadlines`}
            </p>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 pl-6">
            Your availability change reduced the time available for these tasks. Please extend their deadlines or restore the removed slots.
          </p>
          <ul className="pl-6 space-y-2">
            {visibleInfeasible.map(task => (
              <li key={task.id} className="flex items-start justify-between gap-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-800 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{task.title}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 leading-relaxed">
                    Due: {new Date(task.dueDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <button
                  onClick={() => dismissTask(task.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0 mt-0.5"
                  title="Dismiss"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Available Days', value: daysWithSlots || '—' },
          { label: 'Total Slots',    value: totalSlots    || '—' },
          { label: 'Wake Time',      value: summaryWakeTime },
          { label: 'Deep Work',      value: summaryDeepWork },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Grid */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Weekly Availability Grid</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click cells to toggle availability. Changes auto-save and regenerate your schedule.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-3 h-3 rounded bg-indigo-500 inline-block" /> Available
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 inline-block ml-2" /> Unavailable
              </div>
            </div>
            {loading
              ? <CardSkeleton rows={8} />
              : <WeeklyAvailabilityGrid slots={slots} onChange={handleGridChange} />
            }
          </div>

          {/* Day Preview */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Day Preview</h3>
              <div className="flex gap-1 flex-wrap">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <button key={d} onClick={() => setSelDay(d)}
                    className={`text-xs px-2 py-1 rounded-lg font-medium transition-all ${selDay === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {daySlots.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No availability set for {selDay}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(s => (
                  <span key={s.id || s.startTime} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium">
                    {s.startTime}–{s.endTime}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">{daySlots.length} slot{daySlots.length !== 1 ? 's' : ''} available on {selDay}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Preferences</h3>
          <AvailabilityForm values={prefs} onChange={setPrefs} onSubmit={handleSavePrefs} loading={saving} />
        </div>
      </div>
    </div>
  );
}
