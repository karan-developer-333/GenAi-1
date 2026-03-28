'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowRight, Brain } from 'lucide-react';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-bold text-lg text-foreground">
                Mnemo<span className="text-accent">AI</span>
              </span>
            </Link>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {(!isLoaded || !isSignedIn) && (
                <>
                  <SignInButton>
                    <button className="btn btn-ghost px-4 py-2">
                      Sign in
                    </button>
                  </SignInButton>
                  <Link
                    href="/sign-up"
                    className="btn btn-primary"
                  >
                    Start Free Trial
                  </Link>
                </>
              )}

              {isSignedIn && (
                <>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-9 h-9',
                      },
                    }}
                  />
                  <Link
                    href="/collections"
                    className="btn btn-primary"
                  >
                    <span>Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              {(!isLoaded || !isSignedIn) && !isSignedIn && (
                <Link href="/sign-up" className="btn btn-primary py-2 px-4 text-sm">
                  Start
                </Link>
              )}
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-2xl border-b border-border lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              <div className="border-t border-border mt-3 pt-4 flex flex-col gap-3">
                {(!isLoaded || !isSignedIn) && (
                  <>
                    <SignInButton>
                      <button className="w-full text-center py-3 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all font-medium">
                        Sign in
                      </button>
                    </SignInButton>
                    <Link href="/sign-up" className="btn btn-primary justify-center">
                      Start Free Trial
                    </Link>
                  </>
                )}
                {isSignedIn && (
                  <Link href="/collections" className="btn btn-primary justify-center">
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
