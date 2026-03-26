'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface N { id: number; cx: number; cy: number; r: number; color: string; delay: number; tier: 'hub' | 'p' | 's'; }

const HUB: N  = { id: 0, cx: 700, cy: 280, r: 13, color: '#b8860b', delay: 0,    tier: 'hub' };

const PRIMARY: N[] = [
  { id: 1, cx: 500, cy: 155, r: 8, color: '#d4a853', delay: 0.12, tier: 'p' },
  { id: 2, cx: 700, cy: 108, r: 7, color: '#c9707d', delay: 0.18, tier: 'p' },
  { id: 3, cx: 900, cy: 155, r: 8, color: '#7d9a78', delay: 0.22, tier: 'p' },
  { id: 4, cx: 960, cy: 280, r: 8, color: '#d4a853', delay: 0.28, tier: 'p' },
  { id: 5, cx: 900, cy: 405, r: 8, color: '#c9707d', delay: 0.22, tier: 'p' },
  { id: 6, cx: 700, cy: 452, r: 7, color: '#7d9a78', delay: 0.28, tier: 'p' },
  { id: 7, cx: 500, cy: 405, r: 8, color: '#9db599', delay: 0.18, tier: 'p' },
  { id: 8, cx: 440, cy: 280, r: 8, color: '#b8860b', delay: 0.12, tier: 'p' },
];

const SECONDARY: N[] = [
  { id:  9, cx: 330, cy: 100, r: 5, color: '#8b7355', delay: 0.38, tier: 's' },
  { id: 10, cx: 565, cy:  52, r: 4, color: '#9a9a9a', delay: 0.42, tier: 's' },
  { id: 11, cx: 835, cy:  52, r: 4, color: '#9a9a9a', delay: 0.42, tier: 's' },
  { id: 12, cx:1070, cy: 100, r: 5, color: '#8b7355', delay: 0.38, tier: 's' },
  { id: 13, cx:1160, cy: 222, r: 4, color: '#5c5c5c', delay: 0.46, tier: 's' },
  { id: 14, cx:1160, cy: 348, r: 4, color: '#5c5c5c', delay: 0.46, tier: 's' },
  { id: 15, cx:1070, cy: 468, r: 4, color: '#8b7355', delay: 0.38, tier: 's' },
  { id: 16, cx: 835, cy: 516, r: 4, color: '#9a9a9a', delay: 0.42, tier: 's' },
  { id: 17, cx: 565, cy: 516, r: 4, color: '#9a9a9a', delay: 0.42, tier: 's' },
  { id: 18, cx: 330, cy: 468, r: 4, color: '#8b7355', delay: 0.38, tier: 's' },
  { id: 19, cx: 240, cy: 348, r: 4, color: '#5c5c5c', delay: 0.46, tier: 's' },
  { id: 20, cx: 240, cy: 222, r: 4, color: '#5c5c5c', delay: 0.46, tier: 's' },
];

const ALL_NODES = [HUB, ...PRIMARY, ...SECONDARY];
const getN = (id: number) => ALL_NODES.find(n => n.id === id)!;

const EDGE_DATA: Array<[number, number, number, number]> = [
  [0,1,0.10,0.7],[0,2,0.14,0.7],[0,3,0.18,0.7],[0,4,0.22,0.7],
  [0,5,0.18,0.7],[0,6,0.22,0.7],[0,7,0.14,0.7],[0,8,0.10,0.7],
  [1,2,0.30,0.4],[2,3,0.33,0.4],[3,4,0.36,0.4],[4,5,0.39,0.4],
  [5,6,0.36,0.4],[6,7,0.33,0.4],[7,8,0.30,0.4],[8,1,0.27,0.4],
  [1,9,0.44,0.25],[1,20,0.44,0.25],[2,10,0.46,0.25],[2,11,0.46,0.25],
  [3,12,0.48,0.25],[3,13,0.48,0.25],[4,13,0.50,0.2],[4,14,0.50,0.2],
  [5,14,0.48,0.25],[5,15,0.48,0.25],[6,16,0.46,0.25],[6,17,0.46,0.25],
  [7,18,0.44,0.25],[7,19,0.44,0.25],[8,19,0.42,0.2],[8,20,0.42,0.2],
  [9,10,0.56,0.15],[10,11,0.58,0.15],[11,12,0.60,0.15],[12,13,0.62,0.12],
  [13,14,0.64,0.12],[14,15,0.62,0.12],[15,16,0.60,0.15],[16,17,0.58,0.15],
  [17,18,0.56,0.15],[18,19,0.54,0.12],[19,20,0.52,0.12],[20,9,0.54,0.12],
];

