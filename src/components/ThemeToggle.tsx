'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div
      onClick={toggleTheme}
      className="relative flex items-center p-1 rounded-full bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300/60 dark:border-slate-700/60 shadow-inner w-[72px] h-[36px] select-none cursor-pointer dir-ltr"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTheme()}
      aria-label="تبديل وضع المظهر"
    >
      {/* Sliding Active Pill Indicator */}
      <motion.div
        className="absolute top-1 bottom-1 w-[30px] rounded-full bg-white dark:bg-[#235d3a] shadow-md border border-slate-200 dark:border-[#73c088]/40 pointer-events-none"
        animate={{
          left: isDark ? '37px' : '4px',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />

      {/* Light Side (Sun Icon) */}
      <div
        className={`relative z-10 flex-1 flex items-center justify-center h-full transition-colors ${
          !isDark ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <Sun className="w-4 h-4" />
      </div>

      {/* Dark Side (Moon Icon) */}
      <div
        className={`relative z-10 flex-1 flex items-center justify-center h-full transition-colors ${
          isDark ? 'text-[#73c088]' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Moon className="w-4 h-4" />
      </div>
    </div>
  );
}
