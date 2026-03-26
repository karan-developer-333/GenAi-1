'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export default function EmptyState({ hasSearchQuery }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center">
          {hasSearchQuery ? (
            <svg className="w-12 h-12 text-[var(--amber-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-[var(--amber-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          )}
        </div>
        <div className="absolute -inset-4 bg-[var(--amber-primary)]/5 rounded-full blur-2xl" />
      </div>

      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {hasSearchQuery ? 'No matching items' : 'No items saved yet'}
      </h3>
      <p className="text-[var(--text-muted)] text-center max-w-sm mb-6">
        {hasSearchQuery
          ? "We couldn't find any items matching your search. Try a different term."
          : "Your saved knowledge will appear here once you start capturing articles and insights."}
      </p>
    </motion.div>
  );
}
