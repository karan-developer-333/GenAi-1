'use client';

import { motion } from 'framer-motion';
import { EASE_SMOOTH } from '@/lib/motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  blur?: boolean;
}

/** Single element scroll-triggered reveal */
export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  y = 40,
  className,
  blur = false,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, ...(blur ? { filter: 'blur(8px)' } : {}) }}
      whileInView={{
        opacity: 1,
        y: 0,
        ...(blur ? { filter: 'blur(0px)' } : {}),
      }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, ease: EASE_SMOOTH, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerRevealProps {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
  className?: string;
}

/** Container that staggers children on scroll */
export function StaggerReveal({
  children,
  stagger = 0.1,
  delayChildren = 0,
  className,
}: StaggerRevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child item for StaggerReveal */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: EASE_SMOOTH },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
