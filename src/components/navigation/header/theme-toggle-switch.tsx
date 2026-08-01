'use client';

import { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/features/providers/theme-store-provider';
import type { ThemeMode } from '@/features/stores/theme-store';
import { cn } from '@/lib/utils';

interface ThemeToggleSwitchProps {
  className?: string;
}

export function ThemeToggleSwitch({ className }: ThemeToggleSwitchProps) {
  const { theme, setTheme } = useThemeStore((state) => state);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // sync store with localStorage on mount
    const stored = window.localStorage.getItem('theme') as ThemeMode | null;
    if (stored && ['light', 'dark', 'auto'].includes(stored)) {
      setTheme(stored);
    }
  }, [setTheme]);

  const applyTheme = useCallback((newTheme: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'dark' : 'light');
      root.removeAttribute('data-theme');
    } else {
      root.classList.add(newTheme);
      root.setAttribute('data-theme', newTheme);
    }
    
    // In Tailwind v4 with the new setup, color-scheme can be handled automatically or set explicitly
    root.style.colorScheme = newTheme === 'auto' ? 'light dark' : newTheme;
  }, []);

  const toggleTheme = () => {
    const nextMap: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'auto',
      auto: 'light',
    };
    const nextTheme = nextMap[theme] || 'auto';
    setTheme(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };
    media.addEventListener('change', handleMediaChange);
    return () => media.removeEventListener('change', handleMediaChange);
  }, [theme, applyTheme]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue as ThemeMode);
        applyTheme(e.newValue as ThemeMode);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setTheme, applyTheme]);

  // Avoid hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        isDisabled
        className={cn('w-9 h-9 opacity-50', className)} 
        aria-label="Theme toggle loading"
      >
        <span className="icon-[ph--monitor-fill] size-5" />
      </Button>
    );
  }

  const icons: Record<ThemeMode, string> = {
    light: 'icon-[ph--sun-fill]',
    dark: 'icon-[ph--moon-fill]',
    auto: 'icon-[ph--monitor-fill]',
  };

  const labels: Record<ThemeMode, string> = {
    light: 'Light Theme',
    dark: 'Dark Theme',
    auto: 'System Theme',
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onPress={toggleTheme}
      aria-label={`Current theme is ${labels[theme]}. Click to toggle.`}
      title={labels[theme]}
      className={cn('transition-all duration-300 hover:bg-muted', className)}
    >
      <span className={cn(icons[theme], 'size-5 transition-transform duration-300')} />
    </Button>
  );
}
