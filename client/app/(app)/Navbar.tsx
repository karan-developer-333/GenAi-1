'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { HiDownload } from 'react-icons/hi';

const NAV_LINKS = [ 
  { label: 'Collections', href: '/collections'},
  { label: 'Graph',        href: '/graph'    },
  { label: 'AI Suggestions', href: '/ai-suggestions' },
  { label: 'AI Agent', href: '/agent' },
  { label: 'Settings', href: '/settings' },
  { label: 'Setup', href: '/setup' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{  opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn(
          'fixed top-0 left-0 w-full right-0 z-60 transition-all duration-500',
          scrolled || open
            ? 'bg-[#010419]/90 backdrop-blur-xl border-b border-[#539AE9]/15 shadow-[0_4px_30px_rgba(1,4,25,0.8)]'
            : 'bg-[#010419]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-b border-[#539AE9]/15 md:border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-light)] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-light)] flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/35 transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                    <path d="M4 4h10v10H4V4z" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.25)" />
                    <path d="M2 2h4v4H2V2z" stroke="white" strokeWidth="1.2" fill="rgba(255,255,255,0.15)" />
                    <path d="M12 12h4v4h-4v-4z" stroke="white" strokeWidth="1.2" fill="rgba(255,255,255,0.15)" />
                  </svg>
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
                Mnemo<span className="text-gradient-gold">AI</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-[#A8B3CF] hover:text-white transition-colors duration-200 rounded-lg hover:bg-[#09153C]/40"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth area */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/extension.zip"
                download="mnemo-ai-extension.zip"
                className="p-2.5 rounded-xl bg-[#09153C]/40 border border-[#539AE9]/10 hover:border-[#539AE9]/40 hover:bg-[#539AE9]/10 transition-all duration-300 group shadow-sm flex items-center justify-center text-[#A8B3CF] hover:text-[#539AE9]"
                title="Download Extension"
              >
                <HiDownload className="w-5 h-5" />
              </a>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                  },
                }}
              />
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-xl bg-[#09153C]/40 border border-[#539AE9]/10 hover:bg-[#09153C]/60 transition-colors"
              aria-label="Toggle menu"
            >
              <motion.span 
                className="w-5 h-0.5 bg-white block"
                animate={{ rotate: open ? 45 : 0, y: open ? 3 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="w-5 h-0.5 bg-white block"
                animate={{ rotate: open ? -45 : 0, y: open ? -3 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[72px] z-40 bg-[#010419]/95 backdrop-blur-2xl border-b border-[#539AE9]/15 md:hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-3 rounded-xl text-[#A8B3CF] hover:text-white hover:bg-[#09153C] transition-all duration-200 text-sm font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="border-t border-[#539AE9]/15 mt-3 pt-4 flex flex-col gap-3">
                
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-[#A8B3CF]">Extension</span>
                  <a
                    href="/extension.zip"
                    download="mnemo-ai-extension.zip"
                    className="p-2 rounded-xl bg-[#09153C]/40 border border-[#539AE9]/10 text-[#539AE9] hover:bg-[#539AE9]/10 transition-colors"
                  >
                    <HiDownload className="w-5 h-5" />
                  </a>
                </div>
                <div className="flex justify-center py-4">
                  <UserButton />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
