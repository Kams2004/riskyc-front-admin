import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../features/auth/AuthContext';
import { ApiError } from '../lib/httpClient';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (e) {
      if (e instanceof ApiError && e.status === 429) {
        const body = e.body as { retryAfterSeconds?: number } | undefined;
        const minutes = body?.retryAfterSeconds ? Math.ceil(body.retryAfterSeconds / 60) : null;
        setError(minutes ? `Too many attempts — try again in about ${minutes} min.` : 'Too many attempts — please wait before trying again.');
      } else if (e instanceof ApiError && e.status === 401) {
        setError('Incorrect username or password.');
      } else {
        setError('Something went wrong. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="card" onSubmit={handleSubmit}>
        <h1>RiskyC Admin</h1>
        <p className="subtitle">Sign in to manage the platform.</p>

        <input
          className="input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button full" disabled={isSubmitting || !username || !password}>
          {isSubmitting ? <span className="spinner" aria-hidden="true" /> : <span>Sign in</span>}
        </button>
      </form>
    </div>
  );
}
