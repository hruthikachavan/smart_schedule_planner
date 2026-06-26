import { Clock, Scissors, Timer, TrendingUp } from 'lucide-react';
import ProgressRing from '../common/ProgressRing';
import { AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';

const TOOLTIP = { contentStyle:{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, fontSize:12 }, labelStyle:{ color:'#94a3b8' }, itemStyle:{ color:'#a5b4fc' } };

export function PreferredTimeCard({ preferredWorkTime }) {
  const icons = { morning:'🌅', afternoon:'☀️', evening:'🌙' };
  return (
    <div className="card p-5 text-center">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-3"><Clock size={17} className="text-white" /></div>
      <p className="text-3xl mb-1">{icons[preferredWorkTime] || '⏰'}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">{preferredWorkTime || '—'}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Peak Productivity Time</p>
    </div>
  );
}

export function ChunkSizeCard({ avgChunkSize = 45 }) {
  const pct = Math.min(Math.round((avgChunkSize / 120) * 100), 100);
  const color = avgChunkSize <= 60 ? '#22c55e' : avgChunkSize <= 90 ? '#f59e0b' : '#ef4444';
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3"><Scissors size={16} className="text-indigo-500" /><h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Avg Chunk Size</h3></div>
      <div className="flex flex-col items-center py-2">
        <ProgressRing value={pct} size={90} stroke={7} color={color}><p className="text-base font-bold text-slate-900 dark:text-slate-100">{avgChunkSize}m</p></ProgressRing>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">{avgChunkSize <= 60 ? 'Great for focused sprints!' : 'Consider smaller chunks.'}</p>
      </div>
    </div>
  );
}

export function DurationMultiplierCard({ durationMultiplier = 1.0 }) {
  const color = durationMultiplier <= 1.1 ? '#22c55e' : durationMultiplier <= 1.3 ? '#f59e0b' : '#ef4444';
  const label = durationMultiplier <= 1.1 ? 'On Track' : durationMultiplier <= 1.3 ? 'Slightly Slow' : 'Needs Adjustment';
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3"><Timer size={16} className="text-indigo-500" /><h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Duration Accuracy</h3></div>
      <div className="text-center py-2">
        <p className="text-4xl font-black" style={{ color }}>{durationMultiplier}×</p>
        <p className="text-sm font-semibold mt-1" style={{ color }}>{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {durationMultiplier > 1.1 ? `Complete tasks ${Math.round((durationMultiplier-1)*100)}% slower than estimated.` : 'Estimates match actual time well!'}
        </p>
      </div>
    </div>
  );
}

export function FocusTrendChart({ focusTrends = [] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} className="text-indigo-500" /><h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Focus Score (7 days)</h3></div>
      {focusTrends.length === 0 ? (
        <div className="h-36 flex items-center justify-center"><p className="text-sm text-slate-400">Complete tasks to see trends</p></div>
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={focusTrends} margin={{ top:4, right:4, left:-28, bottom:0 }}>
              <defs>
                <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#fg)" dot={{ fill:'#6366f1', r:3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function WeeklyCompletionChart({ weeklyCompletion = [] }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Weekly Task Completion</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Tasks completed per week</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyCompletion} margin={{ top:4, right:4, left:-28, bottom:0 }}>
            <XAxis dataKey="week" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP} />
            <Bar dataKey="tasks" fill="#6366f1" radius={[6,6,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
