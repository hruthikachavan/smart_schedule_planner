import { useState } from 'react';
import { User, Palette, Zap, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { clsx } from 'clsx';
import { ROUTES } from '../constants/routes';

function Section({ title, icon: Icon, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <Icon size={16} className="text-indigo-500" />
        </div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        {desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)} role="switch" aria-checked={value}
        className={clsx('relative rounded-full transition-colors focus:outline-none', value ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700')}
        style={{ width:40, height:22 }}>
        <span className={clsx('absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform', value ? 'translate-x-[18px]' : 'translate-x-0')} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { user, logout }       = useAuth();
  const { theme, toggleTheme } = useApp();
  const navigate               = useNavigate();
  const [aiPrefs,  setAiPrefs] = useState({ recommendations: true, learning: true });
  const [deleteModal, setDeleteModal] = useState(false);

  const toggleAi = k => setAiPrefs(a => ({ ...a, [k]: !a[k] }));

  const handleDelete = () => { logout(); navigate(ROUTES.LANDING); };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white text-2xl font-black">{user?.name?.[0] || 'U'}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          Profile editing will be available in a future update. Your name and email are set at registration.
        </p>
      </Section>

      {/* Theme */}
      <Section title="Appearance" icon={Palette}>
        <div className="grid grid-cols-2 gap-3">
          {['light','dark'].map(t => (
            <button key={t} onClick={() => theme !== t && toggleTheme()}
              className={clsx('p-4 rounded-xl border-2 text-left transition-all', theme===t ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600')}>
              <div className={clsx('w-full h-12 rounded-lg mb-2', t==='light' ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-700')} />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">{t}</p>
              {theme === t && <p className="text-xs text-indigo-500 mt-0.5">Active</p>}
            </button>
          ))}
        </div>
      </Section>

      {/* AI */}
      <Section title="AI Preferences" icon={Zap}>
        <Toggle
          label="AI Recommendations"
          desc="Show smart productivity insights based on your behaviour"
          value={aiPrefs.recommendations}
          onChange={() => toggleAi('recommendations')}
        />
        <Toggle
          label="Learning Mode"
          desc="Let AI learn from your task completion patterns to improve predictions"
          value={aiPrefs.learning}
          onChange={() => toggleAi('learning')}
        />
      </Section>

      {/* Sign out */}
      <div className="card p-5 border-red-200 dark:border-red-900">
        <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2"><Trash2 size={16} /> Account</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Sign out</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sign out of your current session.</p>
          </div>
          <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>Sign Out</Button>
        </div>
      </div>

      <ConfirmationModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete}
        title="Sign Out" message="You will be redirected to the home page. You can sign back in at any time." confirmLabel="Sign Out" variant="danger" />
    </div>
  );
}