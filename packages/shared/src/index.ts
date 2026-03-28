export type Project = {
  projectId: string;
  name: string;
  createdAt: string;
  ownerId: string;
};

export type ProjectCreateInput = {
  name: string;
};

export interface MemberProfile {
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  role: 'member' | 'admin' | 'moderator';
  joinedAt: string;
  projectCount: number;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export type NotificationType = 'project_created' | 'project_deleted' | 'member_joined' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type ApiError = {
  message: string;
  requestId?: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};

export const createProjectId = (): string => {
  return crypto.randomUUID();
};

export const normalizeName = (value: string): string => value.trim();

export const isNonEmpty = (value: string): boolean => value.trim().length > 0;
