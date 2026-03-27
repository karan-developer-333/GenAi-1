'use client';

import { motion } from 'framer-motion';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';
import { Tag, Search, Share2, RefreshCw, Layers, Highlighter, Sparkles, ArrowRight } from 'lucide-react';

const FEATURES_DATA = [
  { id: 'ai-tagging',  icon: <Tag className="w-8 h-8" />,  title: 'AI Auto-Tagging',      description: 'Every save is instantly tagged by topic, entity, and concept. No manual work required.',         tag: 'AI',           color: 'blue' },
  { id: 'semantic',    icon: <Search className="w-8 h-8" />,      title: 'Semantic Search',      description: 'Ask in plain English. Find what you mean, not just what you typed — powered by embeddings.',        tag: 'Search',       color: 'cyan' },
  { id: 'graph',       icon: <Share2 className="w-8 h-8" />,        title: 'Knowledge Graph',      description: 'See connections between your saved ideas. Discover patterns you never knew existed.',               tag: 'Visualization',color: 'indigo' },
  { id: 'resurface',   icon: <RefreshCw className="w-8 h-8" />,   title: 'Memory Resurfacing',   description: '"You saved this 2 months ago." MnemoAI brings relevant saves back at the right moment.',           tag: 'Spaced Recall', color: 'blue' },
  { id: 'collections', icon: <Layers className="w-8 h-8" />, title: 'Smart Collections',    description: 'Auto-grouped topic clusters. Your library organizes itself as you save more.',                      tag: 'Organization', color: 'purple' },
  { id: 'highlights',  icon: <Highlighter className="w-8 h-8" />,  title: 'AI Highlights',        description: 'Key sentences automatically extracted from articles and PDFs. Save time, capture insight.',          tag: 'Extraction',   color: 'sky' },
];

export default function FeaturesSection() {
  return (
    <section id="features" aria-label="Product Features"
      className="relative py-24 bg-background overflow-hidden">
      
      {/* Background glow */}
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-video rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <ScrollReveal>
             <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs tracking-widest uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              <span>MnemoAI Suite</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
              Smarter memory for the{' '}
              <span className="text-primary italic">modern era</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Six core capabilities that transform scattered saves into a living,
              connected knowledge base that grows with you.
            </p>
          </ScrollReveal>
        </div>

        {/* Feature grid */}
        <StaggerReveal stagger={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DATA.map((f) => (
            <StaggerItem key={f.id}>
              <motion.div
                id={`feature-${f.id}`}
                className="group relative h-full p-8 rounded-3xl border border-border bg-card/40 backdrop-blur-md overflow-hidden cursor-default transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                {/* Glow Background */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-muted/30 border border-border group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 text-muted-foreground`}>
                    {f.icon}
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {f.title}
                      </h3>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {f.tag}
                      </span>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  <motion.div 
                    className="flex items-center gap-2 mt-8 text-xs font-bold text-primary"
                    variants={{ rest: { opacity: 0, x: -4 }, hover: { opacity: 1, x: 0 } }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>Learn how it works</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
