import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';

export const formatDate     = (d) => format(new Date(d), 'MMM d, yyyy');
export const formatTime     = (d) => format(new Date(d), 'h:mm a');
export const formatRelative = (d) => formatDistanceToNow(new Date(d), { addSuffix: true });
export const formatShort    = (d) => format(new Date(d), 'MMM d');
export const formatISO      = (d) => format(new Date(d), "yyyy-MM-dd'T'HH:mm");
export const getDayName     = (d) => format(new Date(d), 'EEEE');
export const isOverdue      = (d) => isPast(new Date(d)) && !isToday(new Date(d));
export const isDueToday     = (d) => isToday(new Date(d));
export const isDueTomorrow  = (d) => isTomorrow(new Date(d));
export const formatDuration = (m) => {
  if (!m) return '—';
  const h = Math.floor(m / 60); const min = m % 60;
  return h > 0 ? (min > 0 ? `${h}h ${min}m` : `${h}h`) : `${min}m`;
};
export const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
};
export const getWeekRange = () => {
  const start = new Date(); start.setHours(0,0,0,0);
  const end   = new Date(start); end.setDate(end.getDate()+6); end.setHours(23,59,59,999);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};
