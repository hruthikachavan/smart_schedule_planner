import { NavLink, useNavigate } from 'react-router-dom';
import { X, LogOut, Zap, Sun, Moon } from 'lucide-react';
import { SIDEBAR_ITEMS } from '../constants/sidebarItems';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { ROUTES } from '../constants/routes';

export default function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu, theme, toggleTheme } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  if (!mobileMenuOpen) return null;

  const handleLogout = () => { logout(); closeMobileMenu(); navigate(ROUTES.LOGIN); };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-up">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center"><Zap size={16} className="text-white" /></div>
          <span className="font-bold text-slate-900 dark:text-slate-100">AI Planner</span>
          <button onClick={closeMobileMenu} className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink key={path} to={path} end={path === ROUTES.DASHBOARD} onClick={closeMobileMenu}
              className={({ isActive }) => clsx('sidebar-item', isActive ? 'sidebar-item-active' : 'sidebar-item-inactive')}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-6 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">{user.name?.[0]}</span>
              </div>
              <div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p><p className="text-xs text-slate-400">{user.email}</p></div>
            </div>
          )}
          <button onClick={toggleTheme} className="sidebar-item sidebar-item-inactive w-full">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={handleLogout} className="sidebar-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
