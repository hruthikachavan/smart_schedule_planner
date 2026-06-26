export const capitalize   = (s='') => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g,' ');
export const truncate     = (s='', n=80) => s.length>n ? s.slice(0,n)+'…' : s;
export const formatPercent= (v) => `${Math.round(v)}%`;
