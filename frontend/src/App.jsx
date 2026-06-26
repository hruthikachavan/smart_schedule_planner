import { BrowserRouter } from 'react-router-dom';
import { AppProvider }      from './context/AppContext';
import { AuthProvider }     from './context/AuthContext';
import { ScheduleProvider } from './context/ScheduleContext';
import AppRoutes            from './routes/AppRoutes';
import ScheduleToast        from './components/schedule/ScheduleToast';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <ScheduleProvider>
            <AppRoutes />
            <ScheduleToast />
          </ScheduleProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
