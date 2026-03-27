'use client';

import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineUser, HiOutlineKey, HiOutlineIdentification, HiCheck } from 'react-icons/hi2';
import { LuCopy, LuSettings2 } from 'react-icons/lu';
import { useState } from 'react';
import { User, Shield, Fingerprint, Copy, Check, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#153081]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#539AE9]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-5 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#09153C]/60 border border-[#539AE9]/20 flex items-center justify-center text-[#539AE9] shadow-2xl backdrop-blur-md">
              <SettingsIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Account Systems</h1>
              <p className="text-[#A8B3CF] font-medium mt-1">Manage your neural identity and synchronization parameters.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative bg-[#09153C]/40 backdrop-blur-xl border border-[#539AE9]/10 rounded-3xl p-8 overflow-hidden transition-all hover:border-[#539AE9]/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#539AE9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-4 mb-8 relative">
              <div className="w-11 h-11 rounded-xl bg-[#539AE9]/5 border border-[#539AE9]/15 flex items-center justify-center text-[#539AE9]">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Neural Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4B6C8F]">Primary Alias</label>
                <div className="text-lg font-bold text-white bg-[#010419]/40 px-4 py-3 rounded-2xl border border-[#539AE9]/10">
                  {user?.fullName || 'Identity Anonymous'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4B6C8F]">Communication Node</label>
                <div className="text-lg font-bold text-white bg-[#010419]/40 px-4 py-3 rounded-2xl border border-[#539AE9]/10 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Developer ID Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative bg-[#09153C]/40 backdrop-blur-xl border border-[#539AE9]/10 rounded-3xl p-8 overflow-hidden transition-all hover:border-[#539AE9]/30"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#2655C7]/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-opacity group-hover:opacity-100" />
            
            <div className="flex items-center gap-4 mb-8 relative">
              <div className="w-11 h-11 rounded-xl bg-[#2655C7]/10 border border-[#2655C7]/20 flex items-center justify-center text-[#539AE9] shadow-lg shadow-blue-900/20">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Synchronization Key</h2>
            </div>

            <div className="space-y-8 relative">
              <p className="text-[#A8B3CF] font-medium leading-relaxed max-w-2xl">
                Use your unique <span className="text-[#539AE9] font-bold">Neural ID</span> to link the browser extension. This ensures all captured data is correctly routed to your personal knowledge matrix.
              </p>

              <div className="bg-[#010419]/60 rounded-3xl p-7 border border-[#539AE9]/15 shadow-2xl relative overflow-hidden group/id">
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/id:opacity-100 transition-opacity" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#539AE9]">Clerk Protocol ID</label>
                    <div className="font-mono text-sm font-bold text-white/90 bg-[#09153C]/80 px-4 py-2.5 rounded-xl border border-[#539AE9]/20 shadow-inner block overflow-x-auto whitespace-nowrap scrollbar-hide" data-lenis-prevent="true">
                      {user?.id}
                    </div>
                  </div>
                  
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#153081] to-[#2655C7] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-950/40 hover:scale-[1.02] hover:shadow-[#539AE9]/20 active:scale-[0.98] transition-all border border-white/10 group/btn"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400">Linked Successfully</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        <span>Copy Neural ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-[24px] bg-[#09153C]/40 border border-[#539AE9]/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1 h-full bg-[#539AE9]/40" />
                <div className="w-6 h-6 rounded-full bg-[#539AE9]/10 flex-shrink-0 flex items-center justify-center mt-0.5 border border-[#539AE9]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#539AE9] animate-pulse" />
                </div>
                <p className="text-xs text-[#A8B3CF] font-medium italic leading-relaxed">
                  Security Protocol: Keep this identifier confidential. It serves as your primary bridge for external knowledge capture pipelines.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
