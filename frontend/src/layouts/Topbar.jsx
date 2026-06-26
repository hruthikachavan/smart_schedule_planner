import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function Topbar() {
  const { theme, toggleTheme, setMobileMenuOpen } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 flex items-center px-4 gap-3">
      <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Open menu">
        <Menu size={18} />
      </button>
      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 lg:hidden">AI Planner</span>
      <div className="ml-auto flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Notifications">
          <Bell size={16} />
        </button>
        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button onClick={() => navigate(ROUTES.SETTINGS)} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm" aria-label="Profile">
          <span className="text-white text-xs font-bold">{user?.name?.[0] ?? 'U'}</span>
        </button>
      </div>
    </header>
  );
}
