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
      <motion.div
        className={cn(
          'relative flex items-center',
          'px-6 py-4 rounded-3xl',
          'bg-[#09153C]/40 backdrop-blur-xl border border-[#539AE9]/15',
          'focus-within:border-[#539AE9]/40',
          'focus-within:shadow-[0_0_30px_rgba(83,154,233,0.1)]',
          'transition-all duration-300 ease-out'
        )}
      >
        <Search className="w-5 h-5 text-[#4B6C8F] mr-4 flex-shrink-0 transition-colors group-focus-within:text-[#539AE9]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Traverse neural clusters..."
          className={cn(
            'flex-1 bg-transparent outline-none',
            'text-white placeholder-[#4B6C8F]',
            'text-base font-medium'
          )}
        />
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="ml-2 p-1.5 rounded-xl hover:bg-white/10 text-[#4B6C8F] hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
      
      {/* Subtle bottom glow line */}
      <div className={cn(
        "absolute -bottom-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#539AE9]/30 to-transparent transition-opacity duration-500",
        value ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
}
