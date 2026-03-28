'use client';

import { motion } from 'framer-motion';
import { heroHeadline, heroSubtext, heroCta, EASE_SMOOTH } from '@/lib/motion';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const BADGE_TEXT = 'AI-Powered Knowledge Management';

export default function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-background pt-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-ai-mesh opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      
      {/* Central Glow Orb */}
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-assistant-glow pointer-events-none" />
      
      {/* Floating Orbs */}
      <div aria-hidden className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-ai-float pointer-events-none" />
      <div aria-hidden className="absolute bottom-[10%] -right-[10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[80px] animate-ai-float pointer-events-none" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6 pt-20 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_SMOOTH }}
          className="mb-8"
        >
          <div className="badge badge-primary backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{BADGE_TEXT}</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={heroHeadline}
          initial="hidden"
          animate="visible"
          className="text-hero text-foreground"
        >
          Your Second Brain for{' '}
          <span className="text-primary relative">
            the Internet
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 blur-sm rounded-full" />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={heroSubtext}
          initial="hidden"
          animate="visible"
          className="mt-8 text-body-lg text-muted-foreground max-w-xl mx-auto"
        >
          Save articles, tweets, videos, and PDFs. MnemoAI automatically organizes, 
          tags, and surfaces exactly what you need — when you need it.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={heroCta}
          initial="hidden"
          animate="visible"
          className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <Link
            href="/sign-up"
            className="btn btn-primary px-8 py-4 shadow-xl shadow-primary/25"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <a
            href="#features"
            className="btn btn-secondary px-8 py-4"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Demo
          </a>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          variants={heroSubtext}
          initial="hidden"
          animate="visible"
          className="mt-16 flex items-center gap-3 text-sm text-muted-foreground"
        >
          <div className="flex -space-x-2">
            {['JD', 'AK', 'SM', 'RL'].map((initials) => (
              <div key={initials} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
                {initials}
              </div>
            ))}
          </div>
          <span>Trusted by <span className="text-foreground font-semibold">2,000+</span> knowledge workers</span>
        </motion.div>
      </div>

      {/* Bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
