import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { adminSession, type StoredAdminSession } from '../../lib/authStorage';
import * as authApi from './api';

type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
  displayName: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [stored, setStored] = useState<StoredAdminSession | null>(() => adminSession.load());

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated: !!stored?.accessToken,
      username: stored?.username ?? null,
      displayName: stored?.displayName ?? null,
      async login(username, password) {
        const res = await authApi.login(username, password);
        const next: StoredAdminSession = {
          accessToken: res.accessToken,
          username: res.username,
          displayName: res.displayName,
          expiresAt: res.expiresAt,
        };
        adminSession.save(next);
        setStored(next);
      },
      logout() {
        // Fire-and-forget, not awaited — same reasoning as the end-user
        // clients' own signOut(): local sign-out should stay instant and
        // never block on a network round trip.
        authApi.logout().catch((e) => console.warn('[signOut] failed to revoke current session', e));
        adminSession.clear();
        setStored(null);
      },
    }),
    [stored]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
