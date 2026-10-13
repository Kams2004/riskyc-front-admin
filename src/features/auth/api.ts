import { config } from '../../lib/config';
import { apiFetch } from '../../lib/httpClient';

export type LoginResponse = { accessToken: string; username: string; displayName: string | null; expiresAt: string };

export function login(username: string, password: string): Promise<LoginResponse> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logout(): Promise<void> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/auth/logout`, { method: 'POST' });
}

export function me(): Promise<{ username: string; displayName: string | null }> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/auth/me`);
}
