'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';
import { Trash2, ExternalLink, FileText } from 'lucide-react';

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
        'group relative cursor-pointer overflow-hidden rounded-2xl flex flex-col min-h-[380px]',
        'card card-hover'
      )}
      whileHover={{ y: -4 }}
    >
      {/* Image Section */}
      <div className="relative h-44 overflow-hidden bg-muted shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAlt || item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-background">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="badge badge-primary text-xs">
            {item.type}
          </span>
        </div>

        {/* Delete Button */}
        <motion.button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-4 right-4 opacity-0 md:opacity-0 group-hover:md:opacity-100 p-2 rounded-lg bg-muted/80 backdrop-blur-sm text-destructive hover:bg-destructive/10 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-h5 text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        {item.text && (
          <p className="text-body-sm text-muted-foreground mb-4 line-clamp-2">
            {item.text}
          </p>
        )}

        {/* Tags */}
        {item.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.split(" ").slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="glass-tag px-2.5 py-1 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {formattedDate}
          </span>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Open
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
