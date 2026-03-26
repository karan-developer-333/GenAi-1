'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const BRANDS = [
  { name: 'MnemoAI',  icon: '◈' },
  { name: 'Notion',   icon: '◻' },
  { name: 'Obsidian', icon: '◆' },
  { name: 'Readwise', icon: '◉' },
  { name: 'Roam',     icon: '◌' },
  { name: 'Logseq',   icon: '▣' },
  { name: 'Heptabase',icon: '⟡' },
  { name: 'Matter',   icon: '◈' },
];

const REPEATED = [...BRANDS, ...BRANDS, ...BRANDS];

export default function MarqueeSection() {
  return (
    <section
      aria-label="Trusted brands"
      className="relative py-6 border-y border-[var(--border-cream)] bg-[var(--bg-warm)] overflow-hidden"
    >
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[var(--bg-warm)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[var(--bg-warm)] to-transparent pointer-events-none" />

      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-12 shrink-0"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            duration: 28,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {REPEATED.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center gap-2.5 shrink-0 select-none"
            >
              <span className="text-[var(--amber-primary)] text-base">{brand.icon}</span>
              <span className="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap hover:text-[var(--text-primary)] transition-colors duration-200">
                {brand.name}
              </span>
              <span className="mx-4 text-[var(--border-subtle)] select-none">+</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
