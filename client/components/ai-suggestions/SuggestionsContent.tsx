'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Sparkles, Hash, Zap, Copy, Check, ExternalLink } from 'lucide-react';

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
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    const isCopyAction = (e.target as HTMLElement).closest('.copy-trigger');
    if (isCopyAction) {
      handleCopy(tag);
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(tag)}`, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-24 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20  relative z-10"
      >
        <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight text-white mb-8">
          Tag <span className="text-[#539AE9]">Suggestions</span>
        </h1>

        
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
        {/* Left Section: Unique Tags */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="group relative bg-[#09153C]/40 backdrop-blur-xl border border-[#539AE9]/10 rounded-[40px] p-12 overflow-hidden transition-all hover:border-[#539AE9]/30 h-full flex flex-col"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#153081,transparent)] opacity-[0.05] pointer-events-none" />
          
          <div className="absolute top-8 right-8 text-[#539AE9] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Hash size={120} />
          </div>

          <div className="flex items-center gap-5 mb-12 relative">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Your Saves</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 relative">
            {originalTags.length > 0 ? (
              originalTags.map((tag) => (
                <motion.button
                  key={tag}
                  variants={itemVariants}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => handleTagClick(tag, e)}
                  className="group/tag relative flex items-center gap-3 px-4 py-2 text-[13px] font-bold rounded-lg bg-[#010419]/40 text-blue-100 border border-[#539AE9]/15 hover:border-[#539AE9]/50 hover:bg-[#09153C]/60 hover:shadow-[0_8px_32px_rgba(83,154,233,0.1)] transition-all cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10">{tag}</span>
                  <ExternalLink className="relative z-10 w-4 h-4 opacity-40 group-hover/tag:opacity-100 transition-all group-hover/tag:translate-x-0.5" />
                </motion.button>
              ))
            ) : (
              <div className="w-full py-20 text-center border-2 border-dashed border-[#539AE9]/10 rounded-[32px] bg-[#010419]/20">
                <p className="text-[#4B6C8F] font-bold uppercase tracking-widest text-xs">
                  No core clusters established
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-12 pt-10 border-t border-[#539AE9]/10 flex justify-between items-center relative">
            <span className="text-[10px] text-[#4B6C8F] font-black uppercase tracking-[0.2em]">Top tags</span>
            <span className="text-[#539AE9] bg-[#539AE9]/5 px-3 py-1 rounded-lg border border-[#539AE9]/10 text-xs font-bold">{originalTags.length}</span>
          </div>
        </motion.div>

        {/* Right Section: AI Suggested Tags */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="group relative bg-[#09153C]/40 backdrop-blur-xl border border-[#539AE9]/20 rounded-[40px] p-12 overflow-hidden transition-all hover:border-[#539AE9]/40 shadow-2xl h-full flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#539AE9]/5 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
          
          <div className="flex items-center gap-5 mb-12 relative">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#153081] to-[#2655C7] flex items-center justify-center shadow-xl shadow-blue-900/30 border border-white/10">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Ai Suggested Tags</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 relative ">
            {aiSuggestedTags.length > 0 ? (
              aiSuggestedTags.map((tag) => (
                <motion.button
                  key={tag}
                  variants={itemVariants}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => handleTagClick(tag, e)}
                  className="group/tag relative flex items-center gap-3 px-4 py-2 text-[13px] font-bold rounded-lg bg-gradient-to-br from-[#153081] to-[#2655C7] text-white border border-white/10 shadow-lg shadow-blue-900/20 hover:shadow-[#539AE9]/30 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/tag:animate-shimmer" />
                  <span className="relative z-10">{tag}</span>
                  
                  <div className="relative z-10 flex items-center gap-2 ml-2 border-l border-white/20 pl-2">
                    <div 
                      className="copy-trigger p-1 hover:bg-white/20 rounded-lg transition-colors"
                      title="Copy neural node"
                    >
                      {copiedTag === tag ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white/70" />}
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-[#539AE9]/20 rounded-[32px] bg-[#09153C]/40">
                <div className="w-12 h-12 border-4 border-[#539AE9] border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(83,154,233,0.5)]" />
                <p className="text-[#539AE9] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning Matrix</p>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
