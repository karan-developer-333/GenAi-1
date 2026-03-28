'use client';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Fingerprint, Copy, Check, Settings, Info } from 'lucide-react';
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
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center">
              <Settings className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-h1 text-foreground">Settings</h1>
            </div>
          </div>
          <p className="text-body text-muted-foreground mt-4">
            Manage your account and browser extension connection.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-h4 text-foreground">Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-label text-muted-foreground">Name</label>
                <div className="text-foreground font-medium bg-muted/30 px-4 py-3 rounded-xl border border-border">
                  {user?.fullName || 'Not set'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-label text-muted-foreground">Email</label>
                <div className="text-foreground font-medium bg-muted/30 px-4 py-3 rounded-xl border border-border truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Browser Extension Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-h4 text-foreground">Browser Extension</h2>
                <p className="text-sm text-muted-foreground">Connect the extension to save content</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-muted/30 rounded-2xl p-5 border border-border">
                <label className="text-label text-accent mb-3 block">Your User ID</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="font-mono text-sm text-foreground bg-background px-4 py-3 rounded-xl border border-border flex-1 w-full sm:w-auto overflow-x-auto">
                    {user?.id}
                  </div>
                  
                  <button 
                    onClick={copyToClipboard}
                    className={cn(
                      "btn w-full sm:w-auto justify-center transition-all",
                      copied ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "btn-primary"
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/10">
                <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Copy your User ID and paste it into the MnemoAI browser extension settings to connect it to your account.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
