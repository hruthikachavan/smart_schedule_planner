import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileMenu from './MobileMenu';
import { ScheduleProvider } from '../context/ScheduleContext';
import ScheduleToast from '../components/schedule/ScheduleToast';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user } = useAuth();

  return (
    // Key by user.id so ScheduleProvider fully unmounts/remounts on user switch,
    // clearing all cached schedule state and the initialized flag.
    <ScheduleProvider key={user?.id}>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <MobileMenu />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <ScheduleToast />
    </ScheduleProvider>
  );
}
