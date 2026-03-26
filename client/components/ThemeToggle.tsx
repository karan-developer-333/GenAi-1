'use client';

import { useState, useEffect } from 'react';
import { enable, disable, isEnabled } from 'darkreader';
import { HiMoon, HiSun } from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial theme setup
    const savedTheme = localStorage.getItem('theme');
    const darkModeEnabled = savedTheme === 'dark';
    
    if (darkModeEnabled) {
      enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      disable();
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(darkModeEnabled);
  }, []);

  const toggleTheme = () => {
    if (isEnabled()) {
      disable();
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-600/50 hover:bg-white/10 transition-all duration-300 group shadow-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-yellow-600"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <HiSun className="w-5 h-5 transition-transform duration-500 rotate-0" />
      ) : (
        <HiMoon className="w-5 h-5 transition-transform duration-500 rotate-0" />
      )}
    </motion.button>
  );
}
