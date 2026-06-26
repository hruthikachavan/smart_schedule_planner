import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './index.jsx';
import MainLayout from '../layouts/MainLayout';
import Landing     from '../pages/Landing';
import Login       from '../pages/Login';
import Register    from '../pages/Register';
import Dashboard   from '../pages/Dashboard';
import Tasks       from '../pages/Tasks';
import Schedule    from '../pages/Schedule';
import Availability from '../pages/Availability';
import Insights    from '../pages/Insights';
import Settings    from '../pages/Settings';
import NotFound    from '../pages/NotFound';
import { ROUTES }  from '../constants/routes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public landing */}
      <Route path={ROUTES.LANDING} element={<Landing />} />

      {/* Auth pages (redirect to app if already logged in) */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN}    element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Route>

      {/* Protected app */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD}    element={<Dashboard />} />
          <Route path={ROUTES.TASKS}        element={<Tasks />} />
          <Route path={ROUTES.SCHEDULE}     element={<Schedule />} />
          <Route path={ROUTES.AVAILABILITY} element={<Availability />} />
          <Route path={ROUTES.INSIGHTS}     element={<Insights />} />
          <Route path={ROUTES.SETTINGS}     element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
