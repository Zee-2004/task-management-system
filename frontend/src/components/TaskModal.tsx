import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Task, TaskFormData, TaskPriority, TaskStatus } from '../types';
import { createTask, updateTask } from '../api/tasks';
import { toast } from 'react-toastify';

interface Props {
  task?: Task | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm: TaskFormData = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  due_date: '',
};

export default function TaskModal({ task, onClose, onSaved }: Props) {
  const [form, setForm] = useState<TaskFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        status: task.status,
        due_date: task.due_date.split('T')[0],
      });
    } else {
      setForm(emptyForm);
    }
  }, [task]);

  const validate = (): boolean => {
    const e: Partial<TaskFormData> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.due_date) e.due_date = 'Due date is required';
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(form.due_date) < today && !task) {
        e.due_date = 'Due date cannot be earlier than today';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (task) {
        await updateTask(task.id, form);
        toast.success('Task updated');
      } else {
        await createTask(form);
        toast.success('Task created');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const set = (field: keyof TaskFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-field">
            <label>Title <span>*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Task title"
              maxLength={200}
              autoFocus
            />
            {errors.title && <p className="modal-field-error">{errors.title}</p>}
          </div>

          <div className="modal-field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Optional description..."
              rows={3}
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Priority <span>*</span></label>
              <select
                value={form.priority}
                onChange={(e) => set('priority', e.target.value as TaskPriority)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && <p className="modal-field-error">{errors.priority}</p>}
            </div>

            <div className="modal-field">
              <label>Status <span>*</span></label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as TaskStatus)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && <p className="modal-field-error">{errors.status}</p>}
            </div>
          </div>

          <div className="modal-field">
            <label>Due Date <span>*</span></label>
            <input
              type="date"
              value={form.due_date}
              min={task ? undefined : todayStr}
              onChange={(e) => set('due_date', e.target.value)}
            />
            {errors.due_date && <p className="modal-field-error">{errors.due_date}</p>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}