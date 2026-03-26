/**
 * motion.ts — Reusable Framer Motion animation presets
 * All variants follow transform + opacity only (GPU-friendly, no layout shifts)
 */

import type { Variants, Transition } from 'framer-motion';

// ─── Easing Presets ───────────────────────────────────────────────────────────

export const EASE_SMOOTH   = [0.16, 1, 0.3, 1] as const;
export const EASE_BOUNCE   = [0.34, 1.56, 0.64, 1] as const;
export const EASE_OUT_EXPO = [0.0, 0.0, 0.2, 1] as const;
export const EASE_IN_OUT   = [0.4, 0, 0.2, 1] as const;

// ─── Transition Presets ───────────────────────────────────────────────────────

export const transitionSmooth: Transition = {
  duration: 0.8,
  ease: EASE_SMOOTH,
};

export const transitionFast: Transition = {
  duration: 0.35,
  ease: EASE_OUT_EXPO,
};

export const transitionSpring: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

export const transitionBounce: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 15,
  mass: 0.6,
};

// ─── Fade Variants ────────────────────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: transitionSmooth },
};

export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transitionSmooth },
};

export const fadeInDown: Variants = {
  hidden:  { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: transitionSmooth },
};

export const fadeInLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: transitionSmooth },
};

export const fadeInRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: transitionSmooth },
};

// ─── Scale Variants ───────────────────────────────────────────────────────────

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: transitionSmooth },
};

export const scaleInBounce: Variants = {
  hidden:  { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1, transition: transitionBounce },
};

// ─── Stagger Containers ───────────────────────────────────────────────────────

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const staggerFadeInUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_SMOOTH },
  },
};

// ─── Hero Text Variants ───────────────────────────────────────────────────────

export const heroHeadline: Variants = {
  hidden:  { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE_SMOOTH },
  },
};

export const heroSubtext: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: EASE_SMOOTH, delay: 0.2 },
  },
};

export const heroCta: Variants = {
  hidden:  { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.6, ease: EASE_BOUNCE, delay: 0.4 },
  },
};

// ─── Floating / Idle ──────────────────────────────────────────────────────────

export const floatIdle = {
  y: [0, -18, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const floatIdleSlow = {
  y: [0, -10, 0],
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const rotateIdle = {
  rotateY: [0, 360],
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: 'linear',
  },
};

// ─── Section Reveal ───────────────────────────────────────────────────────────

export const sectionReveal: Variants = {
  hidden:  { opacity: 0, y: 60 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: EASE_SMOOTH },
  },
};

// ─── Card Hover ───────────────────────────────────────────────────────────────

export const cardHover = {
  rest:  { scale: 1, y: 0, boxShadow: '0 0 0px rgba(59,130,246,0)' },
  hover: {
    scale: 1.025,
    y: -6,
    boxShadow: '0 20px 60px rgba(59,130,246,0.2)',
    transition: transitionSpring,
  },
};

// ─── Viewport Config ──────────────────────────────────────────────────────────

export const viewportOnce = { once: true, margin: '-80px' };
export const viewportRepeat = { once: false, margin: '-60px' };
