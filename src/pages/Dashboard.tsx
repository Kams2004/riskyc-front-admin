import { useEffect, useState } from 'react';

import { StatCard } from '../components/StatCard';
import { Spinner } from '../components/Spinner';
import { fetchDashboardSummary, type DashboardSummary } from '../features/admin/api';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p className="error">Could not load the dashboard summary — please check your connection.</p>}
      {!summary && !error && (
        <div className="loading-center">
          <Spinner />
        </div>
      )}
      {summary && (
        <div className="stat-grid">
          <StatCard label="Total users" value={summary.totalUsers} />
          <StatCard label="Online now" value={summary.onlineUsers} />
          <StatCard label="Suspended" value={summary.suspendedUsers} />
          <StatCard label="Reports" value={summary.totalReports} />
          <StatCard label="Blocked pairs" value={summary.totalBlockedPairs} />
        </div>
      )}
    </div>
  );
}
