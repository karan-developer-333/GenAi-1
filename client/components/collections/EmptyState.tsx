'use client';

import { motion } from 'framer-motion';
import { Search, FolderOpen, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export default function EmptyState({ hasSearchQuery }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-32 px-4 text-center"
    >
      <div className="relative mb-10 group">
        <div className="absolute inset-0 bg-[#539AE9]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-24 h-24 rounded-[32px] bg-[#09153C]/60 backdrop-blur-xl border border-[#539AE9]/20 flex items-center justify-center shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#153081]/20 to-transparent" />
          {hasSearchQuery ? (
            <Search className="w-10 h-10 text-[#539AE9] relative z-10" />
          ) : (
            <FolderOpen className="w-10 h-10 text-[#539AE9] relative z-10" />
          )}
        </div>
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 p-1.5 rounded-lg bg-[#2655C7] text-white shadow-lg border border-white/10"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
        {hasSearchQuery ? 'Zero Nodes Replicated' : 'Void Detected in Library'}
      </h3>
      <p className="text-[#A8B3CF] text-center max-w-sm mb-8 font-medium leading-relaxed">
        {hasSearchQuery
          ? "No data clusters match your current query parameters. Try widening your search horizon."
          : "Your neural workspace is currently offline. Synchronize your first knowledge node to begin expansion."}
      </p>

      {hasSearchQuery && (
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-2xl bg-[#539AE9]/10 text-[#539AE9] border border-[#539AE9]/20 font-bold text-sm hover:bg-[#539AE9]/20 transition-all active:scale-95"
        >
          Reset Signal
        </button>
      )}
    </motion.div>
  );
}
