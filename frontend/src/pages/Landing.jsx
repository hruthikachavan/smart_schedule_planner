import { useNavigate } from 'react-router-dom';
import { Zap, CheckCircle2, Calendar, BarChart3, Clock, Sparkles, ArrowRight, Shield, Cpu } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';

const FEATURES = [
  { icon: Sparkles,    title: 'AI Schedule Generation',      desc: 'Our algorithm analyses your tasks, priorities and availability to build an optimal daily schedule automatically.',                        color: 'from-indigo-500 to-blue-600' },
  { icon: CheckCircle2,title: 'Smart Task Prioritisation',   desc: 'Eisenhower matrix + AI scoring ranks every task by urgency and importance so you always work on what matters most.',                    color: 'from-purple-500 to-indigo-600' },
  { icon: BarChart3,   title: 'Productivity Insights',       desc: 'Track focus trends, completion rates and duration accuracy to continuously improve how you plan and execute.',                          color: 'from-blue-500 to-cyan-600' },
  { icon: Clock,       title: 'Availability Configuration',  desc: 'Define your working hours, deep-work blocks and break preferences. The AI respects your life outside work.',                           color: 'from-emerald-500 to-teal-600' },
];

const HOW = [
  { step: '01', title: 'Add your tasks',      desc: 'Enter tasks with importance, due dates and estimated time. The AI scores and prioritises them instantly.' },
  { step: '02', title: 'Set availability',    desc: 'Mark when you are free using the weekly grid. Configure deep-work blocks and break preferences.' },
  { step: '03', title: 'Generate schedule',   desc: 'One click creates an AI-optimised daily and weekly schedule tailored to your priorities and energy.' },
  { step: '04', title: 'Track & improve',     desc: 'Complete tasks, log actual times, and watch the insights page reveal patterns to keep improving.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">AI Productivity Planner</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>Sign in</Button>
            
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-32 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-8 animate-fade-in">
            <Sparkles size={14} />
            AI-powered productivity for students &amp; professionals
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-slate-100 leading-[1.05] tracking-tight mb-6 animate-slide-up">
            Plan smarter.<br />
            <span className="gradient-text">Focus deeper.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Add your tasks, set your availability, and let AI build you an optimised daily schedule — automatically, every time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Button size="lg" onClick={() => navigate(ROUTES.REGISTER)} className="w-full sm:w-auto px-8">
              Start for free <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.LOGIN)} className="w-full sm:w-auto px-8">
              Sign in to your account
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-5 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4">
              Everything you need to<br /><span className="gradient-text">stay productive</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              A complete productivity system — AI scheduling, task management, analytics and smart recommendations, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4">How it works</h2>
            <p className="text-slate-500 dark:text-slate-400">From zero to an optimised schedule in under 5 minutes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {HOW.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/30">{step}</div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16 px-5 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          {[
            { icon: Shield, label: 'Secure',     desc: 'JWT auth & encrypted passwords' },
            { icon: Cpu,    label: 'AI-powered', desc: 'Smart scheduling algorithm' },
            { icon: Zap,    label: 'Fast',        desc: 'Schedules generated in seconds' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <Icon size={18} className="text-indigo-500" />
              </div>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 border-0 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="relative">
              <h2 className="text-4xl font-black mb-4">Ready to take control?</h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-lg mx-auto">
                Plan smarter, focus deeper, and achieve more with AI-powered scheduling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate(ROUTES.REGISTER)} size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl !from-white !to-white px-8">
                  Create free account <ArrowRight size={18} />
                </Button>
                <Button onClick={() => navigate(ROUTES.LOGIN)} size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Productivity Planner</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
