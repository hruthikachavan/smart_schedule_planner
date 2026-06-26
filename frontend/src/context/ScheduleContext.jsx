import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { scheduleApi, taskApi, availabilityApi } from '../api';
import { getWeekRange } from '../utils/date';

const ScheduleContext = createContext(null);

export function ScheduleProvider({ children }) {
  const [todayBlocks,  setTodayBlocks]  = useState([]);
  const [weekData,     setWeekData]     = useState([]);
  const [stats,        setStats]        = useState(null);
  const [refreshing,   setRefreshing]   = useState(false);
  const [toast,        setToast]        = useState(null);
  const toastTimer  = useRef(null);
  const initialized = useRef(false);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch current schedule data and return whether a schedule exists
  const fetchData = useCallback(async () => {
    const { startDate, endDate } = getWeekRange();
    const [todayRes, weekRes, statsRes] = await Promise.all([
      scheduleApi.today(),
      scheduleApi.week(startDate, endDate),
      scheduleApi.stats(),
    ]);
    const today = todayRes.data  || [];
    const week  = weekRes.data   || [];
    const st    = statsRes.data;
    setTodayBlocks(today);
    setWeekData(week);
    setStats(st);
    const hasSchedule = today.length > 0 || week.some(d => d.blocks?.length > 0);
    return hasSchedule;
  }, []);

  // On mount: fetch data; if empty but tasks+availability exist, auto-generate
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      setRefreshing(true);
      try {
        const hasSchedule = await fetchData();
        if (!hasSchedule) {
          // Check whether there's anything to schedule
          const [tasksRes, slotsRes] = await Promise.all([
            taskApi.getAll(),
            availabilityApi.getAll(),
          ]);
          const pendingTasks = (tasksRes.data || []).filter(t => t.status !== 'COMPLETED');
          const slots        = slotsRes.data || [];

          if (pendingTasks.length > 0 && slots.length > 0) {
            // Auto-generate silently — no toast on first load
            const { startDate, endDate } = getWeekRange();
            await scheduleApi.generate({ startDate, endDate });
            await fetchData();
          }
        }
      } catch { /* silent */ }
      finally { setRefreshing(false); }
    };

    init();
  }, [fetchData]);

  // Called by Tasks/Availability pages after they mutate data — schedule already
  // regenerated on the backend, so just re-fetch and show a toast.
  const refreshSchedule = useCallback(async (toastMsg) => {
    setRefreshing(true);
    try {
      await fetchData();
      if (toastMsg) showToast(toastMsg);
    } catch { /* silent */ }
    finally { setRefreshing(false); }
  }, [fetchData, showToast]);

  return (
    <ScheduleContext.Provider value={{ todayBlocks, weekData, stats, refreshing, refreshSchedule, toast, showToast }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedule must be within ScheduleProvider');
  return ctx;
};
