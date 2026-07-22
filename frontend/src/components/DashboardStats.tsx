import type { DashboardStats as StatsType } from '../types';

interface Props {
  stats: StatsType | null;
  isLoading: boolean;
}

const statConfig = [
  { key: 'total', label: 'Total Tasks', color: '#4F46E5', bg: '#EEF2FF' },
  { key: 'pending', label: 'Pending', color: '#D97706', bg: '#FFFBEB' },
  { key: 'inProgress', label: 'In Progress', color: '#2563EB', bg: '#EFF6FF' },
  { key: 'completed', label: 'Completed', color: '#059669', bg: '#ECFDF5' },
  { key: 'overdue', label: 'Overdue', color: '#DC2626', bg: '#FEF2F2' },
] as const;

export default function DashboardStats({ stats, isLoading }: Props) {
  return (
    <div className="stats-grid">
      {statConfig.map((config) => (
        <div key={config.key} className="stat-card" style={{ borderTopColor: config.color }}>
          <span className="stat-label">{config.label}</span>
          <span className="stat-value" style={{ color: config.color }}>
            {isLoading ? (
              <span className="stat-skeleton" />
            ) : (
              stats?.[config.key as keyof StatsType] ?? 0
            )}
          </span>
        </div>
      ))}
    </div>
  );
}