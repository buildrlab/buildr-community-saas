export type HeaderMap = Record<string, string | undefined>;

export const normalizeHeaders = (headers?: Record<string, string | undefined> | null): HeaderMap => {
  if (!headers) return {};
  return Object.entries(headers).reduce<HeaderMap>((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});
};

export const getHeader = (headers: HeaderMap, name: string): string | undefined => {
  return headers[name.toLowerCase()];
};
