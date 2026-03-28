'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageCircle, X, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { HiOutlineGlobeAlt, HiOutlineBookOpen } from 'react-icons/hi2';
import { FiCpu, FiUser } from 'react-icons/fi';
import { useFloatingAssistant } from '@/hooks/useFloatingAssistant';
import { useState, useEffect } from 'react';

export const FloatingAssistant = () => {
  const {
    isOpen,
    messages,
    isLoading,
    scrollRef,
    handleSendMessage,
    clearMessages,
    toggleOpen,
    closeChat,
  } = useFloatingAssistant();

  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    setInput('');
    await handleSendMessage(currentInput);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeChat]);

  return (
    <>
      {/* Floating Orb Button */}
      <motion.button
        onClick={toggleOpen}
        className={cn(
          "fixed z-50 group",
          isMobile ? "bottom-4 right-4" : "bottom-6 right-6"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow Ring */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
        
        {/* Main Orb */}
        <motion.div
          className={cn(
            "relative rounded-full flex items-center justify-center shadow-xl transition-all ",
            isOpen 
              ? "bg-gradient-to-br from-red-500/80 to-red-600/80" 
              : "bg-gradient-to-br from-primary to-accent",
            isMobile ? "w-12 h-12" : "w-14 h-14"
          )}
          animate={{ 
            rotate: isOpen ? 45 : 0,
          }}
        >
          {isOpen ? (
            <X className={cn("text-white", isMobile ? "w-5 h-5" : "w-6 h-6")} />
          ) : (
            <>
              <Brain className={cn("text-white", isMobile ? "w-5 h-5" : "w-6 h-6")} />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 rounded-full border-2 border-background"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </>
          )}
        </motion.div>

        {/* Pulse Ring Animation */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-50 flex flex-col rounded-lg overflow-hidden shadow-2xl border border-border bg-blue-950",
              isMobile 
                ? "bottom-20 w-full max-w-none h-[calc(100vh-80px)]" 
                : "bottom-24 right-6 w-96 max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-180px)]"
            )}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 sm:px-5 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground hidden sm:block">Powered by MnemoAI</p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <MessageCircle className={cn("text-white", isMobile ? "w-6 h-6" : "w-8 h-8")} />
                  </div>
                  <h4 className="text-base font-semibold text-foreground mb-2">How can I help you?</h4>
                  <p className="text-sm text-muted-foreground max-w-[260px]">
                    Ask questions about your saved content or search the web
                  </p>
                </div>
              )}

              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
                    m.role === 'user' ? "bg-primary text-white" : "bg-accent/20 text-accent"
                  )}>
                    {m.role === 'user' ? <FiUser size={12} /> : <FiCpu size={12} />}
                  </div>
                  
                  <div className={cn(
                    "flex flex-col gap-1 max-w-[85%] sm:max-w-[80%]",
                    m.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                      m.role === 'user' 
                        ? "bg-primary text-white rounded-tr-sm" 
                        : "bg-muted text-foreground rounded-tl-sm border border-border"
                    )}>
                      <ReactMarkdown
                        components={{
                          code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus}
                                language={match?.[1] || 'text'}
                                PreTag="div"
                                className="rounded-lg overflow-hidden shadow-lg border border-border !my-2 text-xs"
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code {...props} className={cn("bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-mono", className)}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>

                    {/* Sources */}
                    {m.role === 'assistant' && m.sources && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {m.sources.knowledge.length > 0 && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent/5 border border-accent/10 text-accent text-xs">
                            <HiOutlineBookOpen className="w-3 h-3" />
                            {m.sources.knowledge.length} saved
                          </span>
                        )}
                        {m.sources.web.length > 0 && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-xs">
                            <HiOutlineGlobeAlt className="w-3 h-3" />
                            Web
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 items-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                    <Brain className="animate-pulse w-4 h-4" />
                  </div>
                  <div className="flex gap-1 px-4 py-3 rounded-2xl bg-muted border border-border">
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.1s]" />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.2s]" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-3 border-t border-border bg-muted/20">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearMessages}
                    className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                    title="Clear chat"
                  >
                    ✕
                  </button>
                )}
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    className="w-full pl-4 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
