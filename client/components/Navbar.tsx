'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'Product',      href: '#features' },
  { label: 'How It Works', href: '#how'      },
  { label: 'Graph',        href: '#graph'    },
  { label: 'Pricing',      href: '# pricing'  },
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
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn(
          'fixed top-0 left-0 w-full r right-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-yellow-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-600/25 group-hover:shadow-yellow-600/40 transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                    <path d="M4 4h10v10H4V4z" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.25)" />
                    <path d="M2 2h4v4H2V2z" stroke="white" strokeWidth="1.2" fill="rgba(255,255,255,0.15)" />
                    <path d="M12 12h4v4h-4v-4z" stroke="white" strokeWidth="1.2" fill="rgba(255,255,255,0.15)" />
                  </svg>
                </div>
              </div>
              <span className="font-bold  text-lg tracking-tight">
                Mnemo<span className="bg-gradient-to-r from-yellow-400 to-yellow-400 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-yellow-600 transition-colors duration-200 rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <a 
                href="/collections" 
                className="text-sm text-[var(--text-secondary)] hover:text-yellow-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Sign in
              </a>
              <a
                href="/collections"
                className="btn-primary group"
              >
                Get Started
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <motion.span 
                className="w-5 h-0.5 bg-black block"
                animate={{ rotate: open ? 45 : 0, y: open ? 3 : 0 }}
                transition={{ duration: 0.2 }}
              />
              {/* <motion.span 
                className="w-5 h-0.5 bg-white/80 block"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              /> */}
              <motion.span 
                className="w-5 h-0.5 bg-black/80 block"
                animate={{ rotate: open ? -45 : 0, y: open ? -3 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[72px] z-40 glass border-b border-white/5 lg:hidden"
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
                  className="px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="border-t border-white/5 mt-3 pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-[var(--text-secondary)]">Theme</span>
                  <ThemeToggle />
                </div>
                <a href="#" className="px-4 py-3 text-center text-[var(--text-secondary)] hover:text-white rounded-xl hover:bg-white/5 transition-all">Sign in</a>
                <a href="#" className="btn-primary justify-center">Get Started</a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
