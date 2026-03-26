/**
 * utils.ts — General utility helpers
 */

/** Merge class names (lightweight alternative — no clsx dependency) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Check if we're on client side */
export const isClient = typeof window !== 'undefined';

/** Prefersreduced motion check */
export function prefersReducedMotion(): boolean {
  if (!isClient) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/** Delay utility for async operations */
export const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

/** Format a number with compact notation */
export function formatCompact(num: number): string {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(num);
}
