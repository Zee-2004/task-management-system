import type { Task } from '../types';
import { deleteTask } from '../api/tasks';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface Props {
  task: Task;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteModal({ task, onClose, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success('Task deleted');
      onDeleted();
      onClose();
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2 className="modal-title">Delete Task</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{task.title}"</strong>?
          This action cannot be undone.
        </p>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-delete" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}