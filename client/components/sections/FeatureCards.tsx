'use client';

import { motion } from 'framer-motion';
import { StaggerReveal, StaggerItem, ScrollReveal } from '@/components/animations/ScrollReveal';
import { Tag, Search, Share2, RefreshCw, Layers, Highlighter, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    id: 'ai-tagging',
    icon: <Tag className="w-5 h-5" />,
    title: 'AI Auto-Tagging',
    description: 'Every save is instantly tagged by topic, entity, and concept. No manual work required.',
    color: 'text-blue-500',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    id: 'semantic-search',
    icon: <Search className="w-5 h-5" />,
    title: 'Semantic Search',
    description: 'Ask in plain English. Find what you mean, not just what you typed — powered by embeddings.',
    color: 'text-cyan-500',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  {
    id: 'knowledge-graph',
    icon: <Share2 className="w-5 h-5" />,
    title: 'Knowledge Graph',
    description: 'See connections between your saved ideas. Discover patterns you never knew existed.',
    color: 'text-indigo-500',
    glow: 'group-hover:shadow-indigo-500/20',
  },
  {
    id: 'memory-resurface',
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Memory Resurfacing',
    description: '"You saved this 2 months ago." MnemoAI brings relevant saves back at the right moment.',
    color: 'text-blue-400',
    glow: 'group-hover:shadow-blue-400/20',
  },
  {
    id: 'collections',
    icon: <Layers className="w-5 h-5" />,
    title: 'Smart Collections',
    description: 'Auto-grouped topic clusters. Your library organizes itself as you save more.',
    color: 'text-purple-500',
    glow: 'group-hover:shadow-purple-500/20',
  },
  {
    id: 'highlights',
    icon: <Highlighter className="w-5 h-5" />,
    title: 'AI Highlights',
    description: 'Key sentences automatically extracted from articles and PDFs. Save time, capture insight.',
    color: 'text-sky-500',
    glow: 'group-hover:shadow-sky-500/20',
  },
];

interface FeatureCardProps {
  feature: typeof FEATURES[0];
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <motion.div
      id={`feature-${feature.id}`}
      className={`relative group p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm cursor-default overflow-hidden transition-all duration-500 hover:border-primary/30 hover:-translate-y-2 ${feature.glow} shadow-xl`}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-muted/30 border border-border group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-sm ${feature.color}`}>
          {feature.icon}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>

        <motion.div
          className="flex items-center gap-2 mt-6 text-xs font-bold text-primary"
          variants={{
            rest:  { opacity: 0, x: -4 },
            hover: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <span>Explore Feature</span>
          <ArrowRight className="w-3.5 h-3.5" />
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
      className="relative py-24 bg-background overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight">
              Everything your knowledge{' '}
              <span className="text-primary italic">deserves</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Six core capabilities that transform scattered saves into a living, connected knowledge base.
            </p>
          </ScrollReveal>
        </div>

        <StaggerReveal stagger={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
