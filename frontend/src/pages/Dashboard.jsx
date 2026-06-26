import { useEffect, useState } from 'react';
import HeroSection from '../components/dashboard/HeroSection';
import StatsCards from '../components/dashboard/StatsCards';
import TodayScheduleCard from '../components/dashboard/TodayScheduleCard';
import AIInsightCard from '../components/dashboard/AIInsightCard';
import FocusScoreCard from '../components/dashboard/FocusScoreCard';
import ProductivityQuote from '../components/dashboard/ProductivityQuote';
import QuickActions from '../components/dashboard/QuickActions';
import { analyticsApi, scheduleApi } from '../api';

export default function Dashboard() {
  const [stats,           setStats]           = useState(null);
  const [statsLoading,    setStatsLoading]    = useState(true);
  const [schedule,        setSchedule]        = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch analytics/insights
    analyticsApi.insights()
      .then(r => {
        setStats(r.data);
        setRecommendations(r.data?.recommendations || []);
      })
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));

    // Fetch today's schedule
    scheduleApi.today()
      .then(r => setSchedule(r.data || []))
      .catch(() => setSchedule([]))
      .finally(() => setScheduleLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <HeroSection />
      <StatsCards stats={stats} loading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodayScheduleCard schedule={schedule} loading={scheduleLoading} />
          <AIInsightCard recommendations={recommendations} />
        </div>
        <div className="space-y-6">
          <FocusScoreCard score={stats?.productivityScore ?? 0} />
          <ProductivityQuote />
        </div>
      </div>

      <QuickActions />
    </div>
  );
}
