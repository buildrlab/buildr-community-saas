import { cookies, headers as nextHeaders } from 'next/headers';

export const isTestModeEnabled = () => process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export const getTestUser = () =>
  process.env.NEXT_PUBLIC_TEST_USER ?? process.env.TEST_USER ?? null;

export const getServerAuthHeaders = async (): Promise<Record<string, string>> => {
  const headerMap: Record<string, string> = {};

  const requestHeaders = await nextHeaders();
  const headerTestUser = requestHeaders.get('x-test-user');
  if (isTestModeEnabled() && headerTestUser) {
    headerMap['x-test-user'] = headerTestUser;
    return headerMap;
  }

  if (isTestModeEnabled()) {
    const testUser = getTestUser();
    if (testUser) {
      headerMap['x-test-user'] = testUser;
      return headerMap;
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('id_token')?.value;
  if (token) {
    headerMap.authorization = `Bearer ${token}`;
  }

  return headerMap;
};

export const hasAuth = (headers: Record<string, string>): boolean => {
  return Boolean(headers.authorization || headers['x-test-user']);
};
