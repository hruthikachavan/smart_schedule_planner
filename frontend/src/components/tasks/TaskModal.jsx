import Modal from '../common/Modal';
import TaskForm from './TaskForm';

export default function TaskModal({ isOpen, onClose, task, onSubmit, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task?.id ? 'Edit Task' : 'New Task'} size="md">
      <TaskForm initialValues={task || {}} onSubmit={onSubmit} onCancel={onClose} loading={loading} />
    </Modal>
  );
}
