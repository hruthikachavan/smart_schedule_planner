import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-white max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8 shadow-lg animate-float">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight">Start your<br />productivity journey.</h1>
          <p className="text-indigo-200 text-lg leading-relaxed">Plan smarter and achieve more with AI-powered scheduling — free to get started.</p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              ['Free',  'No credit card needed'],
              ['AI',    'Personalised scheduling'],
              ['Fast',  'Schedule in seconds'],
              ['Smart', 'Learns your patterns'],
            ].map(([v, l]) => (
              <div key={v} className="bg-white/10 rounded-2xl p-4">
                <p className="text-xl font-black">{v}</p>
                <p className="text-indigo-200 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">AI Planner</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Get started for free. No credit card required.</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                name="reg-name"
                autoComplete="name"
                value={form.name}
                onChange={set('name')}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="reg-email"
                autoComplete="email"
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
                  name="reg-password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Minimum 6 characters"
                  required
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                className="input"
                type="password"
                name="reg-confirm"
                autoComplete="new-password"
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Repeat your password"
                required
              />
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign in</Link>
          </p>
          <p className="mt-2 text-center">
            <Link to={ROUTES.LANDING} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
