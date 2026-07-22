import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types';
import { getTasks } from '../api/tasks';
import TaskModal from './TaskModal';
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';

interface Props {
  onStatsRefresh: () => void;
}

const ITEMS_PER_PAGE = 8;

export default function TaskList({ onStatsRefresh }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTasks({ search, status, priority, sortBy });
      setTasks(data);
      setPage(1);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, priority, sortBy]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleSaved = () => { loadTasks(); onStatsRefresh(); };
  const handleDeleted = () => { loadTasks(); onStatsRefresh(); };

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const paginated = tasks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const isOverdue = (task: Task) => {
    if (task.status === 'Completed') return false;
    return new Date(task.due_date) < new Date(new Date().toDateString());
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const statusClass = (s: string) => s.replace(/\s/g, '');

  return (
    <>
      <div className="task-section">
        <div className="task-section-header">
          <span className="task-section-title">
            All Tasks
            <span className="task-count-badge">{tasks.length}</span>
          </span>

          <div className="task-controls">
            <div className="search-wrap">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select className="filter-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="due_date">Due Date</option>
            </select>

            <button className="btn-add" onClick={() => { setEditTask(null); setShowModal(true); }}>
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Task
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
            </div>
            <p className="empty-title">No tasks found</p>
            <p className="empty-sub">
              {search || status || priority
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
          </div>
        ) : (
          <div className="task-list">
            {paginated.map((task) => (
              <div key={task.id} className="task-row">
                <div className="task-row-left">
                  <p className={`task-row-title${task.status === 'Completed' ? ' completed' : ''}`}>
                    {task.title}
                  </p>
                  <div className="task-row-meta">
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <span className={`badge badge-${statusClass(task.status)}`}>{task.status}</span>
                    {isOverdue(task) && <span className="badge badge-overdue">Overdue</span>}
                    <span className={`due-date${isOverdue(task) ? ' overdue' : ''}`}>
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                </div>

                <div className="task-row-right">
                  <div className="task-actions">
                    <button
                      className="btn-task"
                      title="Edit"
                      onClick={() => { setEditTask(task); setShowModal(true); }}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      className="btn-task delete"
                      title="Delete"
                      onClick={() => setDeleteTask(task)}
                    >
                      <svg viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-btn${page === i + 1 ? ' active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSaved={handleSaved}
        />
      )}

      {deleteTask && (
        <DeleteModal
          task={deleteTask}
          onClose={() => setDeleteTask(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}