'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div
        className={cn(
          'relative flex items-center',
          'px-6 py-4 rounded-2xl',
          'bg-card/50 backdrop-blur-xl border border-border',
          'focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/10',
          'transition-all duration-300'
        )}
      >
        <Search className="w-5 h-5 text-muted-foreground mr-4 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search your saves..."
          className={cn(
            'flex-1 bg-transparent outline-none',
            'text-foreground placeholder:text-muted-foreground',
            'text-base font-normal'
          )}
        />
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="ml-2 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
