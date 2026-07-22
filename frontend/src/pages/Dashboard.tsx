import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/tasks';
import type { DashboardStats as StatsType } from '../types';
import DashboardStatsCards from '../components/DashboardStats';
import TaskList from '../components/TaskList';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const loadStats = useCallback(async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AU';

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-mark">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          TaskFlow
        </div>

        <div className="navbar-right">
          <button
            className="btn-icon"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <span className="navbar-user-name">{user?.name}</span>
          <div className="avatar">{initials}</div>

          <button className="btn-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>

        <DashboardStatsCards stats={stats} isLoading={isLoadingStats} />

        <TaskList onStatsRefresh={loadStats} />
      </main>
    </div>
  );
}