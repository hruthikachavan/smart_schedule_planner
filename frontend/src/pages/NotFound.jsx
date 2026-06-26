import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';
import { ROUTES } from '../constants/routes';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
      <div className="text-center">
        <p className="text-8xl font-black gradient-text mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Page not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
        <Button icon={Home} onClick={() => navigate(ROUTES.LANDING)}>Go to Home</Button>
      </div>
    </div>
  );
}
