'use client';

import { motion } from 'framer-motion';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';

function AITaggingIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <motion.rect x="4" y="4" width="40" height="40" rx="10"
        stroke="#b8860b" strokeWidth="1.5" fill="rgba(184,134,11,0.06)"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1, ease: [0.16,1,0.3,1] }} />
      {[
        { x: 13, y: 14, w: 22, c: '#d4a853', d: 0.3 },
        { x: 13, y: 22, w: 16, c: '#c9707d', d: 0.5 },
        { x: 13, y: 30, w: 19, c: '#b8860b', d: 0.7 },
      ].map(({ x, y, w, c, d }, i) => (
        <motion.rect key={i} x={x} y={y} width={w} height="4" rx="2" fill={c}
          initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: d, ease: [0.16,1,0.3,1] }}
          style={{ transformOrigin: `${x}px ${y + 2}px` }} />
      ))}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <motion.circle cx="21" cy="21" r="13"
        stroke="#7d9a78" strokeWidth="1.5" fill="rgba(125,154,120,0.06)"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.9 }} />
      <motion.line x1="30.5" y1="30.5" x2="42" y2="42"
        stroke="#7d9a78" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 }} />
      {[14, 19, 24].map((y, i) => (
        <motion.line key={i} x1="15" y1={y} x2={21 + (i % 2 === 0 ? 4 : 2)} y2={y}
          stroke="#9db599" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }} />
      ))}
    </svg>
  );
}

function GraphIcon() {
  const nodes = [
    { cx: 24, cy: 24, r: 5, c: '#b8860b' },
    { cx: 10, cy: 12, r: 3.5, c: '#c9707d' },
    { cx: 38, cy: 10, r: 3.5, c: '#7d9a78' },
    { cx: 40, cy: 36, r: 3.5, c: '#d4a853' },
    { cx: 10, cy: 38, r: 3.5, c: '#c9707d' },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[1,4],[2,3]];
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#b8860b" strokeWidth="1" strokeOpacity={0.4}
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }} />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.cx} cy={n.cy} r={n.r}
          fill={`${n.c}20`} stroke={n.c} strokeWidth="1.5"
          initial={{ scale: 0 }} whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 240, damping: 14, delay: i * 0.1 }}
          style={{ transformOrigin: `${n.cx}px ${n.cy}px` }} />
      ))}
    </svg>
  );
}

function ResurfaceIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <motion.path d="M24 8 C14 8 8 16 8 24 C8 32 14 40 24 40 C34 40 40 32 40 24"
        stroke="#c9707d" strokeWidth="1.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1, ease: [0.16,1,0.3,1] }} />
      <motion.path d="M34 20 L40 24 L36 30"
        stroke="#c9707d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.8 }} />
      <motion.circle cx="24" cy="24" r="5"
        fill="rgba(201,112,125,0.15)" stroke="#c9707d" strokeWidth="1.5"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.5 }}
        style={{ transformOrigin: '24px 24px' }} />
    </svg>
  );
}

function CollectionsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      {[
        { y: 28, c: '#7d9a78', d: 0.1 },
        { y: 18, c: '#9db599', d: 0.3 },
        { y: 10, c: '#b8860b', d: 0.5 },
      ].map(({ y, c, d }, i) => (
        <motion.rect key={i} x={10} y={y} width={28} height={10} rx={4}
          fill={`${c}15`} stroke={c} strokeWidth="1.2"
          initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: d, ease: [0.16,1,0.3,1] }} />
      ))}
    </svg>
  );
}

function HighlightsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <motion.rect x="6" y="8" width="36" height="32" rx="6"
        stroke="#d4a853" strokeWidth="1.2" fill="rgba(212,168,83,0.05)"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }} />
      {[
        { x: 12, y: 17, w: 24, hl: false, d: 0.4 },
        { x: 12, y: 23, w: 20, hl: true,  d: 0.55 },
        { x: 12, y: 29, w: 22, hl: false, d: 0.7 },
      ].map(({ x, y, w, hl, d }, i) => (
        <motion.rect key={i} x={x} y={y - 1} width={w} height={5} rx={2}
          fill={hl ? 'rgba(212,168,83,0.25)' : 'transparent'}
          stroke={hl ? '#d4a853' : 'transparent'} strokeWidth="0"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: d }}
          style={{ transformOrigin: `${x}px ${y}px` }}>
          {!hl && <motion.line x1={x} y1={y + 2} x2={x + w} y2={y + 2}
            stroke="#9a9a9a" strokeWidth="1" strokeLinecap="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: d }} />}
        </motion.rect>
      ))}
    </svg>
  );
}

