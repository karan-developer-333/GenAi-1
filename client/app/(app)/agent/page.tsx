'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt, HiOutlineLightBulb, HiOutlineBookOpen } from 'react-icons/hi2';
import { FiCpu, FiUser } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { Brain, Search, Sparkles, Send } from 'lucide-react';
import { useAgent } from '@/hooks/useAgent';

export default function AgentPage() {
  const [input, setInput] = useState('');
  const { messages, isLoading, scrollRef, handleSendMessage } = useAgent();

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    setInput('');
    await handleSendMessage(currentInput);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-background relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-blue-600/5 opacity-40 pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#539AE9]/10 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-[#153081]/15 rounded-full blur-[100px] animate-assistant-glow pointer-events-none" />

      

      <main 
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-6 py-10 space-y-8 scroll-smooth scrollbar-hide"
      >
        <div className="max-w-4xl mx-auto space-y-10">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center"
            >
              
              <div className="space-y-4 mb-12">
                <h2 className="text-h1 text-white">How can I assist your <span className="text-[#539AE9]">research</span> today?</h2>
                <p className="text-[#A8B3CF] text-body-lg max-w-xl mx-auto">I'll synthesize answers from your personal saves and the live web with semantic precision.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { icon: <Search size={18} />, text: "Search my saved items for..." },
                  { icon: <HiOutlineGlobeAlt size={20} />, text: "What are the latest updates on..." },
                  { icon: <HiOutlineLightBulb size={20} />, text: "Explain the concept of..." },
                  { icon: <Sparkles size={18} />, text: "Find and summarize my notes on..." }
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(item.text)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#09153C]/40 border border-[#539AE9]/10 hover:border-[#539AE9]/30 hover:bg-[#09153C]/60 transition-all text-left group backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#539AE9]/5 flex items-center justify-center text-[#539AE9] group-hover:bg-[#539AE9]/10 transition-colors border border-[#539AE9]/10">
                      {item.icon}
                    </div>
                    <span className="text-btn text-[#A8B3CF] group-hover:text-white transition-colors">{item.text}</span>
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
                "flex gap-5",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md border border-white/10",
                m.role === 'user' ? "bg-[#09153C]/80 text-white" : "bg-gradient-to-br from-[#153081] to-[#2655C7] text-white"
              )}>
                {m.role === 'user' ? <FiUser size={20} /> : <FiCpu size={20} />}
              </div>
              
              <div className={cn(
                "flex flex-col gap-3",
                m.role === 'user' ? "items-end max-w-[80%]" : "items-start max-w-[85%]"
              )}>
                <div className={cn(
                  "px-5 py-4 rounded-2xl text-body relative overflow-hidden",
                  m.role === 'user' 
                    ? "bg-[#2655C7] text-white rounded-tr-none shadow-md shadow-blue-950/20" 
                    : "bg-[#09153C]/80 backdrop-blur-md border border-[#539AE9]/15 text-white rounded-tl-none prose prose-invert max-w-none shadow-xl"
                )}>
                   {m.role === 'assistant' && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#539AE9]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                  )}
                  <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-[#539AE9]">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline ? (
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match?.[1] || 'text'}
                              PreTag="div"
                              className="rounded-lg overflow-hidden shadow-lg border border-white/10 !my-4 text-sm"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code {...props} className={cn("bg-[#539AE9]/10 text-[#539AE9] px-1.5 py-0.5 rounded-md", className)}>
                              {children}
                            </code>
                          );
                        },
                        img({ src, alt }) {
                          return (
                            <div className="my-4 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black/50 inline-block">
                              <img src={src} alt={alt} className="max-w-full md:max-w-md h-auto object-cover" />
                            </div>
                          );
                        }
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Sources section for assistant */}
                {m.role === 'assistant' && m.sources && (
                  <div className="flex flex-wrap gap-2.5 mt-1">
                    {m.sources.knowledge.length > 0 && (
                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#539AE9]/5 border border-[#539AE9]/15 text-[#539AE9] text-tiny font-bold uppercase tracking-wider shadow-sm">
                        <HiOutlineBookOpen className="w-3.5 h-3.5" />
                        {m.sources.knowledge.length} Internal Verified Saves
                      </div>
                    )}
                    {m.sources.web.length > 0 && (
                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/5 border border-cyan-500/15 text-cyan-400 text-tiny font-bold uppercase tracking-wider shadow-sm">
                        <HiOutlineGlobeAlt className="w-3.5 h-3.5" />
                        Live Web Synthesis Updated
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
              className="flex gap-5 items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#153081] to-[#2655C7] flex items-center justify-center text-white shadow-md border border-white/10">
                <Brain className="animate-pulse w-5 h-5" />
              </div>
              <div className="flex gap-1.5 py-3 px-4 rounded-2xl bg-[#09153C]/40 border border-[#539AE9]/10 border-dashed backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-[#539AE9] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#539AE9] animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 rounded-full bg-[#539AE9] animate-bounce [animation-delay:-0.3s]" />
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 p-5 border-t border-[#539AE9]/15 bg-[#010419]/90 backdrop-blur-xl relative z-20">
        <div className="max-w-4xl mx-auto relative group">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <div className="relative flex-grow">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Mnemo Agent..."
                className="w-full pl-5 pr-14 py-4 rounded-xl bg-[#09153C]/40 border-2 border-[#539AE9]/15 focus:border-[#539AE9]/40 transition-all outline-none text-body font-medium text-white placeholder:text-[#4B6C8F] shadow-inner"
              />
              <div className="absolute left-0 top-0 w-1 h-full bg-[#539AE9] rounded-l-full scale-y-0 group-focus-within:scale-y-50 transition-transform" />
            </div>
            
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="group-hover:translate-x-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#153081] to-[#2655C7] text-white flex items-center justify-center shadow-md hover:shadow-[#539AE9]/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all border border-white/10"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {/* Decorative glow behind input */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[#2655C7] to-[#539AE9] rounded-[32px] opacity-0 group-focus-within:opacity-10 blur-2xl transition-opacity pointer-events-none" />
        </div>
      </footer>
    </div>
  );
}
