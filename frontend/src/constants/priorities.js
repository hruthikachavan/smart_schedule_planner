// Backend uses importance: 1-5
export const IMPORTANCE_OPTIONS = [
  { value: 5, label: 'Critical (5)' },
  { value: 4, label: 'High (4)' },
  { value: 3, label: 'Medium (3)' },
  { value: 2, label: 'Low (2)' },
  { value: 1, label: 'Minimal (1)' },
];

// Backend quadrant names → display config
export const QUADRANT_CONFIG = {
  DO_FIRST:  { label: 'Do First',  bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-700 dark:text-red-400',    dot: 'bg-red-500' },
  SCHEDULE:  { label: 'Schedule',  bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-700 dark:text-blue-400',   dot: 'bg-blue-500' },
  DELEGATE:  { label: 'Delegate',  bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  ELIMINATE: { label: 'Eliminate', bg: 'bg-slate-100 dark:bg-slate-800',    text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
};

export const getQuadrantConfig = (q) => QUADRANT_CONFIG[q] || QUADRANT_CONFIG.SCHEDULE;
