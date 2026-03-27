'use client';

import { motion } from 'framer-motion';
import { heroHeadline, heroSubtext, heroCta, EASE_SMOOTH } from '@/lib/motion';
import HeroVisual from '@/components/animations/HeroVisual';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const BADGE_TEXT = 'AI-POWERED KNOWLEDGE SYSTEM';

export default function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-background pt-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      
      {/* Central Glow Orb (Inspired by Ref) */}
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      
      {/* Floating Orbs */}
      <div aria-hidden className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div aria-hidden className="absolute bottom-[10%] -right-[10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[80px] animate-float pointer-events-none" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6 pt-20 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_SMOOTH }}
          className="mb-8"
        >
          <div className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md flex items-center gap-2 shadow-xl shadow-primary/5">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-primary/80">
              {BADGE_TEXT}
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={heroHeadline}
          initial="hidden"
          animate="visible"
          className="text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight text-foreground"
        >
          Talk to <span className="text-primary relative inline-block">
            Mnemo AI
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 blur-sm rounded-full" />
          </span>
          <br />
          <span className="text-foreground/90">Smarter, Faster, Better</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={heroSubtext}
          initial="hidden"
          animate="visible"
          className="mt-8 text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mx-auto"
        >
          Your intelligent second brain that automatically organizes, tags, and
          resurfaces your saved knowledge with semantic search.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={heroCta}
          initial="hidden"
          animate="visible"
          className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <a
            href="/sign-up"
            className="group relative px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Get Started Now</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>
          
          <a
            href="#how"
            className="px-8 py-4 rounded-2xl border border-border bg-muted/20 backdrop-blur-sm text-foreground font-semibold hover:bg-muted/40 transition-all duration-300 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-foreground/10" />
            Watch Demo
          </a>
        </motion.div>

        {/* Visual Element (inspired by central orb in ref) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16 relative w-full max-w-4xl mx-auto group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
          <div className="relative rounded-3xl border border-white/10 glass-dark p-2 overflow-hidden shadow-2xl">
            <HeroVisual />
          </div>
        </motion.div>
      </div>

      {/* Bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
