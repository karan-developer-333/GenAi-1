'use client';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineKey, HiOutlineIdentification, HiCheck } from 'react-icons/hi2';
import { LuCopy, LuSettings2 } from 'react-icons/lu';
import { useState } from 'react';

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
    <div className="min-h-screen bg-[var(--bg-cream)] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--amber-primary)]/10 flex items-center justify-center text-[var(--amber-primary)]">
              <LuSettings2 className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">Account Settings</h1>
          </div>
          <p className="text-[var(--text-secondary)] font-medium">Manage your personal identification and extension connectivity.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-warm p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-secondary)] shadow-inner border border-[var(--border-subtle)]">
                <HiOutlineUser className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Profile Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Full Name</label>
                <div className="text-lg font-bold text-[var(--text-primary)]">{user?.fullName || 'Anonymous User'}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Email Address</label>
                <div className="text-lg font-bold text-[var(--text-primary)]">{user?.primaryEmailAddress?.emailAddress}</div>
              </div>
            </div>
          </motion.div>

          {/* Connectivity / Developer ID Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-warm p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--amber-primary)]/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="flex items-center gap-4 mb-8 relative">
              <div className="w-10 h-10 rounded-xl bg-[var(--amber-primary)]/10 flex items-center justify-center text-[var(--amber-primary)] shadow-sm border border-[var(--amber-primary)]/20">
                <HiOutlineIdentification className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Extension Connectivity</h2>
            </div>

            <div className="space-y-6 relative">
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl">
                Use your unique identifier to link the "Save to Knowledge" browser extension. This ensures all captured data is correctly stored in your personal workspace.
              </p>

              <div className="bg-[var(--bg-base)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-inner">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--amber-dark)] opacity-70">Your Clerk User ID</label>
                    <div className="font-mono text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-warm)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] inline-block">
                      {user?.id}
                    </div>
                  </div>
                  
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--amber-primary)] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[var(--amber-primary)]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {copied ? (
                      <><HiCheck className="w-5 h-5" /> Copied!</>
                    ) : (
                      <><LuCopy className="w-4 h-4" /> Copy ID</>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--bg-warm)]/50 border border-[var(--border-subtle)]">
                <div className="w-5 h-5 rounded-full bg-[var(--amber-primary)]/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber-primary)]" />
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-bold italic">
                  Keep this ID private. It acts as your primary connection key for third-party tools like our browser extension.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
