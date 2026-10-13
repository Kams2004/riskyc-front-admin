import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { AuditLogPage } from './pages/AuditLog';
import { BlockedPage } from './pages/Blocked';
import { BroadcastPage } from './pages/Broadcast';
import { DashboardPage } from './pages/Dashboard';
import { LoginPage } from './pages/Login';
import { ReportsPage } from './pages/Reports';
import { StatusPage } from './pages/Status';
import { SystemAccountPage } from './pages/SystemAccount';
import { UsersPage } from './pages/Users';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function RootRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/users"
        element={
          <RequireAuth>
            <UsersPage />
          </RequireAuth>
        }
      />
      <Route
        path="/reports"
        element={
          <RequireAuth>
            <ReportsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/blocked"
        element={
          <RequireAuth>
            <BlockedPage />
          </RequireAuth>
        }
      />
      <Route
        path="/broadcast"
        element={
          <RequireAuth>
            <BroadcastPage />
          </RequireAuth>
        }
      />
      <Route
        path="/system-account"
        element={
          <RequireAuth>
            <SystemAccountPage />
          </RequireAuth>
        }
      />
      <Route
        path="/status"
        element={
          <RequireAuth>
            <StatusPage />
          </RequireAuth>
        }
      />
      <Route
        path="/audit-log"
        element={
          <RequireAuth>
            <AuditLogPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<RootRoute />} />
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
