import type {
  AdminUser,
} from '@/types/auth';

const TOKEN_KEY =
  'florea_admin_token';

const USER_KEY =
  'florea_admin_user';

export function saveAuth(
  token: string,
  user: AdminUser,
) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    TOKEN_KEY,
    token,
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );
}

export function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(
    TOKEN_KEY,
  );
}

export function getUser():
  | AdminUser
  | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value =
    localStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(
      value,
    ) as AdminUser;
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(
    TOKEN_KEY,
  );

  localStorage.removeItem(
    USER_KEY,
  );
}