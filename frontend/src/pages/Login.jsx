import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-white max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8 shadow-lg animate-float">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight">Plan smarter.<br />Focus deeper.</h1>
          <p className="text-indigo-200 text-lg leading-relaxed">Your AI-powered productivity companion that adapts to how you work best.</p>
          <div className="mt-10 space-y-4">
            {['AI-generated daily schedules', 'Smart task prioritisation', 'Productivity insights & trends'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-indigo-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">AI Planner</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Sign in to your account to continue.</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="login-email"
                autoComplete="username"
                value={form.email}
                onChange={set('email')}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPw ? 'text' : 'password'}
                  name="login-password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign in <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Create one</Link>
          </p>
          <p className="mt-4 text-center">
            <Link to={ROUTES.LANDING} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
