export type Project = {
  projectId: string;
  name: string;
  createdAt: string;
  ownerId: string;
};

export type ProjectCreateInput = {
  name: string;
};

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
