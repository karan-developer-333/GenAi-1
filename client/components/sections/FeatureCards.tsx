'use client';

import { motion } from 'framer-motion';
import { StaggerReveal, StaggerItem, ScrollReveal } from '@/components/animations/ScrollReveal';

const FEATURES = [
  {
    id: 'ai-tagging',
    icon: '🏷',
    title: 'AI Auto-Tagging',
    description: 'Every save is instantly tagged by topic, entity, and concept. No manual work required.',
    gradient: 'from-amber-50 to-amber-100/50',
    borderColor: 'border-amber-200',
    tagColor: 'text-amber-600',
    tagBg: 'bg-amber-50',
    tagBorder: 'border-amber-200',
  },
  {
    id: 'semantic-search',
    icon: '🔍',
    title: 'Semantic Search',
    description: 'Ask in plain English. Find what you mean, not just what you typed — powered by embeddings.',
    gradient: 'from-sage-50 to-sage-100/50',
    borderColor: 'border-sage-200',
    tagColor: 'text-sage-600',
    tagBg: 'bg-sage-50',
    tagBorder: 'border-sage-200',
  },
  {
    id: 'knowledge-graph',
    icon: '⬡',
    title: 'Knowledge Graph',
    description: 'See connections between your saved ideas. Discover patterns you never knew existed.',
    gradient: 'from-rose-50 to-rose-100/50',
    borderColor: 'border-rose-200',
    tagColor: 'text-rose-600',
    tagBg: 'bg-rose-50',
    tagBorder: 'border-rose-200',
  },
  {
    id: 'memory-resurface',
    icon: '🔁',
    title: 'Memory Resurfacing',
    description: '"You saved this 2 months ago." MnemoAI brings relevant saves back at the right moment.',
    gradient: 'from-amber-50 to-amber-100/50',
    borderColor: 'border-amber-200',
    tagColor: 'text-amber-600',
    tagBg: 'bg-amber-50',
    tagBorder: 'border-amber-200',
  },
  {
    id: 'collections',
    icon: '📚',
    title: 'Smart Collections',
    description: 'Auto-grouped topic clusters. Your library organizes itself as you save more.',
    gradient: 'from-sage-50 to-sage-100/50',
    borderColor: 'border-sage-200',
    tagColor: 'text-sage-600',
    tagBg: 'bg-sage-50',
    tagBorder: 'border-sage-200',
  },
  {
    id: 'highlights',
    icon: '✦',
    title: 'AI Highlights',
    description: 'Key sentences automatically extracted from articles and PDFs. Save time, capture insight.',
    gradient: 'from-rose-50 to-rose-100/50',
    borderColor: 'border-rose-200',
    tagColor: 'text-rose-600',
    tagBg: 'bg-rose-50',
    tagBorder: 'border-rose-200',
  },
];

interface FeatureCardProps {
  feature: typeof FEATURES[0];
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <motion.div
      id={`feature-${feature.id}`}
      className={`relative group p-6 rounded-2xl border ${feature.borderColor} bg-gradient-to-br ${feature.gradient} cursor-default overflow-hidden`}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Hover shadow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        variants={{
          rest:  { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: '0 8px 30px rgba(184, 134, 11, 0.12)',
        }}
      />

      <div className="relative z-10">
        {/* Icon + tag */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white border border-[var(--border-light)] text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
            {feature.icon}
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${feature.tagBg} ${feature.tagColor} border ${feature.tagBorder}`}>
            {feature.id === 'ai-tagging' || feature.id === 'memory-resurface' || feature.id === 'highlights' ? 'AI' : 
             feature.id === 'semantic-search' ? 'Search' :
             feature.id === 'knowledge-graph' ? 'Visualization' : 'Organization'}
          </span>
        </div>

        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--amber-primary)] transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {feature.description}
        </p>

        {/* Arrow on hover */}
        <motion.div
          className="flex items-center gap-1 mt-4 text-xs text-[var(--amber-primary)]"
          variants={{
            rest:  { opacity: 0, x: -4 },
            hover: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.25 }}
        >
          <span>Learn more</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function FeatureCards() {
  return (
    <section
      id="features-grid"
      aria-label="Platform Features"
      className="relative section-padding bg-[var(--bg-base)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] leading-tight">
              Everything your knowledge{' '}
              <span className="text-gradient-gold">deserves</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">
              Six core capabilities that transform scattered saves into a living, connected knowledge base.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards grid */}
        <StaggerReveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.id}>
              <FeatureCard feature={feature} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
