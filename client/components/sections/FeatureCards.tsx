'use client';

import { motion } from 'framer-motion';
import { StaggerReveal, StaggerItem, ScrollReveal } from '@/components/animations/ScrollReveal';
import { Tag, Search, Share2, RefreshCw, Layers, Highlighter, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    id: 'ai-tagging',
    icon: <Tag className="w-5 h-5" />,
    title: 'Smart Auto-Tagging',
    description: 'Every item is instantly analyzed and tagged by topic, entity, and concept. Zero manual work.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'semantic-search',
    icon: <Search className="w-5 h-5" />,
    title: 'Natural Language Search',
    description: 'Ask questions in plain English. Find what you mean, not just what you typed.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'knowledge-graph',
    icon: <Share2 className="w-5 h-5" />,
    title: 'Visual Knowledge Graph',
    description: 'See how your ideas connect. Discover patterns and relationships you never knew existed.',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    id: 'memory-resurface',
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Smart Reminders',
    description: 'Relevant content resurfaces at the perfect moment. "You saved this last month — here it is."',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    id: 'collections',
    icon: <Layers className="w-5 h-5" />,
    title: 'Auto Collections',
    description: 'Content automatically organizes into topic-based collections as your library grows.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'highlights',
    icon: <Highlighter className="w-5 h-5" />,
    title: 'AI Highlights',
    description: 'Key insights automatically extracted from articles and PDFs. Read more, faster.',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
  },
];

interface FeatureCardProps {
  feature: typeof FEATURES[0];
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <motion.div
      id={`feature-${feature.id}`}
      className="card card-hover p-8 cursor-default overflow-hidden group"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${feature.bgColor} border border-border flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${feature.color}`}>
          {feature.icon}
        </div>

        <div className="mt-6">
          <h3 className="text-h4 text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-body-sm text-muted-foreground">
            {feature.description}
          </p>
        </div>

        <motion.div
          className="flex items-center gap-2 mt-6 text-sm font-semibold text-primary"
          variants={{
            rest:  { opacity: 0, x: -4 },
            hover: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function FeatureCards() {
  return (
    <section
      id="features"
      aria-label="Platform Features"
      className="relative py-32 bg-background overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <ScrollReveal>
            <span className="badge badge-primary mb-6">Features</span>
            <h2 className="text-h1 text-foreground mt-4">
              Everything your knowledge{' '}
              <span className="text-primary">deserves</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
              Six powerful capabilities that transform scattered saves into a living, connected knowledge base.
            </p>
          </ScrollReveal>
        </div>

        <StaggerReveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
