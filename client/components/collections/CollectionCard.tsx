'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';
import { GoArrowUpRight } from 'react-icons/go';

interface Item {
  _id: string;
  type: string;
  sourceType: string;
  url: string;
  title: string;
  text: string;
  tags?: string;
  imageUrl?: string;
  imageAlt?: string;
  timestamp: string;
}

interface CollectionCardProps {
  item: Item;
  onClick: () => void;
  onDelete: () => void;
}

export default function CollectionCard({ item, onClick, onDelete }: CollectionCardProps) {
  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const embedUrl = item.url.includes("youtube") ? getYoutubeEmbedUrl(item.url) : "";

  const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl flex flex-col min-h-110 max-h-110',
        'bg-white border border-[var(--border-light)]',
        'transition-all duration-300 ease-[var(--ease-smooth)]',
        'hover:border-[var(--border-warm)] hover:shadow-xl',
        'hover:-translate-y-1'
      )}
      whileHover={{ y: -4 }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl rounded-full bg-[var(--amber-primary)] group-hover:opacity-10 transition-opacity" />

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-[var(--bg-base)]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAlt || item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--bg-base)] to-[var(--border-light)]">
             <span className="text-4xl">📄</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Source Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[var(--text-primary)] border border-white/20 shadow-sm">
            {item.type}
          </span>
        </div>

        {/* Delete Button */}
        <motion.button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-white/90 backdrop-blur-md text-red-500/70 hover:text-red-500 hover:bg-white transition-all shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.button>
      </div>

      <div className="relative z-10 flex flex-col h-62 justify-evenly p-4 sm:p-5 lg:p-6">

  {/* TITLE */}
  <h3
    className="
      text-base sm:text-lg lg:text-xl
      font-bold
      text-[var(--text-primary)]
      mb-2
      group-hover:text-[var(--amber-primary)]
      transition-colors
      line-clamp-2
      leading-snug
    "
  >
    {item.title}
  </h3>

  {/* DESCRIPTION */}
  {item.text && (
    <p
      className="
        text-xs sm:text-sm
        text-[var(--text-muted)]
        mb-3 sm:mb-4
        line-clamp-3 sm:line-clamp-2
        leading-relaxed
      "
    >
      {item.text}
    </p>
  )}

  {/* TAGS */}
  {item.tags && (
    <div
      className="
        flex flex-wrap
        gap-1.5 sm:gap-2
        mb-3
        max-h-[68px]
        overflow-hidden
      "
    >
      {item.tags.split(" ").map((tag: string, index: number) => (
        <span
          key={index}
          className="
            px-2 py-[3px]
            rounded-full
            text-[9px] sm:text-[10px]
            font-bold
            uppercase
            tracking-wider
            bg-white/90
            text-[var(--text-primary)]
            border border-white/20
            shadow-sm
            whitespace-nowrap
          "
        >
          {tag}
        </span>
      ))}
    </div>
  )}

  {/* FOOTER */}
  <div
    className="
      pt-3 sm:pt-4
      mt-auto
      b-2
      relative
      border-t border-[var(--border-light)]
      flex items-center justify-between
      text-[10px] sm:text-[11px]
      font-medium
      tracking-wide uppercase
      text-[var(--text-muted)]
      gap-2
      flex-wrap
    "
  >
    <div className="flex items-center gap-2 min-w-0">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber-primary)] shrink-0" />
      <span className="truncate">{formattedDate}</span>
    </div>

    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center gap-1.5
        font-bold
        text-[var(--text-secondary)]
        hover:text-[var(--amber-primary)]
        transition-colors
        shrink-0
      "
    >
      VISIT
      <span className="text-lg">
        <GoArrowUpRight />
      </span>
    </a>
  </div>

</div>

      {/* Hover accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--amber-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
