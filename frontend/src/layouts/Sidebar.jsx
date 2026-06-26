import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Zap, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { SIDEBAR_ITEMS } from '../constants/sidebarItems';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { clsx } from 'clsx';
import { ROUTES } from '../constants/routes';

export default function Sidebar() {
  const { user, logout }                                            = useAuth();
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar }    = useApp();
  const navigate                                                    = useNavigate();

  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN); };

  return (
    <aside className={clsx('hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-30 flex-shrink-0',
      sidebarCollapsed ? 'w-16' : 'w-60')}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
          <Zap size={16} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">AI Planner</p>
            <p className="text-xs text-slate-400 truncate">Productivity</p>
          </div>
        )}
        <button onClick={toggleSidebar} className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0" aria-label="Toggle sidebar">
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, path }) => (
          <NavLink key={path} to={path} end={path === ROUTES.DASHBOARD}
            className={({ isActive }) => clsx('sidebar-item', isActive ? 'sidebar-item-active' : 'sidebar-item-inactive')}
            title={sidebarCollapsed ? label : undefined}>
            <Icon size={18} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
        <button onClick={toggleTheme} className="sidebar-item sidebar-item-inactive w-full" title={sidebarCollapsed ? 'Toggle theme' : undefined}>
          {theme === 'dark' ? <Sun size={18} className="flex-shrink-0" /> : <Moon size={18} className="flex-shrink-0" />}
          {!sidebarCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user.name?.[0] ?? 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="sidebar-item w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600" title={sidebarCollapsed ? 'Logout' : undefined}>
          <LogOut size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
