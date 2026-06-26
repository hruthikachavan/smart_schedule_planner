import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => storage.get('theme', 'light'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storage.set('theme', theme);
  }, [theme]);

  const toggleTheme   = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const toggleSidebar = () => setSidebarCollapsed(c => !c);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen, closeMobileMenu }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be within AppProvider');
  return ctx;
};
