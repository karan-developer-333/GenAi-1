'use client';

import { motion } from 'framer-motion';
import { Search, FolderOpen, Sparkles, Download } from 'lucide-react';

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
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative w-24 h-24 rounded-3xl bg-card border border-border flex items-center justify-center shadow-xl overflow-hidden">
          {hasSearchQuery ? (
            <Search className="w-10 h-10 text-accent" />
          ) : (
            <FolderOpen className="w-10 h-10 text-accent" />
          )}
        </div>
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 p-2 rounded-xl bg-primary text-white shadow-lg border border-white/10"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </div>

      {hasSearchQuery ? (
        <>
          <h3 className="text-h3 text-foreground mb-3">
            No results found
          </h3>
          <p className="text-body text-muted-foreground max-w-sm mb-8">
            We couldn&apos;t find anything matching your search. Try different keywords or check your spelling.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
          >
            Clear Search
          </button>
        </>
      ) : (
        <>
          <h3 className="text-h3 text-foreground mb-3">
            Your library is empty
          </h3>
          <p className="text-body text-muted-foreground max-w-sm mb-8">
            Start saving articles, videos, and more. Your saved content will appear here and be automatically organized.
          </p>
          <div className="flex items-center gap-4">
            <a href="/setup" className="btn btn-primary">
              <Download className="w-4 h-4" />
              Get Browser Extension
            </a>
          </div>
        </>
      )}
    </motion.div>
  );
}
