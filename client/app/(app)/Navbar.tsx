'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { HiDownload } from 'react-icons/hi';
import { Brain, Sun, Moon } from 'lucide-react';

const NAV_LINKS = [ 
  { label: 'Collections', href: '/collections'},
  { label: 'Knowledge Graph', href: '/graph'    },
  { label: 'Settings', href: '/settings' },
  {label:"Setup",href:"/setup"}
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn(
          'fixed top-0 left-0 w-full right-0 z-50 transition-all duration-500',
          scrolled || open
            ? 'bg-background/90 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">
                Mnemo<span className="text-accent">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive 
                        ? 'text-foreground bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Auth area */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleToggleTheme}
                className="w-9 h-9 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors flex items-center justify-center"
                title="Toggle theme"
              >
                <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
              <a
                href="/extension.zip"
                download="mnemo-ai-extension.zip"
                className="btn btn-secondary text-sm py-2"
                title="Download Extension"
              >
                <HiDownload className="w-4 h-4" />
                <span>Extension</span>
              </a>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                  },
                }}
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              <motion.span 
                className="w-5 h-0.5 bg-foreground block"
                animate={{ rotate: open ? 45 : 0, y: open ? 3 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="w-5 h-0.5 bg-foreground block"
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
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-2xl border-b border-border md:hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium',
                        isActive 
                          ? 'text-primary bg-primary/10' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="border-t border-border mt-3 pt-4 flex flex-col gap-3">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleToggleTheme}
                    className="w-9 h-9 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors flex items-center justify-center"
                    title="Toggle theme"
                  >
                    <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </button>
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
