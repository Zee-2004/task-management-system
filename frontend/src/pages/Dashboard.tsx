import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/tasks';
import type { DashboardStats as StatsType } from '../types';
import DashboardStatsCards from '../components/DashboardStats';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out');
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-brand">Task Manager</div>
        <div className="navbar-user">
          <span className="navbar-username">{user?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <h1 className="page-title">Dashboard</h1>
        <DashboardStatsCards stats={stats} isLoading={isLoadingStats} />

        <div className="task-section-placeholder">
          Task list coming in Stage 5
        </div>
      </main>
    </div>
  );
}