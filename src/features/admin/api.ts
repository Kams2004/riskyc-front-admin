import { config } from '../../lib/config';
import { apiFetch } from '../../lib/httpClient';

export type AdminPage<T> = { content: T[]; totalElements: number; totalPages: number; page: number; size: number };

export type AdminUserRow = {
  userId: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  createdAt: string;
  suspended: boolean;
  suspendedReason: string | null;
  suspendedAt: string | null;
};

export type DashboardSummary = {
  totalUsers: number;
  suspendedUsers: number;
  onlineUsers: number;
  totalReports: number;
  totalBlockedPairs: number;
};

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/dashboard/summary`);
}

export function listUsers(q: string, page: number, size: number): Promise<AdminPage<AdminUserRow>> {
  const params = new URLSearchParams({ q, page: String(page), size: String(size) });
  return apiFetch(`${config.adminServiceUrl}/api/admin/users?${params.toString()}`);
}

export function suspendUser(userId: string, reason: string): Promise<AdminUserRow> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/users/${encodeURIComponent(userId)}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function unsuspendUser(userId: string): Promise<AdminUserRow> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/users/${encodeURIComponent(userId)}/unsuspend`, { method: 'POST' });
}

export function deleteUser(userId: string): Promise<void> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/users/${encodeURIComponent(userId)}`, { method: 'DELETE' });
}

export type AdminReportRow = {
  reportId: string;
  reporterId: string;
  reporterDisplayName: string | null;
  reportedId: string;
  reportedDisplayName: string | null;
  reason: string | null;
  createdAt: string;
};

export function listReports(page: number, size: number): Promise<AdminPage<AdminReportRow>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiFetch(`${config.adminServiceUrl}/api/admin/reports?${params.toString()}`);
}

export type AdminBlockedRow = {
  id: string;
  blockerId: string;
  blockerDisplayName: string | null;
  blockedId: string;
  blockedDisplayName: string | null;
  createdAt: string;
};

export function listBlocked(page: number, size: number): Promise<AdminPage<AdminBlockedRow>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiFetch(`${config.adminServiceUrl}/api/admin/blocked?${params.toString()}`);
}

export function broadcast(text: string, recipientId: string | null): Promise<{ recipientCount: number }> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/broadcast`, {
    method: 'POST',
    body: JSON.stringify({ text, recipientId }),
  });
}

export type SystemAccountProfile = {
  userId: string;
  displayName: string | null;
  avatarObjectKey: string | null;
  description: string | null;
  websiteUrl: string | null;
};

export function getSystemAccount(): Promise<SystemAccountProfile> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/system-account`);
}

export function updateSystemAccount(update: {
  displayName: string | null;
  avatarObjectKey: string | null;
  description: string | null;
  websiteUrl: string | null;
}): Promise<SystemAccountProfile> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/system-account`, {
    method: 'PUT',
    body: JSON.stringify(update),
  });
}

export type StatusAdminRow = {
  statusId: string;
  userId: string;
  mediaType: string;
  textContentPreview: string | null;
  createdAt: string;
  expiresAt: string;
};

export function listStatuses(page: number, size: number): Promise<AdminPage<StatusAdminRow>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiFetch(`${config.adminServiceUrl}/api/admin/status?${params.toString()}`);
}

export function deleteStatus(statusId: string): Promise<void> {
  return apiFetch(`${config.adminServiceUrl}/api/admin/status/${encodeURIComponent(statusId)}`, { method: 'DELETE' });
}

export type AuditLogRow = {
  id: string;
  adminUsername: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  details: string | null;
  createdAt: string;
};

export function listAuditLog(page: number, size: number): Promise<AdminPage<AuditLogRow>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiFetch(`${config.adminServiceUrl}/api/admin/audit-log?${params.toString()}`);
}
