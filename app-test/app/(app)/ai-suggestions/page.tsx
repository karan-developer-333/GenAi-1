'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Loader from '@/components/ai-suggestions/Loader';
import SuggestionsContent from '@/components/ai-suggestions/SuggestionsContent';
import { getAllTags, getSuggestions } from '@/services/aiSuggestion.service';
import { useAuth } from '@clerk/nextjs';

const Page = () => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [initialTags, setInitialTags] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
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
      // Ensure the loader stays for at least a bit for UX if it's too fast
      // or just set loading false when done.
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      fetchData();
    }
  }, [authLoaded, isSignedIn]);

  return (
    <div className="h-full bg-[var(--bg-cream)] paper-texture relative min-h-[calc(100vh-72px)]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <SuggestionsContent 
            key="content"
            originalTags={initialTags} 
            aiSuggestedTags={aiSuggestions} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;