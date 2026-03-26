'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HiSparkles, HiHashtag, HiDuplicate, HiCheck } from 'react-icons/hi';
import { FiArrowUpRight, FiZap } from 'react-icons/fi';
import { LuFingerprint, LuCopy } from 'react-icons/lu';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface SuggestionsContentProps {
  originalTags: string[];
  aiSuggestedTags: string[];
}

export default function SuggestionsContent({ originalTags, aiSuggestedTags }: SuggestionsContentProps) {
  const { user } = useUser();
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    // If it's a click on the copy icon area (for AI tags), we handle copy.
    // Otherwise, we search.
    const isCopyAction = (e.target as HTMLElement).closest('.copy-trigger');
    
    if (isCopyAction) {
      handleCopy(tag);
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(tag)}`, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--amber-primary)]/10 border border-[var(--amber-primary)]/20 text-[var(--amber-primary)] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <HiSparkles className="w-3.5 h-3.5" />
          Neural Engine Synced
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gradient mb-6">
          Tag Intelligence
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed mb-10">
          Expanding your digital workspace. We've synthesized these suggestions 
          based on your latest interests and knowledge clusters.
        </p>

        {/* Extension Connectivity Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto p-4 rounded-3xl bg-white/40 backdrop-blur-xl border border-[var(--amber-primary)]/20 shadow-xl shadow-[var(--amber-primary)]/5 flex items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-dark)] flex items-center justify-center text-white shadow-lg">
              <FiZap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">Extension Link</h3>
              <p className="text-xs text-[var(--text-muted)] font-bold">Paste this ID into Extension Settings ⚙️</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-[var(--bg-warm)] p-2 pr-3 rounded-2xl border border-[var(--border-subtle)] group/id cursor-pointer overflow-hidden relative"
               onClick={() => {
                 if (user?.id) {
                   navigator.clipboard.writeText(user.id);
                   setCopiedId(true);
                   setTimeout(() => setCopiedId(false), 2000);
                 }
               }}
          >
            <div className="text-[10px] font-mono font-bold text-[var(--amber-dark)] bg-[var(--amber-primary)]/10 px-2 py-1 rounded-lg">
              {user?.id ? `${user.id.slice(0, 8)}...` : 'Loading...'}
            </div>
            {copiedId ? <HiCheck className="text-[var(--success)] w-4 h-4" /> : <LuCopy className="text-[var(--text-muted)] group-hover/id:text-[var(--amber-primary)] w-4 h-4 transition-colors" />}
            
            {/* Success ripple effect */}
            {copiedId && (
              <motion.div 
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 3, opacity: 0 }}
                className="absolute inset-0 bg-[var(--success)] rounded-full pointer-events-none"
              />
            )}
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Section: Unique Tags */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-warm p-10 border-t-4 border-t-[var(--border-subtle)] relative group h-full overflow-hidden"
        >
           {/* Subtle background pattern for native section */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,var(--bg-base)_0%,transparent_100%)] opacity-40 pointer-events-none" />
          
          <div className="absolute top-6 right-6 text-[var(--text-muted)] opacity-5 group-hover:opacity-10 transition-opacity">
            <HiHashtag size={80} />
          </div>

          <div className="flex items-center gap-4 mb-10 relative">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-warm)] flex items-center justify-center shadow-inner border border-[var(--border-subtle)]">
              <span className="text-2xl">🏷️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Native Workspace</h2>
              <p className="text-sm text-[var(--text-muted)] font-black">Latest Knowledge Identifiers</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 relative min-h-[120px]">
            {originalTags.length > 0 ? (
              originalTags.map((tag) => (
                <motion.button
                  key={tag}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleTagClick(tag, e)}
                  className="group/tag relative flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-light)] text-white border-none shadow-md shadow-[var(--amber-primary)]/20 hover:shadow-xl hover:shadow-[var(--amber-primary)]/40 transition-all cursor-pointer overflow-hidden"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/tag:animate-shimmer" />

                  <span className="relative z-10">{tag}</span>
                   <FiArrowUpRight className="relative z-10 w-3.5 h-3.5 opacity-0 group-hover/tag:opacity-50 transition-all group-hover/tag:translate-x-0.5" />
                </motion.button>
              ))
            ) : (
              <div className="w-full py-16 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-3xl bg-[var(--bg-warm)]/30">
                <p className="text-[var(--text-muted)] italic text-sm font-bold tracking-tight">
                  No active tags detected in recent saves.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-10 pt-8 border-t border-[var(--border-subtle)] space-y-4 relative">
            <div className="flex justify-between items-center text-xs text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">
              <span>Active Clusters</span>
              <span className="text-[var(--text-primary)] bg-[var(--border-subtle)]/30 px-2 py-0.5 rounded-md">{originalTags.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Section: AI Suggested Tags */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-warm p-10 border-t-4 border-t-[var(--amber-primary)] relative overflow-hidden group shadow-warm-lg h-full"
        >
          {/* Animated Glow Overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--amber-light)] opacity-[0.06] blur-[100px] pointer-events-none -mr-48 -mt-48 group-hover:opacity-[0.1] transition-opacity duration-1000" />
          
          <div className="flex items-center gap-4 mb-10 relative">
            <div className="w-14 h-14 rounded-2xl bg-[var(--amber-primary)]/10 flex items-center justify-center shadow-sm border border-[var(--amber-primary)]/10">
              <HiSparkles className="w-7 h-7 text-[var(--amber-primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">AI Expansion</h2>
              <p className="text-sm text-[var(--amber-primary)] font-black">Neural Topic Discovery</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 relative min-h-[120px]">
            {aiSuggestedTags.length > 0 ? (
              aiSuggestedTags.map((tag) => (
                <motion.button
                  key={tag}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleTagClick(tag, e)}
                  className="group/tag relative flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-light)] text-white border-none shadow-md shadow-[var(--amber-primary)]/20 hover:shadow-xl hover:shadow-[var(--amber-primary)]/40 transition-all cursor-pointer overflow-hidden"
                >
                   {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/tag:animate-shimmer" />

                  <span className="relative z-10">{tag}</span>
                  
                  <div className="relative z-10 flex items-center gap-1.5 ml-1">
                    <div 
                      className="copy-trigger p-1 hover:bg-white/20 rounded-md transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedTag === tag ? <HiCheck className="w-4 h-4" /> : <HiDuplicate className="w-4 h-4" />}
                    </div>
                    <FiArrowUpRight className="w-3.5 h-3.5 opacity-50" title="Search on Google" />
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-[var(--amber-primary)]/20 rounded-3xl bg-[var(--amber-primary)]/5">
                <div className="w-10 h-10 border-3 border-[var(--amber-primary)] border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-[var(--text-secondary)] text-sm font-black uppercase tracking-widest animate-pulse">Analyzing Nodes</p>
              </div>
            )}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-[var(--amber-primary)]/10 shadow-inner">
            <h3 className="text-sm font-black text-[var(--amber-dark)] mb-3 flex items-center gap-2 uppercase tracking-wide">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--amber-primary)] animate-pulse" />
              Recall Boost: +38%
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-loose font-bold italic opacity-80">
              Generated by analyzing cross-domain relationships in your library. These tags link previously isolated data points.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


