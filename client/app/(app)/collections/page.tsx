'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';
import CollectionCard from '@/components/collections/CollectionCard';
import SearchBar from '@/components/collections/SearchBar';
import EmptyState from '@/components/collections/EmptyState';
import { useState, useEffect } from 'react';
import { useCollections, Item } from '@/hooks/useCollections';
import { BookOpen, Loader2, X, ExternalLink, Globe } from 'lucide-react';

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
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-2">
              <div className="badge badge-primary">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Your Library</span>
              </div>
              <h1 className="text-h1 text-foreground">
                All <span className="text-accent">Saves</span>
              </h1>
              <p className="text-body text-muted-foreground mt-2">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your knowledge base
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-10"
        >
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </motion.div>

        {/* Content */}
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
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <div className="absolute inset-0 bg-accent/20 blur-xl animate-pulse" />
              </div>
              <p className="text-label text-muted-foreground">Loading your saves...</p>
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
            <StaggerReveal key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-5xl h-[85vh] bg-card border border-border rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-muted/80 text-foreground hover:bg-muted transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Left side: Media */}
                <div className="relative w-full md:w-[55%] h-[35vh] md:h-full bg-muted shrink-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
                  {(() => {
                    const getYoutubeEmbedUrl = (url: string) => {
                      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                      const match = url.match(regExp);
                      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
                    };
                    const embedUrl = selectedItem.url.includes("youtube") ? getYoutubeEmbedUrl(selectedItem.url) : "";
                    const isPdf = selectedItem.url?.toLowerCase().includes(".pdf");
                    const isExternalWebsite = selectedItem.url && !selectedItem.imageUrl && !embedUrl && !isPdf;
                    
                    if (selectedItem.imageUrl) {
                      return <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-contain" />;
                    } else if (embedUrl) {
                      return <iframe src={embedUrl} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
                    } else if (isPdf) {
                      const pdfUrl = encodeURIComponent(selectedItem.url);
                      return <iframe src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`} className="w-full h-full border-0 bg-background" title="PDF Preview" loading="lazy" />;
                    } else if (isExternalWebsite) {
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6">
                          <Globe className="w-16 h-16 text-muted-foreground" />
                          <p className="text-muted-foreground text-center">Preview not available</p>
                          <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            <ExternalLink className="w-4 h-4" />
                            Open in New Tab
                          </a>
                        </div>
                      );
                    } else {
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                          <BookOpen className="w-16 h-16 text-muted-foreground" />
                          <p className="text-label text-muted-foreground">No preview available</p>
                        </div>
                      );
                    }
                  })()}
                </div>
                
                {/* Right side: Content */}
                <div className="p-6 md:p-8 overflow-y-auto w-full md:w-[45%] flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="badge badge-primary">
                      {selectedItem.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedItem.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 className="text-h2 text-foreground mb-4">
                    {selectedItem.title}
                  </h2>
                  
                  {selectedItem.text && (
                    <div className="mb-6">
                      <h4 className="text-label text-accent mb-2">Extracted Content</h4>
                      <p className="text-body text-muted-foreground whitespace-pre-wrap">
                        {selectedItem.text}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-6">
                    {selectedItem.tags && (
                      <div className="mb-6">
                        <h4 className="text-label text-muted-foreground mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.tags.split(" ").map((tag: string, index: number) => (
                            <span key={index} className="badge badge-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center">
                      <ExternalLink className="w-4 h-4" />
                      Open Original
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
