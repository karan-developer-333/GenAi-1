'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';
import CollectionCard from '@/components/collections/CollectionCard';
import SearchBar from '@/components/collections/SearchBar';
import EmptyState from '@/components/collections/EmptyState';
import { useState, useEffect } from 'react';
import { useCollections, Item } from '@/hooks/useCollections';
import { BookOpen, Search, Filter, Sparkles, Loader2 } from 'lucide-react';

export default function CollectionsPage() {
  const { items, isLoading, queryItems, deleteItem } = useCollections();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      queryItems(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, queryItems]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#153081]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#539AE9]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#539AE9]/5 border border-[#539AE9]/20 text-[#539AE9] text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md">
                <BookOpen className="w-3.5 h-3.5" />
                Knowledge Matrix
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
                Neural <span className="text-[#539AE9]">Library</span>
              </h1>
              <p className="text-[#A8B3CF] text-lg max-w-2xl font-medium leading-relaxed">
                Seamlessly traverse your curated domain of articles, technical papers, and cross-platform insights synchronized across your neural workspace.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative group max-w-2xl">
            <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 space-y-6"
            >
              <div className="relative">
                <Loader2 className="w-12 h-12 text-[#539AE9] animate-spin" />
                <div className="absolute inset-0 bg-[#539AE9]/20 blur-xl animate-pulse" />
              </div>
              <p className="text-[#4B6C8F] font-bold uppercase tracking-[0.2em] text-xs">Accessing Data Clusters...</p>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EmptyState hasSearchQuery={searchQuery.length > 0} />
            </motion.div>
          ) : (
            <StaggerReveal key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item: Item) => (
                <StaggerItem key={item._id}>
                  <CollectionCard
                    item={item}
                    onClick={() => setSelectedItem(item)}
                    onDelete={() => deleteItem(item._id)}
                  />
                </StaggerItem>
              ))}
            </StaggerReveal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
