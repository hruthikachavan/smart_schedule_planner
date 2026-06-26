export default function ProgressRing({ value=0, size=120, stroke=8, color='#6366f1', children }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} stroke={color} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
