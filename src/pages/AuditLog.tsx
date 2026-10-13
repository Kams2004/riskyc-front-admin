import { useEffect, useState } from 'react';

import { DataTable, type Column } from '../components/DataTable';
import { listAuditLog, type AuditLogRow } from '../features/admin/api';

const PAGE_SIZE = 25;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function AuditLogPage() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    listAuditLog(page, PAGE_SIZE)
      .then((result) => {
        setRows(result.content);
        setTotalPages(result.totalPages);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  const columns: Column<AuditLogRow>[] = [
    { key: 'when', label: 'When', render: (r) => formatDate(r.createdAt) },
    { key: 'admin', label: 'Admin', render: (r) => r.adminUsername },
    { key: 'action', label: 'Action', render: (r) => r.action },
    { key: 'target', label: 'Target', render: (r) => (r.targetType ? `${r.targetType} ${r.targetId ?? ''}` : '—') },
    { key: 'details', label: 'Details', render: (r) => r.details || '—' },
  ];

  return (
    <div>
      <h1>Audit log</h1>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        emptyMessage="No admin actions logged yet."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
