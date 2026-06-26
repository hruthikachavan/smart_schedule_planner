import { LayoutDashboard, CheckSquare, Calendar, Clock, BarChart3, Settings } from 'lucide-react';
import { ROUTES } from './routes';

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: 'Tasks',        icon: CheckSquare,     path: ROUTES.TASKS },
  { label: 'Schedule',     icon: Calendar,        path: ROUTES.SCHEDULE },
  { label: 'Availability', icon: Clock,           path: ROUTES.AVAILABILITY },
  { label: 'Insights',     icon: BarChart3,       path: ROUTES.INSIGHTS },
  { label: 'Settings',     icon: Settings,        path: ROUTES.SETTINGS },
];
