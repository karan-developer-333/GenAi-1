'use client';

import { motion } from 'framer-motion';
import { StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';
import CollectionCard from '@/components/collections/CollectionCard';
import SearchBar from '@/components/collections/SearchBar';
import EmptyState from '@/components/collections/EmptyState';
import { useState, useEffect } from 'react';
import { useItems } from '@/hooks/useItems';

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

export default function CollectionsPage() {
  const { getItems, deleteItem, queryItems } = useItems();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let data;
        if (searchQuery.trim()) {
          data = await queryItems(searchQuery);
        } else {
          data = await getItems();
        }
        setItems(data.items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      setItems(items.filter((item) => item._id !== id));
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-3">
                Saved Knowledge
              </h1>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl">
                Explore your curated library of articles, papers, and insights
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-8"
        >
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--amber-primary)]"></div>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            hasSearchQuery={searchQuery.length > 0}
          />
        ) : (
          <StaggerReveal  className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item: Item) => (
              <StaggerItem key={item._id}>
                <CollectionCard
                  item={item}
                  onClick={() => setSelectedItem(item)}
                  onDelete={() => handleDeleteItem(item._id)}
                />
              </StaggerItem>
            ))}
          </StaggerReveal>
        )}
      </div>
    </div>
  );
}
