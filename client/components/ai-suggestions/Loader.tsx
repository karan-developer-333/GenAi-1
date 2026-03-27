'use client';

import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#010419] z-50">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-600/5 opacity-30 pointer-events-none" />
      
      {/* Animated Rings */}
      <div className="relative w-28 h-28 mb-10">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
            borderRadius: ["30%", "50%", "30%"],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute inset-0 border-2 border-[#539AE9] opacity-20 shadow-[0_0_20px_rgba(83,154,233,0.3)]"
        />
        <motion.div
          animate={{
            scale: [1.15, 1, 1.15],
            rotate: [360, 180, 0],
            borderRadius: ["50%", "30%", "50%"],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute inset-4 border-2 border-[#2655C7] opacity-40 shadow-[0_0_15px_rgba(38,85,199,0.2)]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 bg-[#539AE9] rounded-full shadow-[0_0_15px_rgba(83,154,233,1)]"
          />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-3 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white tracking-widest uppercase"
        >
          Analyzing <span className="text-[#539AE9]">Neural</span> Saves
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#A8B3CF] text-xs font-bold tracking-[0.2em] uppercase opacity-70"
        >
          Categorizing knowledge clusters...
        </motion.p>
      </div>
    </div>
  );
}
