import { useEffect, useState } from 'react';

import { Spinner } from '../components/Spinner';
import { getSystemAccount, updateSystemAccount } from '../features/admin/api';

export function SystemAccountPage() {
  const [displayName, setDisplayName] = useState('');
  const [avatarObjectKey, setAvatarObjectKey] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSystemAccount()
      .then((p) => {
        setDisplayName(p.displayName ?? '');
        setAvatarObjectKey(p.avatarObjectKey ?? '');
        setDescription(p.description ?? '');
        setWebsiteUrl(p.websiteUrl ?? '');
      })
      .catch(() => setError('Could not load the official account — is one configured (RISKYC_SYSTEM_ACCOUNT_ACCESS_EMAIL)?'))
      .finally(() => setIsLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateSystemAccount({
        displayName: displayName || null,
        avatarObjectKey: avatarObjectKey || null,
        description: description || null,
        websiteUrl: websiteUrl || null,
      });
      setSaved(true);
    } catch {
      setError('Could not save — please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="loading-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1>Official account</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: -10, maxWidth: 560 }}>
        The profile every user sees as "RiskyC Fashion" (or whichever name is set below) — the account broadcasts are sent from.
      </p>

      <form className="card" style={{ maxWidth: 560, margin: 0 }} onSubmit={save}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Display name</label>
        <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Avatar object key</label>
        <input
          className="input"
          value={avatarObjectKey}
          onChange={(e) => setAvatarObjectKey(e.target.value)}
          placeholder="MinIO object key — uploaded via media-service"
        />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Description</label>
        <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Website URL</label>
        <input className="input" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://…" />

        {error && <p className="error">{error}</p>}
        {saved && <p style={{ color: 'var(--success)', fontSize: 13.5 }}>Saved.</p>}

        <button type="submit" className="button" disabled={isSaving}>
          {isSaving ? <span className="spinner" aria-hidden="true" /> : <span>Save</span>}
        </button>
      </form>
    </div>
  );
}
