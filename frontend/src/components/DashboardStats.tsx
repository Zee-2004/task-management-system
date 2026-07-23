import React from 'react';
import type { DashboardStats as StatsType } from '../types';

interface Props {
  stats: StatsType | null;
  isLoading: boolean;
}

const statConfig: {
  key: keyof StatsType;
  label: string;
  color: string;
  bg: string;
  footer: string;
  icon: React.ReactElement;
}[] = [
  {
    key: 'total',
    label: 'Total Tasks',
    color: '#4F46E5',
    bg: '#EEF2FF',
    footer: 'All tasks',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
  },
  {
    key: 'pending',
    label: 'Pending',
    color: '#D97706',
    bg: '#FFFBEB',
    footer: 'Not started',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    color: '#2563EB',
    bg: '#DBEAFE',
    footer: 'Being worked on',
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
  },
  {
    key: 'completed',
    label: 'Completed',
    color: '#059669',
    bg: '#D1FAE5',
    footer: 'Done',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    key: 'overdue',
    label: 'Overdue',
    color: '#DC2626',
    bg: '#FEE2E2',
    footer: 'Past due date',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
];

export default function DashboardStats({ stats, isLoading }: Props) {
  return (
    <div className="stats-grid">
      {statConfig.map((s) => (
        <div
          key={s.key}
          className="stat-card"
          style={{ '--stat-color': s.color, '--stat-bg': s.bg } as React.CSSProperties}
        >
          <div className="stat-card-header">
            <span className="stat-label">{s.label}</span>
            <div className="stat-icon-wrap">{s.icon}</div>
          </div>
          <div className="stat-value">
            {isLoading
              ? <span className="stat-skeleton" />
              : (stats?.[s.key] ?? 0)
            }
          </div>
          <div className="stat-footer">{s.footer}</div>
        </div>
      ))}
    </div>
  );
}