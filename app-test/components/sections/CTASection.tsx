'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export default function CTASection() {
  return (
    <section
      aria-label="Call to Action"
      className="relative section-padding overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 cta-gradient-light" />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,168,83,0.1) 0%, transparent 60%)',
        }}
      />

      {/* Grid lines */}
      <div className="absolute inset-0 bg-grid-light opacity-30 pointer-events-none" />

      {/* Top gradient border */}
      <div 
        className="absolute top-0 left-0 right-0 h-px" 
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.4), rgba(212,168,83,0.4), transparent)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating badge */}
        <ScrollReveal>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-10"
          >
            <div 
              className="absolute inset-0 rounded-2xl animate-glow"
              style={{
                background: 'radial-gradient(circle, rgba(212,168,83,0.3) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight">
            Start building your{' '}
            <span className="text-gradient-gold">second brain</span>
            <br />
            today.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="section-subtitle mt-8 mx-auto">
            Join thousands of researchers, engineers, and designers who never lose a
            great idea again. Free to start, no credit card required.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
            <motion.a
              href="/register"
              id="cta-main"
              className="btn-primary group"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Get started for free</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
            <motion.a
              href="#"
              id="cta-demo"
              className="btn-secondary"
              whileHover={{ scale: 1.02 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 3l6 5-6 5V3z" />
              </svg>
              Watch 2-min demo
            </motion.a>
          </div>
        </ScrollReveal>

        {/* Trust signals */}
        <ScrollReveal delay={0.35}>
          <div className="mt-14 flex items-center justify-center gap-8 flex-wrap">
            {['No credit card needed', 'Cancel anytime', 'GDPR compliant', '99.9% uptime'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 3.5-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{item}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
