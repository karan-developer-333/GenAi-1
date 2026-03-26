'use client';

import { motion } from 'framer-motion';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';

const PROBLEMS = [
  { icon: '📥', text: 'You save 30 articles a week and never re-read them.' },
  { icon: '🔍', text: 'You search for that thing you read 2 months ago. You can\'t find it.' },
  { icon: '🌀', text: 'Your bookmarks are a graveyard. Your notes app is chaos.' },
];

const SOLUTIONS = [
  { icon: '✦', text: 'Every save is auto-tagged, summarized, and clustered by AI.' },
  { icon: '🔁', text: 'MnemoAI surfaces relevant saves at exactly the right moment.' },
  { icon: '⬡', text: 'A living knowledge graph connects your ideas automatically.' },
];

export default function ProblemSolutionSection() {
  return (
    <section
      id="product"
      aria-label="Problem and Solution"
      className="relative section-padding bg-[var(--bg-base)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 50%, rgba(212,168,83,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Problem */}
          <div>
            <ScrollReveal>
              <span className="text-xs font-medium uppercase tracking-widest text-rose-500 mb-4 block">
                The Problem
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-8">
                You&#39;re saving things you&#39;ll never find again.
              </h2>
            </ScrollReveal>
            <StaggerReveal stagger={0.12} className="space-y-4">
              {PROBLEMS.map(({ icon, text }) => (
                <StaggerItem key={text}>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100">
                    <span className="text-xl shrink-0">{icon}</span>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>

          {/* Solution */}
          <div>
            <ScrollReveal delay={0.1}>
              <span className="text-xs font-medium uppercase tracking-widest text-[var(--amber-primary)] mb-4 block">
                The Solution
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-8">
                MnemoAI makes your saves work <span className="text-gradient-gold">for</span> you.
              </h2>
            </ScrollReveal>
            <StaggerReveal stagger={0.12} delayChildren={0.1} className="space-y-4">
              {SOLUTIONS.map(({ icon, text }) => (
                <StaggerItem key={text}>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-xl shrink-0 text-[var(--amber-primary)]">{icon}</span>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
