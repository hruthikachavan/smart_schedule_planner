import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Clock, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { IMPORTANCE_OPTIONS } from '../../constants/priorities';
import { formatISO, formatDuration } from '../../utils/date';
import { taskApi } from '../../api';

const CATEGORIES = ['Work', 'Learning', 'Personal', 'Health', 'Finance', 'Other'];

// Convert total minutes to hours + minutes
const minsToHM = (totalMins) => {
  const h = Math.floor((totalMins || 0) / 60);
  const m = (totalMins || 0) % 60;
  return { hours: h, minutes: m };
};

const hmToMins = (h, m) => parseInt(h || 0) * 60 + parseInt(m || 0);

export default function TaskForm({ initialValues = {}, onSubmit, onCancel, loading = false }) {
  const initHM = minsToHM(initialValues.userEstimatedTime || 30);
  const [form, setForm] = useState({
    title:       '',
    description: '',
    importance:  3,
    dueDate:     '',
    category:    'Work',
    estHours:    initHM.hours,
    estMinutes:  initHM.minutes,
    ...(() => {
      const { userEstimatedTime, dueDate, ...rest } = initialValues;
      return {
        ...rest,
        dueDate: dueDate ? formatISO(dueDate) : '',
        estHours:   minsToHM(userEstimatedTime || 30).hours,
        estMinutes: minsToHM(userEstimatedTime || 30).minutes,
      };
    })(),
  });

  const [aiSuggestion, setAiSuggestion]     = useState(null);
  const [aiLoading,    setAiLoading]        = useState(false);
  const [aiApplied,    setAiApplied]        = useState(false);

  // Deadline feasibility state
  const [feasibilityError, setFeasibilityError] = useState('');
  const [feasibilityChecking, setFeasibilityChecking] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const totalEstMins = hmToMins(form.estHours, form.estMinutes);

  // Fetch AI prediction whenever key fields change
  const fetchAiPrediction = useCallback(async () => {
    if (!totalEstMins || totalEstMins < 5) { setAiSuggestion(null); return; }
    setAiLoading(true);
    try {
      const r = await taskApi.previewAi({
        category: form.category,
        importance: parseInt(form.importance),
        userEstimatedTime: totalEstMins,
      });
      const predicted = r.data?.aiPredictedTime;
      if (predicted && predicted !== totalEstMins) {
        setAiSuggestion(predicted);
        setAiApplied(false);
      } else {
        setAiSuggestion(null);
      }
    } catch {
      setAiSuggestion(null);
    } finally {
      setAiLoading(false);
    }
  }, [form.category, form.importance, totalEstMins]);

  // Debounce the AI fetch
  useEffect(() => {
    const t = setTimeout(fetchAiPrediction, 600);
    return () => clearTimeout(t);
  }, [fetchAiPrediction]);

  // Clear feasibility error when deadline or time changes so user can re-submit
  useEffect(() => {
    setFeasibilityError('');
  }, [form.dueDate, form.estHours, form.estMinutes]);

  const applyAiSuggestion = () => {
    const hm = minsToHM(aiSuggestion);
    setForm(f => ({ ...f, estHours: hm.hours, estMinutes: hm.minutes }));
    setAiApplied(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;

    const userEstimatedTime = hmToMins(form.estHours, form.estMinutes);
    const payload = {
      title:             form.title,
      description:       form.description,
      importance:        parseInt(form.importance),
      category:          form.category,
      dueDate:           new Date(form.dueDate).toISOString(),
      userEstimatedTime: userEstimatedTime || null,
    };

    // Check feasibility before calling onSubmit — show inline error if not feasible
    setFeasibilityChecking(true);
    setFeasibilityError('');
    try {
      await taskApi.checkFeasibility({
        dueDate:           payload.dueDate,
        userEstimatedTime: payload.userEstimatedTime,
        importance:        payload.importance,
        category:          payload.category,
      });
      // Feasible — proceed with actual creation
      onSubmit(payload);
    } catch (err) {
      // HTTP 422 means "cannot be completed before deadline"
      setFeasibilityError(err.message || 'This task cannot be completed before the deadline.');
    } finally {
      setFeasibilityChecking(false);
    }
  };

  const isSubmitting = loading || feasibilityChecking;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input className="input" value={form.title} onChange={set('title')} placeholder="Task title" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} value={form.description} onChange={set('description')} placeholder="Optional details…" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Importance *</label>
          <select className="input" value={form.importance} onChange={set('importance')}>
            {IMPORTANCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Due Date *</label>
        <input className="input" type="datetime-local" value={form.dueDate} onChange={set('dueDate')} required />
      </div>

      {/* Estimated time in hours + minutes */}
      <div>
        <label className="label flex items-center gap-1.5">
          <Clock size={13} className="text-slate-400" /> Estimated Time
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <input
              className="input text-center"
              type="number" min="0" max="23" step="1"
              value={form.estHours}
              onChange={set('estHours')}
              placeholder="0"
            />
            <span className="text-sm text-slate-500 flex-shrink-0">h</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <input
              className="input text-center"
              type="number" min="0" max="55" step="5"
              value={form.estMinutes}
              onChange={set('estMinutes')}
              placeholder="30"
            />
            <span className="text-sm text-slate-500 flex-shrink-0">min</span>
          </div>
          {totalEstMins > 0 && (
            <span className="text-xs text-slate-400 flex-shrink-0">= {formatDuration(totalEstMins)}</span>
          )}
        </div>
      </div>

      {/* AI suggestion banner */}
      {aiLoading && totalEstMins >= 5 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span className="text-xs text-indigo-600 dark:text-indigo-400">AI is predicting time based on your history…</span>
        </div>
      )}
      {!aiLoading && aiSuggestion && !aiApplied && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-500" />
            <div>
              <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                AI suggests {formatDuration(aiSuggestion)}
              </p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">
                Based on your past {form.category} tasks
                {aiSuggestion > totalEstMins ? ' — you usually take longer than estimated' : ' — you usually finish faster than estimated'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={applyAiSuggestion}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 ml-3 flex-shrink-0 border border-indigo-300 dark:border-indigo-600 rounded-lg px-2.5 py-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
            Apply
          </button>
        </div>
      )}
      {!aiLoading && aiApplied && aiSuggestion && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <Sparkles size={14} className="text-green-500" />
          <span className="text-xs text-green-700 dark:text-green-400">AI suggestion applied — {formatDuration(aiSuggestion)}</span>
        </div>
      )}

      {/* Deadline feasibility error — shown after submit attempt */}
      {feasibilityError && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">{feasibilityError}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="flex-1" loading={isSubmitting}>
          {initialValues.id ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
