import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { analyticsApi } from '../api';
import PageHeader from '../components/common/PageHeader';
import {
  PreferredTimeCard, ChunkSizeCard, DurationMultiplierCard,
  FocusTrendChart, WeeklyCompletionChart
} from '../components/insights/InsightCharts';
import SuggestionCard from '../components/ai/SuggestionCard';
import { CardSkeleton, PageLoader } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Insights() {
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    analyticsApi.insights()
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Insights" subtitle="Your productivity analytics" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <CardSkeleton key={i} rows={3} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2].map(i => <CardSkeleton key={i} rows={5} />)}
      </div>
    </div>
  );

  const isEmpty = !data || (data.totalTasks === 0);
  const visibleRecs = (data?.recommendations || []).filter(r => !dismissed.includes(r.id));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Insights" subtitle="Your productivity analytics & AI recommendations" />

      {isEmpty ? (
        <div className="card p-0">
          <EmptyState
            icon={BarChart3}
            title="No insights yet"
            description="Add tasks and complete them to unlock your productivity analytics, trends, and AI recommendations."
          />
        </div>
      ) : (
        <>
          {/* Top metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <PreferredTimeCard preferredWorkTime={data.preferredWorkTime} />
            <ChunkSizeCard avgChunkSize={data.avgChunkSize} />
            <DurationMultiplierCard durationMultiplier={data.durationMultiplier} />

            {/* Completion rate */}
            <div className="card p-5 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-3 shadow-lg shadow-green-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{data.completionRate}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Completion Rate</p>
              <p className="text-xs font-semibold mt-1.5" style={{ color: data.completionRate >= 60 ? '#22c55e' : '#f59e0b' }}>
                {data.tasksCompleted}/{data.totalTasks} tasks
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FocusTrendChart focusTrends={data.focusTrends} />
            <WeeklyCompletionChart weeklyCompletion={data.weeklyCompletion} />
          </div>

          {/* AI Recommendations */}
          {visibleRecs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                AI Recommendations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleRecs.map(r => (
                  <SuggestionCard key={r.id} suggestion={r} onDismiss={id => setDismissed(d => [...d, id])} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
