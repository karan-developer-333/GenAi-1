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

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      if (!res.ok) throw new Error('Failed to connect to agent');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        setIsLoading(false); // Stop main loader, stream starts

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const events = chunkStr.split('\n\n');

          for (const ev of events) {
            if (ev.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(ev.slice(6));
                if (parsed.type === 'sources') {
                  setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, sources: parsed.data } : m));
                } else if (parsed.type === 'chunk') {
                  setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: m.content + parsed.data } : m));
                } else if (parsed.type === 'error') {
                  console.error("Stream reported error:", parsed.error);
                }
              } catch (e) {
                // Ignore incomplete JSON chunks (very rare with \n\n split, but safe)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Agent chat error:', error);
      setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: "Sorry, I encountered an error processing your request." } : m));
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
