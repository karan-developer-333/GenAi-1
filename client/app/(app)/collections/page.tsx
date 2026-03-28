'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';
import CollectionCard from '@/components/collections/CollectionCard';
import SearchBar from '@/components/collections/SearchBar';
import EmptyState from '@/components/collections/EmptyState';
import { useState, useEffect } from 'react';
import { useCollections, Item } from '@/hooks/useCollections';
import { BookOpen, Search, Filter, Sparkles, Loader2, X, ExternalLink, Globe } from 'lucide-react';

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
          className="mb-2"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#539AE9]/5 border border-[#539AE9]/20 text-[#539AE9] text-tiny font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md">
                <BookOpen className="w-3.5 h-3.5" />
                All Saves
              </div>
              <h1 className="text-h1 text-white">
                Knowledge <span className="text-[#539AE9]">Base</span>
              </h1>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative group max-w-2xl">
            <div className="absolute inset-0 bg-blue-600/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <p className="text-[#4B6C8F] font-bold uppercase tracking-[0.2em] text-tiny">Accessing Data Clusters...</p>
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

        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-6xl h-[90vh] md:h-[75vh] bg-[#09153C] border border-[#539AE9]/30 rounded-[1.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#2655C7]/20"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md"
                >
                  <X className="w-6 h-6" />
                </button>
                
                {/* Left side: Media (Image or iframe) */}
                <div className="relative w-full md:w-[55%] h-[40vh] md:h-full bg-black shrink-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#539AE9]/20">
                  {(() => {
                    const getYoutubeEmbedUrl = (url: string) => {
                      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                      const match = url.match(regExp);
                      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
                    };
                    const embedUrl = selectedItem.url.includes("youtube") ? getYoutubeEmbedUrl(selectedItem.url) : "";
                    const isPdf = selectedItem.url?.toLowerCase().includes(".pdf");
                    
                    const isExternalWebsite = selectedItem.url && 
                      !selectedItem.imageUrl && 
                      !embedUrl && 
                      !isPdf &&
                      (selectedItem.url.startsWith('http://') || selectedItem.url.startsWith('https://'));
                    
                    if (selectedItem.imageUrl) {
                      return <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-contain" />;
                    } else if (embedUrl) {
                      return <iframe src={embedUrl} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
                    } else if (isPdf) {
                      const pdfUrl = encodeURIComponent(selectedItem.url);
                      return <iframe src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`} className="w-full h-full border-0 bg-white" title="PDF Preview" loading="lazy" />;
                    } else if (isExternalWebsite) {
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#09153C] to-[#010419] gap-6 p-6">
                          <Globe className="w-20 h-20 text-[#4B6C8F]" />
                          <p className="text-[#4B6C8F] text-center text-sm">This website cannot be previewed in iframe</p>
                          <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#2655C7] text-white rounded-lg font-medium flex items-center gap-2 hover:bg-[#1a3fa0] transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            Open in New Tab
                          </a>
                        </div>
                      );
                    } else {
                      return <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#09153C] to-[#010419] gap-4"><BookOpen className="w-20 h-20 text-[#4B6C8F]" /><p className="text-[#4B6C8F] font-bold tracking-widest uppercase text-xs">No media preview</p></div>;
                    }
                  })()}
                </div>
                
                {/* Right side: Content */}
                <div className="p-5 md:p-6 overflow-y-auto w-full md:w-[45%] flex flex-col bg-gradient-to-b from-[#09153C] to-[#010419]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full text-tiny font-bold uppercase tracking-widest bg-[#2655C7] text-white shadow-[#2655C7]/20 shadow-lg border border-white/10">
                      {selectedItem.type}
                    </span>
                    <span className="text-tiny text-[#4B6C8F] font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#539AE9] opacity-70" />
                      {new Date(selectedItem.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 className="text-h2 text-white mb-4">
                    {selectedItem.title}
                  </h2>
                  
                  {selectedItem.text && (
                    <div className="mb-8">
                      <h4 className="text-tiny text-[#539AE9] font-black uppercase tracking-[0.2em] mb-2">Extracted Content</h4>
                      <p className="text-[#A8B3CF] text-body whitespace-pre-wrap">
                        {selectedItem.text}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-6">
                    {selectedItem.tags && (
                      <div className="mb-6">
                        <h4 className="text-tiny text-[#539AE9] font-black uppercase tracking-[0.2em] mb-3">Associated Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.tags.split(" ").map((tag: string, index: number) => (
                            <span key={index} className="px-3 py-1.5 rounded-lg text-tiny font-bold uppercase tracking-wider bg-[#539AE9]/10 text-[#539AE9] border border-[#539AE9]/20 hover:bg-[#539AE9]/20 transition-colors cursor-default">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#153081] to-[#2655C7] hover:shadow-[#539AE9]/30 hover:scale-[1.02] text-white rounded-xl text-btn transition-all border border-white/10 shadow-xl shadow-blue-900/20">
                      Open Original Source
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
