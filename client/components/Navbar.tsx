'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowRight, Brain } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Product',      href: '#features' },
  { label: 'How It Works', href: '#how'      },
  { label: 'Graph',        href: '/graph'    },
  { label: 'Pricing',      href: '#pricing'  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4',
          scrolled
            ? 'bg-[#010419]/80 backdrop-blur-xl border-b border-[#539AE9]/15 py-3 shadow-[0_8px_32px_rgba(1,4,25,0.8)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-[#2655C7]/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#153081] to-[#2655C7] flex items-center justify-center shadow-lg shadow-[#153081]/20 border border-white/10 transition-transform duration-500 group-hover:scale-105">
                   <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Mnemo<span className="text-[#539AE9]">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#09153C]/40 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-[#539AE9]/10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-5 py-2 text-sm font-medium text-[#A8B3CF] hover:text-[#539AE9] transition-all duration-300 rounded-xl hover:bg-[#539AE9]/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Link 
                href="/sign-in" 
                className="text-sm font-medium text-[#A8B3CF] hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-[#153081] to-[#2655C7] text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-[#539AE9]/30 transition-all duration-300 overflow-hidden flex items-center gap-2 border border-white/10"
              >
                <span className="relative z-10">Try it now</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2655C7] to-[#539AE9] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-xl bg-[#09153C]/40 border border-[#539AE9]/10 transition-colors text-white"
                aria-label="Toggle menu"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-x-0 top-[88px] z-40 bg-[#010419]/95 backdrop-blur-2xl border-b border-[#539AE9]/10 lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-4 py-4 rounded-2xl text-[#A8B3CF] hover:text-[#539AE9] hover:bg-[#539AE9]/5 transition-all duration-300 text-base font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="h-px bg-[#539AE9]/10 my-4" />
              <div className="flex flex-col gap-4">
                <Link href="/sign-in" className="w-full text-center py-4 rounded-2xl text-[#A8B3CF] hover:bg-[#09153C] transition-all">Sign in</Link>
                <Link href="/sign-up" className="w-full py-4 bg-gradient-to-r from-[#153081] to-[#2655C7] text-white text-center rounded-2xl font-semibold shadow-lg">Try it free</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
