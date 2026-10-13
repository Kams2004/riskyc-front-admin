import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ConfirmModal } from '../components/ConfirmModal';
import { DataTable, type Column } from '../components/DataTable';
import { deleteStatus, listStatuses, type StatusAdminRow } from '../features/admin/api';

const PAGE_SIZE = 25;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function StatusPage() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<StatusAdminRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<StatusAdminRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function load() {
    setIsLoading(true);
    listStatuses(page, PAGE_SIZE)
      .then((result) => {
        setRows(result.content);
        setTotalPages(result.totalPages);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [page]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsSubmitting(true);
    try {
      await deleteStatus(pendingDelete.statusId);
      setPendingDelete(null);
      load();
    } finally {
      setIsSubmitting(false);
    }
  }

  const columns: Column<StatusAdminRow>[] = [
    { key: 'user', label: 'Posted by', render: (s) => <Link to={`/users?q=${encodeURIComponent(s.userId)}`}>{s.userId}</Link> },
    { key: 'type', label: 'Type', render: (s) => s.mediaType },
    { key: 'preview', label: 'Content', render: (s) => s.textContentPreview || <span style={{ color: 'var(--text-muted)' }}>(media)</span> },
    { key: 'created', label: 'Posted', render: (s) => formatDate(s.createdAt) },
    { key: 'expires', label: 'Expires', render: (s) => formatDate(s.expiresAt) },
    {
      key: 'actions',
      label: '',
      render: (s) => (
        <button type="button" className="link-button secondary" onClick={() => setPendingDelete(s)}>
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <h1>Active statuses</h1>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(s) => s.statusId}
        isLoading={isLoading}
        emptyMessage="No active statuses."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {pendingDelete && (
        <ConfirmModal
          title="Delete this status?"
          body="This removes it immediately for everyone. This cannot be undone."
          confirmLabel="Delete"
          danger
          isSubmitting={isSubmitting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
