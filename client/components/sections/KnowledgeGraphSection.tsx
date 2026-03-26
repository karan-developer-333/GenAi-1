'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  size: number;
  color: string;
  type: 'center' | 'primary' | 'secondary';
}

interface Edge {
  from: string;
  to: string;
}

const NODES: Node[] = [
  { id: 'n0',  x: 50,  y: 50,  label: 'AI',           size: 22, color: '#b8860b', type: 'center'    },
  { id: 'n1',  x: 20,  y: 20,  label: 'transformers', size: 16, color: '#c9707d', type: 'primary'   },
  { id: 'n2',  x: 78,  y: 22,  label: 'attention',    size: 15, color: '#7d9a78', type: 'primary'   },
  { id: 'n3',  x: 18,  y: 75,  label: 'LLMs',         size: 16, color: '#d4a853', type: 'primary'   },
  { id: 'n4',  x: 80,  y: 72,  label: 'embeddings',   size: 14, color: '#c9707d', type: 'primary'   },
  { id: 'n5',  x: 50,  y: 15,  label: 'neural nets',  size: 13, color: '#9db599', type: 'secondary' },
  { id: 'n6',  x: 8,   y: 48,  label: 'AGI',          size: 12, color: '#b8860b', type: 'secondary' },
  { id: 'n7',  x: 92,  y: 45,  label: 'RAG',          size: 12, color: '#7d9a78', type: 'secondary' },
  { id: 'n8',  x: 35,  y: 85,  label: 'memory',       size: 13, color: '#d4a853', type: 'secondary' },
  { id: 'n9',  x: 65,  y: 88,  label: 'knowledge',    size: 13, color: '#c9707d', type: 'secondary' },
  { id: 'n10', x: 62,  y: 35,  label: 'OpenAI',       size: 11, color: '#9db599', type: 'secondary' },
  { id: 'n11', x: 30,  y: 38,  label: 'prompts',      size: 11, color: '#b8860b', type: 'secondary' },
];

const EDGES: Edge[] = [
  { from: 'n0', to: 'n1' }, { from: 'n0', to: 'n2' }, { from: 'n0', to: 'n3' },
  { from: 'n0', to: 'n4' }, { from: 'n0', to: 'n5' }, { from: 'n0', to: 'n8' },
  { from: 'n1', to: 'n5' }, { from: 'n1', to: 'n6' }, { from: 'n1', to: 'n11' },
  { from: 'n2', to: 'n5' }, { from: 'n2', to: 'n10' },{ from: 'n3', to: 'n6' },
  { from: 'n3', to: 'n8' }, { from: 'n4', to: 'n7' }, { from: 'n4', to: 'n9' },
  { from: 'n8', to: 'n9' }, { from: 'n9', to: 'n7' }, { from: 'n10', to: 'n11' },
];

function getNodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function KnowledgeGraphSVG() {
  return (
    <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="centerGlowLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b8860b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#b8860b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow at center */}
        <circle cx="50" cy="50" r="20" fill="url(#centerGlowLight)" />

        {/* Edges */}
        {EDGES.map(({ from, to }, i) => {
          const a = getNodeById(from);
          const b = getNodeById(to);
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="rgba(184,134,11,0.15)"
              strokeWidth="0.3"
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 1, pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 + 0.2, duration: 0.6 }}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            {/* Glow ring around center node */}
            {node.type === 'center' && (
              <motion.circle
                cx={node.x} cy={node.y}
                r={node.size * 0.65}
                fill="none"
                stroke={node.color}
                strokeWidth="0.5"
                strokeOpacity={0.4}
                animate={{ r: [node.size * 0.65, node.size * 0.85, node.size * 0.65] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {/* Node circle */}
            <circle
              cx={node.x} cy={node.y}
              r={node.size * 0.45}
              fill={`${node.color}18`}
              stroke={node.color}
              strokeWidth={node.type === 'center' ? '0.7' : '0.4'}
              strokeOpacity={node.type === 'center' ? 0.9 : 0.6}
            />
            {/* Label */}
            <text
              x={node.x}
              y={node.y + node.size * 0.5 + 2.5}
              textAnchor="middle"
              fontSize="2.8"
              fill={node.color}
              fillOpacity={0.9}
              fontFamily="system-ui"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function KnowledgeGraphSection() {
  return (
    <section
      id="graph"
      aria-label="Knowledge Graph"
      className="relative section-padding bg-[var(--bg-warm)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,168,83,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <ScrollReveal>
              <span className="text-xs text-[var(--amber-primary)] font-medium uppercase tracking-widest mb-4 block">
                Graph Visualization
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-6">
                See how your ideas{' '}
                <span className="text-gradient-gold">connect</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                MnemoAI builds a living knowledge graph from your saves. 
                Topics cluster together, related concepts become visible, 
                and hidden connections surface automatically.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <ul className="space-y-3">
                {[
                  { icon: '⬡', text: 'Auto-cluster by topic', color: '#b8860b' },
                  { icon: '↔', text: 'Cross-domain connection discovery', color: '#c9707d' },
                  { icon: '🔍', text: 'Click any node to explore', color: '#7d9a78' },
                ].map(({ icon, text, color }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-white border border-[var(--border-light)] text-base shrink-0">
                      {icon}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          {/* Graph */}
          <ScrollReveal delay={0.1} blur className="relative">
            <div className="glass-warm rounded-2xl p-6 overflow-hidden border border-[var(--border-cream)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[var(--text-muted)] font-mono">knowledge.graph</span>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-[var(--text-muted)]">Live</span>
                </div>
              </div>
              <KnowledgeGraphSVG />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
