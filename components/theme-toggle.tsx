'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch by rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="w-11 h-11"></div>; // Placeholder to avoid layout shift
  }
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={22} />
      ) : (
        <Sun size={22} />
      )}
    </button>
  );
} 