import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataTable, type Column } from '../components/DataTable';
import { listReports, type AdminReportRow } from '../features/admin/api';

const PAGE_SIZE = 25;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function ReportsPage() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<AdminReportRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    listReports(page, PAGE_SIZE)
      .then((result) => {
        setRows(result.content);
        setTotalPages(result.totalPages);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  const columns: Column<AdminReportRow>[] = [
    {
      key: 'reporter',
      label: 'Reported by',
      render: (r) => <Link to={`/users?q=${encodeURIComponent(r.reporterId)}`}>{r.reporterDisplayName || r.reporterId}</Link>,
    },
    {
      key: 'reported',
      label: 'Reported account',
      render: (r) => <Link to={`/users?q=${encodeURIComponent(r.reportedId)}`}>{r.reportedDisplayName || r.reportedId}</Link>,
    },
    { key: 'reason', label: 'Reason', render: (r) => r.reason || '—' },
    { key: 'date', label: 'Reported', render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div>
      <h1>Reported users</h1>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.reportId}
        isLoading={isLoading}
        emptyMessage="No reports yet."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
