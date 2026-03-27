'use client';

import { AnimatePresence } from 'framer-motion';
import Loader from '@/components/ai-suggestions/Loader';
import SuggestionsContent from '@/components/ai-suggestions/SuggestionsContent';
import { useAiSuggestions } from '@/hooks/useAiSuggestions';

const Page = () => {
  const { initialTags, aiSuggestions, isLoading } = useAiSuggestions();

  return (
    <div className="h-full bg-background relative min-h-[calc(100vh-72px)] overflow-hidden">
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