export default function HeroVisual() {
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'],
  });
  const y       = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scale    = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <motion.div
      ref={wrapRef}
      style={{ y, opacity, scale }}
      className="w-full select-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1400 568"
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="hub-glow-light" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="node-glow-light" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="hub-fill-light" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#b8860b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#b8860b" stopOpacity="0.03" />
          </radialGradient>
          <radialGradient id="hub-outer-light" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#b8860b" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#b8860b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow behind hub */}
        <circle cx={700} cy={280} r={120} fill="url(#hub-outer-light)" />
        <circle cx={700} cy={280} r={60}  fill="url(#hub-fill-light)" />

        {/* Edges */}
        {EDGE_DATA.map(([fromId, toId, delay, opacMax], i) => {
          const a = getN(fromId);
          const b = getN(toId);
          const isHub = fromId === 0 || toId === 0;
          return (
            <motion.line
              key={i}
              x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
              stroke={isHub ? '#b8860b' : fromId <= 8 ? '#9a9a9a' : '#d1d5db'}
              strokeWidth={isHub ? 0.9 : 0.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: opacMax }}
              transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}

        {/* Secondary nodes */}
        {SECONDARY.map((n) => (
          <motion.g
            key={n.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 16, delay: n.delay }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          >
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={`${n.color}15`} stroke={n.color} strokeWidth="0.8" strokeOpacity={0.5} />
          </motion.g>
        ))}

        {/* Primary nodes */}
        {PRIMARY.map((n) => (
          <motion.g
            key={n.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: n.delay }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          >
            <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="none" stroke={n.color} strokeWidth="0.5" strokeOpacity={0.2} />
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={`${n.color}18`} stroke={n.color} strokeWidth="1.2" filter="url(#node-glow-light)" />
            <circle cx={n.cx} cy={n.cy} r={2.5} fill={n.color} fillOpacity={0.8} />
          </motion.g>
        ))}

        {/* Hub */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0 }}
          style={{ transformOrigin: `700px 280px` }}
        >
          <motion.circle
            cx={700} cy={280} r={HUB.r + 10}
            fill="none" stroke="#b8860b" strokeWidth="1"
            animate={{ r: [HUB.r + 10, HUB.r + 28, HUB.r + 10], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={700} cy={280} r={HUB.r + 10}
            fill="none" stroke="#b8860b" strokeWidth="0.6"
            animate={{ r: [HUB.r + 10, HUB.r + 22, HUB.r + 10], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <circle cx={700} cy={280} r={HUB.r} fill="url(#hub-fill-light)" stroke="#b8860b" strokeWidth="1.8" filter="url(#hub-glow-light)" />
          <circle cx={700} cy={280} r={5} fill="#b8860b" fillOpacity={0.9} />
        </motion.g>

        {/* Floating labels */}
        {[
          { cx: 500, cy: 155, label: 'Articles', x: -52 },
          { cx: 700, cy: 108, label: 'Search',    y: -18 },
          { cx: 900, cy: 155, label: 'Videos',    x: 16 },
          { cx: 960, cy: 280, label: 'Clusters',  x: 16 },
          { cx: 900, cy: 405, label: 'Graph',     x: 16 },
          { cx: 700, cy: 452, label: 'Resurface', y: 18 },
          { cx: 500, cy: 405, label: 'Tags',      x: -44 },
          { cx: 440, cy: 280, label: 'PDFs',      x: -44 },
        ].map(({ cx, cy, label, x, y: ly }) => (
          <motion.text
            key={label}
            x={cx + (x ?? 0)}
            y={cy + (ly ?? 0) - 18}
            textAnchor="middle"
            fontSize="11"
            fill="#8a8a8a"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.05em"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {label}
          </motion.text>
        ))}
      </svg>
    </motion.div>
  );
}
