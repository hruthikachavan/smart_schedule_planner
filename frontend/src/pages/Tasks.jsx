import { useEffect, useState, useCallback } from 'react';
import { Plus, LayoutGrid, Columns, AlignLeft } from 'lucide-react';
import { taskApi } from '../api';
import { useSchedule } from '../context/ScheduleContext';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskStats from '../components/tasks/TaskStats';
import QuadrantView from '../components/tasks/QuadrantView';
import TaskTimeline from '../components/tasks/TaskTimeline';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import CompleteTaskModal from '../components/tasks/CompleteTaskModal';
import { CardSkeleton } from '../components/common/Loader';
import { CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';

const VIEWS = [
  { id: 'card',     icon: LayoutGrid, label: 'Cards' },
  { id: 'quadrant', icon: Columns,    label: 'Quadrant' },
  { id: 'timeline', icon: AlignLeft,  label: 'Timeline' },
];

// Tasks completed more than 2 days ago are hidden by default
const COMPLETED_HIDE_AFTER_HOURS = 48;

export default function Tasks() {
  const [tasks,          setTasks]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [view,           setView]           = useState('card');
  const [search,         setSearch]         = useState('');
  const [filters,        setFilters]        = useState({ status: 'pending', quadrant: 'all' });
  const [modalOpen,      setModalOpen]      = useState(false);
  const [editTask,       setEditTask]       = useState(null);
  const [deleteId,       setDeleteId]       = useState(null);
  const [completeTask,   setCompleteTask]   = useState(null);
  const [saving,         setSaving]         = useState(false);
  const [deleting,       setDeleting]       = useState(false);
  const [completing,     setCompleting]     = useState(false);
  const [error,          setError]          = useState('');

  const { refreshSchedule } = useSchedule();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const r = await taskApi.getAll();
      setTasks(r.data || []);
    } catch { setTasks([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const isRecentlyCompleted = (task) => {
    if (task.status !== 'COMPLETED') return false;
    const completedAt = new Date(task.completedAt || task.updatedAt);
    const hoursSince = (Date.now() - completedAt.getTime()) / 3_600_000;
    return hoursSince <= COMPLETED_HIDE_AFTER_HOURS;
  };

  const filtered = tasks.filter(t => {
    if (filters.status === 'pending' && t.status === 'COMPLETED') return false;
    if (filters.status === 'completed') {
      if (t.status !== 'COMPLETED') return false;
      if (!isRecentlyCompleted(t)) return false;
    }
    if (filters.status === 'all') {
      if (t.status === 'COMPLETED' && !isRecentlyCompleted(t)) return false;
    }
    if (filters.quadrant !== 'all' && t.priorityQuadrant !== filters.quadrant) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const pending   = tasks.filter(t => t.status !== 'COMPLETED').length;

  const openCreate = () => { setEditTask(null); setError(''); setModalOpen(true); };
  const openEdit   = (task) => { setEditTask(task); setError(''); setModalOpen(true); };

  const handleSubmit = async (data) => {
    setSaving(true); setError('');
    try {
      if (editTask?.id) {
        await taskApi.update(editTask.id, data);
        setModalOpen(false);
        await fetchTasks();
        await refreshSchedule('Task updated — schedule regenerated.');
      } else {
        await taskApi.create(data);
        setModalOpen(false);
        await fetchTasks();
        await refreshSchedule('New task added — schedule regenerated.');
      }
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally { setSaving(false); }
  };

  const handleCompleteClick = (id) => {
    const task = tasks.find(t => t.id == id);
    setCompleteTask(task || null);
  };

  const handleCompleteConfirm = async (actualTime) => {
    if (!completeTask) return;
    setCompleting(true);
    try {
      await taskApi.complete(completeTask.id, actualTime);
      setCompleteTask(null);
      await fetchTasks();
      await refreshSchedule('Task completed — schedule regenerated.');
    } catch {} finally { setCompleting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await taskApi.delete(deleteId);
      setDeleteId(null);
      await fetchTasks();
      await refreshSchedule('Task deleted — schedule regenerated.');
    } catch {} finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} total · ${completed} completed · ${pending} pending`}
        action={<Button icon={Plus} onClick={openCreate}>New Task</Button>}
      />

      <TaskStats total={tasks.length} completed={completed} pending={pending} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks…" className="flex-1 max-w-sm" />
        <TaskFilters filters={filters} onChange={setFilters} />
        <div className="flex items-center gap-1 ml-auto bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {VIEWS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setView(id)} title={label}
              className={clsx('w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                view === id
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200')}>
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-0">
          <EmptyState
            icon={CheckSquare}
            title={tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            description={tasks.length === 0
              ? 'Create your first task to get started. The AI will prioritise it and schedule it for you.'
              : 'Try adjusting your search or filters.'}
            action={tasks.length === 0 ? openCreate : undefined}
            actionLabel="Create First Task"
          />
        </div>
      ) : view === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <TaskCard
              key={t.id} task={t}
              onEdit={openEdit}
              onDelete={id => setDeleteId(id)}
              onComplete={handleCompleteClick}
            />
          ))}
        </div>
      ) : view === 'quadrant' ? (
        <QuadrantView tasks={filtered} onEdit={openEdit} onDelete={id => setDeleteId(id)} onComplete={handleCompleteClick} />
      ) : (
        <TaskTimeline tasks={filtered} />
      )}

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} task={editTask} onSubmit={handleSubmit} loading={saving} />
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <CompleteTaskModal
        isOpen={!!completeTask}
        onClose={() => setCompleteTask(null)}
        task={completeTask}
        onConfirm={handleCompleteConfirm}
        loading={completing}
      />

      <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Task" message="This task and its scheduled blocks will be permanently removed." confirmLabel="Delete" loading={deleting} />
    </div>
  );
}
