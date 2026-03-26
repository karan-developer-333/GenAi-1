'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-xl">
      <motion.div
        className={cn(
          'relative flex items-center',
          'px-4 py-3 rounded-2xl',
          'bg-white border border-[var(--border-light)]',
          'focus-within:border-[var(--amber-primary)]',
          'focus-within:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]',
          'transition-all duration-200'
        )}
        animate={{
          boxShadow: value
            ? '0 0 20px rgba(184, 134, 11, 0.1)'
            : '0 0 0px rgba(184, 134, 11, 0)',
        }}
      >
        <svg
          className="w-5 h-5 text-[var(--text-muted)] mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search collections..."
          className={cn(
            'flex-1 bg-transparent outline-none',
            'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
            'text-base'
          )}
        />
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="ml-2 p-1 rounded-lg hover:bg-amber-50 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
