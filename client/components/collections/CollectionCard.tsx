'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';
import { GoArrowUpRight } from 'react-icons/go';
import { Trash2, ExternalLink, Play, FileText } from 'lucide-react';

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
        'group relative cursor-pointer overflow-hidden rounded-2xl flex flex-col min-h-[400px] max-h-[400px]',
        'bg-[#09153C]/40 backdrop-blur-md border border-[#539AE9]/10',
        'transition-all duration-500 ease-out',
        'hover:border-[#539AE9]/30 hover:shadow-[0_8px_32px_rgba(83,154,233,0.1)]',
        'hover:-translate-y-2'
      )}
      whileHover={{ y: -8 }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-[80px] rounded-full bg-[#2655C7] group-hover:opacity-20 transition-opacity duration-700" />

      {/* Image Section */}
      <div className="relative h-44 overflow-hidden bg-[#010419]/50">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAlt || item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#09153C] to-[#010419]">
             <FileText className="w-10 h-10 text-[#4B6C8F]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#010419]/60 to-transparent" />
        
        {/* Source Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-tiny font-bold uppercase tracking-widest bg-[#2655C7] text-white border border-white/10 shadow-lg">
            {item.type}
          </span>
        </div>

        {/* Delete Button */}
        <motion.button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-4 right-4 opacity-100 md:opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/20 md:bg-white/10 backdrop-blur-md text-red-400 hover:text-red-500 hover:bg-white/20 transition-all border border-white/10 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="relative z-10 flex flex-col flex-grow p-5">
        {/* TITLE */}
        <h3 className="text-h4 text-white mb-2 group-hover:text-[#539AE9] transition-colors duration-300 line-clamp-2">
          {item.title}
        </h3>

        {/* DESCRIPTION */}
        {item.text && (
          <p className="text-body-sm text-[#A8B3CF] mb-4 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
            {item.text}
          </p>
        )}

        {/* TAGS */}
        {item.tags && (
          <div className="flex flex-wrap gap-2 mb-4 overflow-hidden">
            {item.tags.split(" ").slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-full text-tiny font-bold uppercase tracking-wider glass-tag"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="pt-4 mt-auto border-t border-[#539AE9]/10 flex items-center justify-between text-tiny tracking-wide text-[#4B6C8F]">
          <div className="flex items-center gap-2 truncate">
            <div className="w-1.5 h-1.5 rounded-full bg-[#539AE9] shadow-[0_0_8px_rgba(83,154,233,0.8)]" />
            <span className="truncate">{formattedDate}</span>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-[#539AE9] bg-[#539AE9]/10 md:bg-transparent px-3 py-1.5 md:p-0 rounded-lg md:rounded-none md:hover:text-white transition-all hover:translate-x-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            OPEN
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hover accent glow line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#539AE9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
