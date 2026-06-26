import { format } from 'date-fns';
import { Flame } from 'lucide-react';
import { getGreeting } from '../../utils/date';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';
  return (
    <div className="relative overflow-hidden card p-6 sm:p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 border-0 text-white">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-indigo-200 text-sm font-medium mb-1">{getGreeting()}</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{firstName} 👋</h1>
          <p className="text-indigo-200 mt-1.5 text-sm">Let's make today productive.</p>
        </div>
        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">{format(new Date(), 'EEE, MMM d')}</p>
            <p className="text-indigo-200 text-xs mt-0.5">{format(new Date(), 'yyyy')}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2">
            <Flame className="w-4 h-4 text-orange-300" />
            <div>
              <p className="text-xs text-indigo-200 leading-none mb-0.5">Member since</p>
              <p className="font-bold text-sm leading-none">
                {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
