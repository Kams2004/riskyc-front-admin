/**
 * Same plain-bearer-token-in-localStorage tradeoff as the end-user web
 * client's own authStorage.ts — but a DISTINCT key, so an admin signed in on
 * the same browser/machine as a regular user account never collides with
 * (or gets confused for) that session.
 */
const STORAGE_KEY = 'riskyc-admin.session';

export type StoredAdminSession = {
  accessToken: string;
  username: string;
  displayName: string | null;
  expiresAt: string;
};

export const adminSession = {
  load(): StoredAdminSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredAdminSession) : null;
    } catch {
      return null;
    }
  },
  save(value: StoredAdminSession) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Best-effort — a viewer with storage disabled just won't stay signed in across reloads.
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // No-op if storage is unavailable.
    }
  },
};
