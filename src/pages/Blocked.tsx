import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataTable, type Column } from '../components/DataTable';
import { listBlocked, type AdminBlockedRow } from '../features/admin/api';

const PAGE_SIZE = 25;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function BlockedPage() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<AdminBlockedRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    listBlocked(page, PAGE_SIZE)
      .then((result) => {
        setRows(result.content);
        setTotalPages(result.totalPages);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  const columns: Column<AdminBlockedRow>[] = [
    {
      key: 'blocker',
      label: 'Blocked by',
      render: (r) => <Link to={`/users?q=${encodeURIComponent(r.blockerId)}`}>{r.blockerDisplayName || r.blockerId}</Link>,
    },
    {
      key: 'blocked',
      label: 'Blocked account',
      render: (r) => <Link to={`/users?q=${encodeURIComponent(r.blockedId)}`}>{r.blockedDisplayName || r.blockedId}</Link>,
    },
    { key: 'date', label: 'Blocked', render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div>
      <h1>Blocked contacts</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: -10 }}>
        User-to-user contact blocks — these don't yet stop messages/calls server-side, they're visibility only.
      </p>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        emptyMessage="No blocked contacts."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
