import { useState } from 'react';

import { ConfirmModal } from '../components/ConfirmModal';
import { broadcast, listUsers, type AdminUserRow } from '../features/admin/api';

type Target = 'all' | 'one';

export function BroadcastPage() {
  const [text, setText] = useState('');
  const [target, setTarget] = useState<Target>('all');
  const [recipientQuery, setRecipientQuery] = useState('');
  const [recipientOptions, setRecipientOptions] = useState<AdminUserRow[]>([]);
  const [recipient, setRecipient] = useState<AdminUserRow | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function searchRecipients(q: string) {
    setRecipientQuery(q);
    setRecipient(null);
    if (q.trim().length < 2) {
      setRecipientOptions([]);
      return;
    }
    listUsers(q, 0, 8)
      .then((result) => setRecipientOptions(result.content))
      .catch(() => {});
  }

  async function send() {
    setIsSending(true);
    setError(null);
    try {
      const res = await broadcast(text, target === 'one' ? recipient?.userId ?? null : null);
      setResult(`Sent to ${res.recipientCount} recipient${res.recipientCount === 1 ? '' : 's'}.`);
      setText('');
      setRecipient(null);
      setRecipientQuery('');
      setShowConfirm(false);
    } catch {
      setError('Could not send the broadcast — please check your connection and try again.');
    } finally {
      setIsSending(false);
    }
  }

  const canSend = text.trim().length > 0 && (target === 'all' || !!recipient);

  return (
    <div>
      <h1>Broadcast</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: -10, maxWidth: 560 }}>
        Sends a message from the official RiskyC account — text only for now.
      </p>

      <div className="card" style={{ maxWidth: 560, margin: 0 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <input type="radio" checked={target === 'all'} onChange={() => setTarget('all')} />
            Send to everyone
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <input type="radio" checked={target === 'one'} onChange={() => setTarget('one')} />
            Send to one user
          </label>
        </div>

        {target === 'one' && (
          <div style={{ marginBottom: 12 }}>
            <input
              className="input"
              placeholder="Search by name, email, or phone…"
              value={recipient ? recipient.displayName || recipient.userId : recipientQuery}
              onChange={(e) => searchRecipients(e.target.value)}
            />
            {recipientOptions.length > 0 && !recipient && (
              <div className="card" style={{ margin: 0, padding: 6, maxWidth: 'none' }}>
                {recipientOptions.map((u) => (
                  <button
                    key={u.userId}
                    type="button"
                    className="link-button"
                    style={{ display: 'block', textAlign: 'left', width: '100%', padding: '8px 10px' }}
                    onClick={() => {
                      setRecipient(u);
                      setRecipientOptions([]);
                    }}
                  >
                    {u.displayName || '—'} <span style={{ color: 'var(--text-muted)' }}>({u.email || u.phoneNumber})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <textarea className="input" placeholder="Message text…" value={text} onChange={(e) => setText(e.target.value)} rows={5} />

        {error && <p className="error">{error}</p>}
        {result && <p style={{ color: 'var(--success)', fontSize: 13.5 }}>{result}</p>}

        <button type="button" className="button" disabled={!canSend} onClick={() => setShowConfirm(true)}>
          Send broadcast
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Send this broadcast?"
          body={target === 'all' ? 'This sends the message to every user on the platform right now.' : `This sends the message to ${recipient?.displayName || 'this user'}.`}
          confirmLabel="Send"
          danger={target === 'all'}
          isSubmitting={isSending}
          onConfirm={send}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
