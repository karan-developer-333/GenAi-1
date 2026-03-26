'use client';

import { motion } from 'framer-motion';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';

const TESTIMONIALS = [
  {
    quote: "MnemoAI changed how I research. I used to lose half my saved articles. Now they come back to me exactly when I need them.",
    name: 'Sarah Chen',
    role: 'Product Designer @ Linear',
    avatar: 'SC',
    stars: 5,
    color: '#b8860b',
  },
  {
    quote: "The knowledge graph alone is worth it. Seeing connections between ideas I saved months apart is genuinely mind-blowing.",
    name: 'Marcus Rodriguez',
    role: 'Senior Engineer @ Vercel',
    avatar: 'MR',
    stars: 5,
    color: '#c9707d',
  },
  {
    quote: "I save 30+ things a week. Before MnemoAI it was chaos. Now it's a library I can actually navigate and search intelligently.",
    name: 'Priya Nair',
    role: 'Research Lead @ Anthropic',
    avatar: 'PN',
    stars: 5,
    color: '#7d9a78',
  },
];

function Stars({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill={color}>
          <path d="M8 0l2.163 4.36 4.837.703-3.5 3.412.826 4.812L8 10.77l-4.326 2.517.826-4.812-3.5-3.412 4.837-.703L8 0z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="relative section-padding bg-[var(--bg-base)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-light opacity-30 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="section-title">
              Loved by{' '}
              <span className="text-gradient-gold">knowledge workers</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="section-subtitle mt-6 mx-auto">
              Join thousands of researchers, engineers, and designers who finally have control of their learning.
            </p>
          </ScrollReveal>
        </div>

        <StaggerReveal stagger={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                className="relative rounded-2xl p-7 overflow-hidden h-full flex flex-col group bg-white border border-[var(--border-light)]"
                whileHover={{ y: -6, borderColor: `${t.color}40` }}
                transition={{ duration: 0.3 }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${t.color}08 0%, transparent 60%)` }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <Stars count={t.stars} color={t.color} />
                  <blockquote className="mt-5 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4 mt-6 pt-5" style={{ borderTop: '1px solid var(--border-light)' }}>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${t.color}15 0%, ${t.color}08 100%)`,
                        border: `1px solid ${t.color}25`,
                        color: t.color 
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
