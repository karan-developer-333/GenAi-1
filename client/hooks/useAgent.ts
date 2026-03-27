import { useState, useCallback, useRef, useEffect } from 'react';
import { sendMessage, AgentResponse } from '@/services/client/AgentService';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    knowledge: { title: string; url: string }[];
    web: { title: string; url: string }[];
  };
}

export const useAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Agent chat error:', error);
      // Optional: Add error handling logic here
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    scrollRef,
    handleSendMessage,
    clearMessages,
  };
};
