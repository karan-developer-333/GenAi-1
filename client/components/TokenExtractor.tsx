'use client';

import { setApiToken } from '@/lib/api';

/**
 * TokenExtractor extracts the Clerk token from the server side
 * and sets it in the axios client instance as soon as possible.
 */
export default function TokenExtractor({ initialToken }: { initialToken: string | null }) {
  // Use module-level side effect to set token immediately upon evaluation/mount
  if (typeof window !== 'undefined' && initialToken) {
    setApiToken(initialToken);
  }

  return null;
}
