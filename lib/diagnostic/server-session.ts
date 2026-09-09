import 'server-only';
import { cookies } from 'next/headers';
import { createHash, randomUUID } from 'node:crypto';

export const DIAGNOSTIC_CANDIDATE_COOKIE = 'pmp_diagnostic_candidate';
export const DIAGNOSTIC_SESSION_COOKIE = 'pmp_diagnostic_session';

export function hashIdentifier(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export async function diagnosticIdentity() {
  const store = await cookies();
  let candidateId = store.get(DIAGNOSTIC_CANDIDATE_COOKIE)?.value;
  if (!candidateId) candidateId = randomUUID();
  return { store, candidateId, sessionId: store.get(DIAGNOSTIC_SESSION_COOKIE)?.value };
}

export function diagnosticCookieOptions() {
  return { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 730 };
}
