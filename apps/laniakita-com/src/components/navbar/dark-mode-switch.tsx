'use client';

import { useCallback, useEffect, useId } from 'react';
import { useDarkStore } from '@/providers/theme-store-provider';

export default function DarkModeSwitch() {
  const { dark, themeDark, themeLight } = useDarkStore((state) => state);
  const switchId = useId();

  const handleThemePref = useCallback(() => {
    const isDarkLocal = localStorage.getItem('isDark');
    if (isDarkLocal === 'true') {
      themeDark();
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else if (isDarkLocal === 'false') {
      themeLight();
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches && !isDarkLocal) {
      themeDark();
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      themeLight();
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [themeDark, themeLight]);

  const handleClick = () => {
    const nextDark = !dark;
    if (nextDark) {
      themeDark();
    } else {
      themeLight;
    }
    localStorage.setItem('isDark', JSON.stringify(nextDark));
    handleThemePref();
  };

  useEffect(() => {
    handleThemePref();
    // listen for changes
    const handleOSPref = () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeDark();
        localStorage.removeItem('isDark');
        handleThemePref();
      } else {
        themeLight();
        localStorage.removeItem('isDark');
        handleThemePref();
      }
    };
    window.addEventListener('storage', handleThemePref);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleOSPref);
    // we need to unsubscibe from our listeners so the hook doesn't freak out
    return () => {
      window.removeEventListener('storage', handleThemePref);
      window.removeEventListener('change', handleOSPref);
    };
  }, [handleThemePref, themeDark, themeLight, switchId]);
  return (
    <div className='s-slider' id='darkmode-switch'>
      <button
        id={`darkmode-button-${switchId}`}
        type='button'
        role='switch'
        aria-checked={Boolean(dark)}
        aria-label={dark ? 'Toggle Light theme' : 'Toggle Dark theme'}
        onClick={handleClick}
        className='relative h-[1.6rem] w-[2.8rem] rounded-[1em] border border-stone-600/60 bg-stone-400/60 shadow-inner before:bg-stone-100/90 before:shadow-md aria-checked:border-stone-400/60 aria-checked:bg-stone-900/40 aria-checked:shadow-inner aria-checked:before:bg-stone-400/50 aria-checked:before:shadow-sm'
      />
    </div>
  );
}
