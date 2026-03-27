import { useState, useCallback, useEffect } from 'react';
import { fetchItems, removeItem, searchItems } from "@/services/client/ItemService";
import { useAuth } from '@clerk/nextjs';

export interface Item {
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

export const useCollections = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getItems = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchItems();
      setItems(res.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await removeItem(id);
      setItems(prev => prev.filter(item => item._id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
      return false;
    }
  }, []);

  const queryItems = useCallback(async (query: string) => {
    if (!query.trim()) {
      await getItems();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await searchItems(query);
      setItems(res.items || []);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [getItems]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getItems();
    }
  }, [isLoaded, isSignedIn, getItems]);

  return {
    items,
    isLoading,
    error,
    refresh: getItems,
    deleteItem,
    queryItems,
  };
};