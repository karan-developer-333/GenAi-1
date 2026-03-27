import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getAllTags, getSuggestions } from '@/services/client/AiSuggestionService';

export const useAiSuggestions = () => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [initialTags, setInitialTags] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!authLoaded || !isSignedIn) return;
    try {
      setIsLoading(true);
      
      // 1. Fetch Unique Tags
      const tags = await getAllTags();
      
      if (Array.isArray(tags)) {
        setInitialTags(tags);
        
        // 2. Fetch AI Suggestions using the tags
        if (tags.length > 0) {
          const suggestions = await getSuggestions(tags);
          setAiSuggestions(suggestions || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch AI suggestions data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [authLoaded, isSignedIn]);

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      fetchData();
    }
  }, [authLoaded, isSignedIn, fetchData]);

  return {
    initialTags,
    aiSuggestions,
    isLoading,
    refresh: fetchData,
  };
};