const FEATURES = [
  { id: 'ai-tagging',  Icon: AITaggingIcon,  title: 'AI Auto-Tagging',      description: 'Every save is instantly tagged by topic, entity, and concept. No manual work required.',         tag: 'AI',           color: '#b8860b' },
  { id: 'semantic',    Icon: SearchIcon,      title: 'Semantic Search',      description: 'Ask in plain English. Find what you mean, not just what you typed — powered by embeddings.',        tag: 'Search',       color: '#7d9a78' },
  { id: 'graph',       Icon: GraphIcon,       title: 'Knowledge Graph',      description: 'See connections between your saved ideas. Discover patterns you never knew existed.',               tag: 'Visualization',color: '#c9707d' },
  { id: 'resurface',   Icon: ResurfaceIcon,   title: 'Memory Resurfacing',   description: '"You saved this 2 months ago." MnemoAI brings relevant saves back at the right moment.',           tag: 'Spaced Recall', color: '#c9707d' },
  { id: 'collections', Icon: CollectionsIcon, title: 'Smart Collections',    description: 'Auto-grouped topic clusters. Your library organizes itself as you save more.',                      tag: 'Organization', color: '#7d9a78' },
  { id: 'highlights',  Icon: HighlightsIcon,  title: 'AI Highlights',        description: 'Key sentences automatically extracted from articles and PDFs. Save time, capture insight.',          tag: 'Extraction',   color: '#d4a853' },
];

export default function FeaturesSection() {
  return (
    <section id="features" aria-label="Product Features"
      className="relative section-padding bg-[var(--bg-base)] overflow-hidden">
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.08) 0%, transparent 65%)', filter: 'blur(40px)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="section-label mb-4">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 0l1.5 4.5H12l-3.75 2.75L9.75 12 6 9.25 2.25 12l1.5-4.75L0 4.5h4.5z" />
              </svg>
              Platform Features
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title mt-4">
              Everything your knowledge{' '}
              <span className="text-gradient-gold">deserves</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.18}>
            <p className="section-subtitle mt-5 mx-auto">
              Six core capabilities that transform scattered saves into a living,
              connected knowledge base.
            </p>
          </ScrollReveal>
        </div>

        {/* Feature grid */}
        <StaggerReveal stagger={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {FEATURES.map((f) => (
            <StaggerItem key={f.id}>
              <motion.div
                id={`feature-${f.id}`}
                className="group relative p-6 rounded-2xl border border-[var(--border-light)] overflow-hidden cursor-default bg-white"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                {/* Hover glow */}
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  variants={{
                    rest:  { opacity: 0 },
                    hover: { opacity: 1 },
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ background: `radial-gradient(circle at 50% 50%, ${f.color}10 0%, transparent 70%)` }} />
                {/* Hover border */}
                <motion.div className="absolute inset-0 rounded-2xl border pointer-events-none"
                  variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                  style={{ borderColor: `${f.color}30` }} />

                <div className="relative z-10">
                  {/* Icon + tag */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="group-hover:scale-110 transition-transform duration-300 origin-left">
                      <f.Icon />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--bg-cream)] border border-[var(--border-subtle)]"
                      style={{ color: f.color }}>
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors duration-300">
                    {f.description}
                  </p>

                  <motion.div className="flex items-center gap-1.5 mt-4 text-[10px]"
                    style={{ color: f.color }}
                    variants={{ rest: { opacity: 0, x: -4 }, hover: { opacity: 1, x: 0 } }}
                    transition={{ duration: 0.22 }}>
                    <span>Explore</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
