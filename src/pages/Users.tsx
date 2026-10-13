import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ConfirmModal } from '../components/ConfirmModal';
import { DataTable, type Column } from '../components/DataTable';
import { deleteUser, listUsers, suspendUser, unsuspendUser, type AdminUserRow } from '../features/admin/api';

type PendingAction =
  | { kind: 'suspend'; user: AdminUserRow; reason: string }
  | { kind: 'unsuspend'; user: AdminUserRow }
  | { kind: 'delete'; user: AdminUserRow };

const PAGE_SIZE = 25;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function UsersPage() {
  // Lets Reports.tsx/Blocked.tsx deep-link straight to a specific account
  // (?q=<userId>) rather than needing a separate user-detail lookup path.
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get('q') ?? '');
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function load() {
    setIsLoading(true);
    listUsers(q, page, PAGE_SIZE)
      .then((result) => {
        setRows(result.content);
        setTotalPages(result.totalPages);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [q, page]);

  async function runPending() {
    if (!pending) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      if (pending.kind === 'suspend') {
        await suspendUser(pending.user.userId, pending.reason);
      } else if (pending.kind === 'unsuspend') {
        await unsuspendUser(pending.user.userId);
      } else {
        await deleteUser(pending.user.userId);
      }
      setPending(null);
      load();
    } catch {
      setActionError('Could not complete that action — please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const columns: Column<AdminUserRow>[] = [
    { key: 'name', label: 'Name', render: (u) => u.displayName || '—' },
    { key: 'contact', label: 'Contact', render: (u) => u.email || u.phoneNumber || '—' },
    { key: 'joined', label: 'Joined', render: (u) => formatDate(u.createdAt) },
    {
      key: 'status',
      label: 'Status',
      render: (u) => (u.suspended ? <span className="badge badge-error">Suspended</span> : <span className="badge badge-success">Active</span>),
    },
    {
      key: 'actions',
      label: '',
      render: (u) => (
        <div className="row-actions">
          {u.suspended ? (
            <button type="button" className="link-button" onClick={() => setPending({ kind: 'unsuspend', user: u })}>
              Unsuspend
            </button>
          ) : (
            <button type="button" className="link-button" onClick={() => setPending({ kind: 'suspend', user: u, reason: '' })}>
              Suspend
            </button>
          )}
          <button type="button" className="link-button secondary" onClick={() => setPending({ kind: 'delete', user: u })}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Users</h1>
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by name, email, or phone…"
          value={q}
          onChange={(e) => {
            setPage(0);
            setQ(e.target.value);
          }}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(u) => u.userId}
        isLoading={isLoading}
        emptyMessage="No users found."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {pending?.kind === 'suspend' && (
        <ConfirmModal
          title={`Suspend ${pending.user.displayName || 'this user'}?`}
          body="They'll be signed out of every device immediately and won't be able to sign back in until unsuspended."
          prompt={{
            label: 'Reason (shown to nobody but admins)',
            value: pending.reason,
            onChange: (reason) => setPending({ ...pending, reason }),
            placeholder: 'e.g. Repeated spam reports',
          }}
          confirmLabel="Suspend"
          danger
          isSubmitting={isSubmitting}
          onConfirm={runPending}
          onCancel={() => setPending(null)}
        />
      )}
      {pending?.kind === 'unsuspend' && (
        <ConfirmModal
          title={`Unsuspend ${pending.user.displayName || 'this user'}?`}
          body="They'll be able to sign in again right away."
          confirmLabel="Unsuspend"
          isSubmitting={isSubmitting}
          onConfirm={runPending}
          onCancel={() => setPending(null)}
        />
      )}
      {pending?.kind === 'delete' && (
        <ConfirmModal
          title={`Delete ${pending.user.displayName || 'this user'}?`}
          body="This permanently deletes the account and signs out every linked device. Their existing messages stay visible to people they've chatted with. This cannot be undone."
          confirmLabel="Delete account"
          danger
          isSubmitting={isSubmitting}
          onConfirm={runPending}
          onCancel={() => setPending(null)}
        />
      )}
      {actionError && <p className="error">{actionError}</p>}
    </div>
  );
}
