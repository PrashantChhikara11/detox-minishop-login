/**
 * Fake authentication for the MiniShop sample app.
 * No backend: credentials are hard-coded so E2E tests are fast and repeatable.
 */

export const VALID_USER = {
  email: 'test@minishop.com',
  password: 'Password123',
  name: 'Test User',
} as const;

export type LoginResult =
  | { ok: true; name: string }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Simulates a network call (~800 ms) so the app has a real "busy" period. */
export function login(email: string, password: string): Promise<LoginResult> {
  return new Promise(resolve => {
    setTimeout(() => {
      const trimmed = email.trim().toLowerCase();

      if (!trimmed || !password) {
        resolve({ ok: false, error: 'Email and password are required' });
      } else if (!EMAIL_PATTERN.test(trimmed)) {
        resolve({ ok: false, error: 'Please enter a valid email' });
      } else if (trimmed !== VALID_USER.email || password !== VALID_USER.password) {
        resolve({ ok: false, error: 'Invalid email or password' });
      } else {
        resolve({ ok: true, name: VALID_USER.name });
      }
    }, 800);
  });
}
