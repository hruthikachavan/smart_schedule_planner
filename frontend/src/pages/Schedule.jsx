import { useEffect, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { scheduleApi, taskApi } from '../api';
import { getWeekRange } from '../utils/date';
import { useSchedule } from '../context/ScheduleContext';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import TodayTimeline from '../components/schedule/TodayTimeline';
import WeekCalendar from '../components/schedule/WeekCalendar';
import {
  CapacityWidget, ScheduleStats, GenerationVersionBadge,
  ScheduleRegenerationModal, DeadlineWarnings
} from '../components/schedule/ScheduleWidgets';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Loader';
import { clsx } from 'clsx';

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getWeekRangeFromDate(baseDate) {
  const start = new Date(baseDate); start.setHours(0,0,0,0);
  const end   = new Date(start); end.setDate(end.getDate()+6); end.setHours(23,59,59,999);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

export default function Schedule() {
  const [tasks,         setTasks]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [generating,    setGenerating]    = useState(false);
  const [regenModal,    setRegenModal]    = useState(false);
  const [viewMode,      setViewMode]      = useState('today');
  const [weekBase,      setWeekBase]      = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [selectedDay,   setSelectedDay]   = useState(null);

  const { todayBlocks, weekData: ctxWeekData, stats: ctxStats, refreshing, isInitialized, refreshSchedule } = useSchedule();

  const [localWeekData, setLocalWeekData] = useState(null);
  const [localStats,    setLocalStats]    = useState(null);

  const weekData = localWeekData ?? ctxWeekData;
  const stats    = localStats    ?? ctxStats;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getWeekRangeFromDate(weekBase);
      const isCurrentWeek = weekBase.toDateString() === (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })().toDateString();

      const [weekRes, statsRes, tasksRes] = await Promise.all([
        scheduleApi.week(startDate, endDate),
        scheduleApi.stats(),
        taskApi.getAll(),
      ]);

      if (!isCurrentWeek) {
        setLocalWeekData(weekRes.data || []);
        setLocalStats(statsRes.data);
      } else {
        setLocalWeekData(null);
        setLocalStats(null);
      }
      setTasks(tasksRes.data || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [weekBase]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Re-sync tasks when context refreshes
  useEffect(() => {
    if (!refreshing && (todayBlocks.length > 0 || ctxWeekData.length > 0)) {
      taskApi.getAll().then(r => setTasks(r.data || [])).catch(() => {});
      setLoading(false);
    }
  }, [refreshing, todayBlocks, ctxWeekData]);

  // Also stop the local loading spinner once context finishes its init fetch
  useEffect(() => {
    if (!refreshing) setLoading(false);
  }, [refreshing]);

  const handleGenerate = async () => {
    setRegenModal(false);
    setGenerating(true);
    try {
      const { startDate, endDate } = getWeekRange();
      await scheduleApi.generate({ startDate, endDate });
      await refreshSchedule('Schedule generated successfully.');
      await fetchAll();
    } catch { /* silent */ }
    finally { setGenerating(false); }
  };

  const prevWeek = () => {
    setLocalWeekData(null);
    const d = new Date(weekBase); d.setDate(d.getDate()-7); setWeekBase(d);
  };
  const nextWeek = () => {
    setLocalWeekData(null);
    const d = new Date(weekBase); d.setDate(d.getDate()+7); setWeekBase(d);
  };
  const goToday = () => {
    setLocalWeekData(null);
    const d = new Date(); d.setHours(0,0,0,0); setWeekBase(d);
  };

  const weekEnd   = new Date(weekBase); weekEnd.setDate(weekEnd.getDate()+6);
  const weekLabel = weekBase.getMonth() === weekEnd.getMonth()
    ? `${MONTHS[weekBase.getMonth()]} ${weekBase.getDate()}–${weekEnd.getDate()}, ${weekBase.getFullYear()}`
    : `${MONTHS[weekBase.getMonth()]} ${weekBase.getDate()} – ${MONTHS[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekBase.getFullYear()}`;

  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const hasTasks     = pendingTasks.length > 0;
  const hasSchedule  = todayBlocks.length > 0 || weekData.some(d => d.blocks?.length > 0);
  const isRefreshing = refreshing || generating;

  // While the context is doing its initial auto-generate, show skeletons
  const isInitializing = !isInitialized || ((loading || refreshing) && !hasSchedule);

  const selectedDayBlocks = selectedDay
    ? (weekData.find(d => d.date === selectedDay)?.blocks || [])
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Schedule"
        subtitle={
          <span className="flex items-center gap-2">
            Your AI-optimised daily plan
            {isRefreshing && (
              <span className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {generating ? 'Generating…' : 'Updating…'}
              </span>
            )}
          </span>
        }
        action={
          <div className="flex items-center gap-2 flex-wrap">
            {stats?.version > 0 && <GenerationVersionBadge version={stats.version} />}
            {hasSchedule && (
              <Button icon={RefreshCw} variant="secondary" size="sm" onClick={() => setRegenModal(true)} loading={isRefreshing}>Regenerate</Button>
            )}
            <Button icon={Sparkles} size="sm" loading={isRefreshing}
              onClick={hasSchedule ? () => setRegenModal(true) : handleGenerate}>
              {hasSchedule ? 'New Schedule' : 'Generate Schedule'}
            </Button>
          </div>
        }
      />

      {/* Initial load — show skeletons while context auto-generates */}
      {isInitializing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <CardSkeleton key={i} rows={1} />)}</div>
          <CardSkeleton rows={6} />
        </div>

      ) : !hasSchedule ? (
        /* No schedule and not currently generating — show contextual empty state */
        <div className="card p-0">
          <EmptyState
            icon={Calendar}
            title={!hasTasks ? 'No tasks yet' : 'No schedule yet'}
            description={
              !hasTasks
                ? 'Add tasks first, then your schedule will be generated automatically.'
                : 'Add your availability slots and your schedule will generate automatically. Or click below to generate now.'
            }
            action={hasTasks ? handleGenerate : undefined}
            actionLabel="Generate AI Schedule"
          />
        </div>

      ) : (
        <>
          <ScheduleStats stats={stats} />
          <DeadlineWarnings tasks={tasks} />

          {/* View toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              {[{id:'today', label:'Today'}, {id:'week', label:'Weekly'}].map(v => (
                <button key={v.id} onClick={() => setViewMode(v.id)}
                  className={clsx('px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                    viewMode === v.id
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200')}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {viewMode === 'today' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 card p-5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Today's Timeline
                </h3>
                {todayBlocks.length === 0 ? (
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No tasks scheduled for today.</p>
                ) : (
                  <TodayTimeline schedule={todayBlocks} />
                )}
              </div>
              <div className="space-y-4">
                <CapacityWidget stats={stats} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Week navigation */}
              <div className="flex items-center justify-between card p-3">
                <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><ChevronLeft size={18} /></button>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{weekLabel}</p>
                  <button onClick={goToday} className="text-xs text-indigo-500 hover:text-indigo-700 mt-0.5">Go to this week</button>
                </div>
                <button onClick={nextWeek} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><ChevronRight size={18} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-5">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Weekly View</h3>
                  <WeekCalendar
                    weekSchedule={weekData}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                  />
                </div>
                <div className="space-y-4">
                  <CapacityWidget stats={stats} />
                  {selectedDay && (
                    <div className="card p-5">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}
                      </h3>
                      {selectedDayBlocks.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">No tasks scheduled</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedDayBlocks.map(b => (
                            <div key={b.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                              <div className={`w-2 h-2 rounded-full bg-${b.color}-500 flex-shrink-0`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{b.title}</p>
                                <p className="text-xs text-slate-400">{b.startTime} – {b.endTime}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ScheduleRegenerationModal isOpen={regenModal} onClose={() => setRegenModal(false)} onConfirm={handleGenerate} loading={isRefreshing} />
    </div>
  );
}
