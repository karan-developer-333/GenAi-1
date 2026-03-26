'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiArrowRight, HiOutlineGlobeAlt, HiOutlineLightBulb, HiOutlineBookOpen } from 'react-icons/hi2';
import { FiCpu, FiUser } from 'react-icons/fi';
import { AgentResponse, sendMessage } from '@/services/AgentService';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    knowledge: { title: string; url: string }[];
    web: { title: string; url: string }[];
  };
}

export default function AgentPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
      // Handle error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-[var(--bg-cream)] paper-texture">
      {/* Header Area */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-[var(--border-subtle)] bg-white/40 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-dark)] flex items-center justify-center text-white shadow-lg">
              <HiSparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[var(--text-primary)]">Mnemo Agent</h1>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Knowledge & Web Synthesis</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Neural Core Online
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-4 py-8 space-y-8 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-xl flex items-center justify-center text-[var(--amber-primary)] border border-[var(--border-subtle)]">
                <FiCpu size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">How can I assist your research today?</h2>
                <p className="text-[var(--text-secondary)] font-medium">I can synthesize answers from your personal saves and the live web.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
                {[
                  { icon: <HiOutlineBookOpen />, text: "Search my saved items for..." },
                  { icon: <HiOutlineGlobeAlt />, text: "What are the latest updates on..." },
                  { icon: <HiOutlineLightBulb />, text: "Explain the concept of..." },
                  { icon: <HiSparkles />, text: "Find and summarize my notes on..." }
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(item.text)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[var(--border-subtle)] hover:border-[var(--amber-primary)]/40 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-warm)] flex items-center justify-center text-[var(--amber-primary)] group-hover:bg-[var(--amber-primary)] group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-[var(--text-secondary)]">{item.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((m) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md",
                m.role === 'user' ? "bg-white text-[var(--text-primary)]" : "bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-dark)] text-white"
              )}>
                {m.role === 'user' ? <FiUser /> : <FiCpu />}
              </div>
              
              <div className="space-y-4">
                <div className={cn(
                  "px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                  m.role === 'user' 
                    ? "bg-white border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tr-sm font-medium" 
                    : "bg-white/80 backdrop-blur-sm border border-[var(--amber-primary)]/10 text-[var(--text-primary)] rounded-tl-sm prose prose-amber max-w-none"
                )}>
                  {m.role === 'assistant' ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>

                {/* Sources section for assistant */}
                {m.role === 'assistant' && m.sources && (
                  <div className="flex flex-wrap gap-2">
                    {m.sources.knowledge.length > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--amber-primary)]/10 border border-[var(--amber-primary)]/20 text-[var(--amber-dark)] text-[10px] font-black uppercase tracking-tight">
                        <HiOutlineBookOpen className="w-3.5 h-3.5" />
                        {m.sources.knowledge.length} Saves
                      </div>
                    )}
                    {m.sources.web.length > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-tight">
                        <HiOutlineGlobeAlt className="w-3.5 h-3.5" />
                        Web Linked
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex gap-4 items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-dark)] flex items-center justify-center text-white">
                <FiCpu className="animate-spin-slow" />
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber-primary)] animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber-primary)] animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber-primary)] animate-bounce [animation-delay:-0.3s]" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-8 border-t border-[var(--border-subtle)] bg-white/60 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto relative group">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full pl-6 pr-20 py-5 rounded-3xl bg-[var(--bg-cream)] border-2 border-[var(--border-subtle)] focus:border-[var(--amber-primary)] transition-all outline-none text-sm font-bold shadow-inner placeholder:text-[var(--text-muted)]"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-[var(--amber-primary)] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all z-20"
            >
              <HiArrowRight className="w-5 h-5" />
            </button>
          </form>
          {/* Decorative glows */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--amber-primary)] to-[var(--amber-light)] rounded-3xl opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
