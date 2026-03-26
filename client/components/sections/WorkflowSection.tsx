'use client';

import { motion } from 'framer-motion';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';

const STEPS = [
  {
    num: '01',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
    title: 'Save Anything',
    description: 'Use our browser extension, share sheet, or API to save articles, tweets, YouTube videos, PDFs, and images in one click.',
    detail: 'Works everywhere you browse',
    color: '#b8860b',
  },
  {
    num: '02',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    title: 'AI Organizes It',
    description: 'MnemoAI reads, summarizes, tags, clusters by topic, and builds connections between your saves — automatically, in seconds.',
    detail: 'No folders. No manual work.',
    color: '#c9707d',
  },
  {
    num: '03',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Knowledge Resurfaces',
    description: 'At the right moment, related saves bubble up. Use semantic search or browse the graph to rediscover what you know.',
    detail: 'Your PKM grows smarter over time',
    color: '#7d9a78',
  },
];

export default function WorkflowSection() {
  return (
    <section
      id="how"
      aria-label="How it works"
      className="relative section-padding bg-[var(--bg-warm)] overflow-hidden"
    >
      {/* BG dot grid */}
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <ScrollReveal>
            <span className="section-label mb-4">
              How it works
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title mt-4">
              Three steps to a{' '}
              <span className="text-gradient-gold">smarter library</span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-[72px] left-[calc(16.66%-48px)] right-[calc(16.66%-48px)] h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.4), rgba(201,112,125,0.4), rgba(125,154,120,0.4), transparent)',
            }}
          />

          <StaggerReveal stagger={0.15} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map((step) => (
              <StaggerItem key={step.num}>
                <motion.div
                  className="flex flex-col items-center text-center lg:text-left lg:items-start group"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Step number + icon */}
                  <div className="relative mb-8">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white border border-[var(--border-light)]"
                      style={{
                        boxShadow: `0 4px 20px ${step.color}10`,
                      }}
                    >
                      <div style={{ color: step.color }}>{step.icon}</div>
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                      style={{ background: step.color }}
                    >
                      {step.num.slice(-1)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 max-w-[280px]">
                    {step.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ 
                      color: step.color, 
                      background: `${step.color}10`,
                      border: `1px solid ${step.color}20`
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {step.detail}
                  </span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>

        {/* Bottom CTA mini */}
        <ScrollReveal delay={0.2} className="text-center mt-20">
          <motion.a
            href="#"
            id="workflow-cta"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--amber-primary)] hover:text-[var(--amber-dark)] transition-colors duration-200"
            whileHover={{ x: 4 }}
          >
            See a full demo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
}
