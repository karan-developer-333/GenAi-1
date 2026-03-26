'use client';

import { motion } from 'framer-motion';
import { heroHeadline, heroSubtext, heroCta, EASE_SMOOTH } from '@/lib/motion';
import HeroVisual from '@/components/animations/HeroVisual';

const BADGE_TEXT = 'AI-Powered Knowledge Management';

export default function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--bg-base)]"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none" />

      {/* Ambient warm orbs */}
      <div aria-hidden className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.03) 55%, transparent 75%)', filter: 'blur(30px)' }} />
      <div aria-hidden className="absolute top-[45%] left-[15%] w-[350px] h-[350px] rounded-full pointer-events-none animate-glow"
        style={{ background: 'radial-gradient(circle, rgba(201,112,125,0.08) 0%, transparent 70%)', filter: 'blur(55px)' }} />
      <div aria-hidden className="absolute top-[50%] right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none animate-glow"
        style={{ background: 'radial-gradient(circle, rgba(125,154,120,0.08) 0%, transparent 70%)', filter: 'blur(50px)', animationDelay: '1.8s' }} />

      {/* ── Text ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full px-4 sm:px-6 pt-32 sm:pt-36 lg:pt-40 pb-8">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE_SMOOTH }}
          className="mb-7"
        >
          <span className="badge">
            <span className="badge-dot" />
            {BADGE_TEXT}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={heroHeadline}
          initial="hidden"
          animate="visible"
          className="text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-tight"
        >
          <span className="text-[var(--text-primary)]">Your Second Brain</span>
          <br />
          <span className="text-gradient-gold">for the Internet.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={heroSubtext}
          initial="hidden"
          animate="visible"
          className="mt-6 text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed"
        >
          Save articles, tweets, videos and PDFs. MnemoAI automatically organizes,
          tags and resurfaces your knowledge with AI-powered semantic search.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={heroCta}
          initial="hidden"
          animate="visible"
          className="mt-9 flex items-center gap-3 flex-wrap justify-center"
        >
          <a href="/register" className="btn-primary group">
            <span>Start for free</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#features" className="btn-secondary">
            See how it works
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-9 flex items-center gap-3 flex-wrap justify-center"
        >
          {[
            { value: '10K+', label: 'Early users' },
            { value: '4.9',  label: 'Rating', suffix: '★' },
            { value: '∞',    label: 'Saves' },
          ].map(({ value, label, suffix }) => (
            <div key={label} className="stat-card">
              <div className="flex items-baseline gap-1">
                <span className="stat-value">{value}</span>
                {suffix && <span className="text-amber-500 text-base">{suffix}</span>}
              </div>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Full-width SVG visual ──────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-2 sm:px-6 lg:px-12 mt-4 pb-12">
        <HeroVisual />
      </div>

      {/* ── Scroll cue ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-amber-400/50 to-transparent"
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-base)] to-transparent pointer-events-none" />
    </section>
  );
}
