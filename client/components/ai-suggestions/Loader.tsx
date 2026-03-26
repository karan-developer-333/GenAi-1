'use client';

import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center  bg-[var(--bg-cream)] z-10">
      {/* Animated Rings */}
      <div className="relative w-24 h-24 mb-8">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ["20%", "50%", "20%"],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute inset-0 border-2 border-[var(--amber-primary)] opacity-20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            borderRadius: ["50%", "20%", "50%"],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute inset-2 border-2 border-[var(--amber-light)] opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 bg-[var(--amber-primary)] rounded-full glow-amber"
          />
        </div>
      </div>

      {/* Text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gradient tracking-tight"
      >
        Analising your saves
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-[var(--text-secondary)] text-sm font-medium"
      >
        Our AI is categorizing your knowledge...
      </motion.p>
    </div>
  );
}
