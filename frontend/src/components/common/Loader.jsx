import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export function Skeleton({ className='' }) {
  return <div className={clsx('animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl', className)} />;
}
export function CardSkeleton({ rows=3 }) {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({length:rows}).map((_,i) => <Skeleton key={i} className={clsx('h-3', i%2===0?'w-full':'w-4/5')} />)}
    </div>
  );
}
export function PageLoader() {
  return <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
}
export default function Loader({ size='md', className='' }) {
  const sizes = { sm:'w-4 h-4', md:'w-6 h-6', lg:'w-8 h-8' };
  return <Loader2 className={clsx('animate-spin text-indigo-500', sizes[size], className)} />;
}
