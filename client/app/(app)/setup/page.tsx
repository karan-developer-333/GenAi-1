'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { PuzzleIcon } from 'lucide-react';

export default function SetupPage() {
  const steps = [
    { id: 1, src: '/setup/1.png' },
    { id: 2, src: '/setup/2.png' },
    { id: 3, src: '/setup/3.png' },
    { id: 4, src: '/setup/4.png' },
  ];

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/60 border border-accent/20 text-accent shadow-2xl backdrop-blur-md mb-6 relative group">
            <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <PuzzleIcon className="w-8 h-8 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Extension Setup Guide
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
            Follow these steps to configure your browser extension and connect it to your neural sync network.
          </p>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.2 }}
              className="group relative bg-card backdrop-blur-xl border border-border rounded-[2rem] p-4 md:p-8 overflow-hidden transition-all hover:border-accent/40 hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#539AE9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute top-8 left-8 w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-xl shadow-lg z-20 backdrop-blur-md">
                {step.id}
              </div>

              <div className="relative rounded-[1.5rem] overflow-hidden border border-border bg-card flex items-center justify-center min-h-[300px]">
                <Image
                  src={step.src}
                  alt={`Setup Step ${step.id}`}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain rounded-[1.5rem]"
                  priority={step.id <= 2}
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Setup Complete? You are ready to start capturing knowledge.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
