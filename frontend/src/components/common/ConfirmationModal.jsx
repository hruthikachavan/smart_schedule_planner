import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmLabel='Confirm', variant='danger', loading=false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${variant==='danger'?'bg-red-100 dark:bg-red-900/30':'bg-amber-100 dark:bg-amber-900/30'}`}>
          <AlertTriangle className={`w-6 h-6 ${variant==='danger'?'text-red-500':'text-amber-500'}`} />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={variant} className="flex-1" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
}
