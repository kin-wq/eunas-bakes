/**
 * Minimal in-memory login rate limiter (per deployment instance).
 * For multi-instance production, replace with a shared store (Redis/Upstash).
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, number[]>();

export function loginAllowed(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(key, recent);
  return recent.length < MAX_ATTEMPTS;
}

export function recordLoginAttempt(key: string): void {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
}
