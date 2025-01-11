'use client';

import { useCallback, useEffect, useId } from 'react';
import { useDarkStore } from '@/providers/theme-store-provider';

export default function DarkModeSwitch() {
  const { dark, themeDark, themeLight } = useDarkStore((state) => state);
  const switchId = useId();

  const repaintMasks = () => {
    if (!window) return;
    //const mainNav = document.getElementById('main-nav');
    //const maskEdge = document.getElementById('nav-mask-edge');
    //maskBg?.classList.add('force-repaint');
    //maskEdge?.classList.add('force-repaint');
    //mainNav?.classList.add('force-repaint');
    //window.scrollBy(0, 10);
    //window.scrollBy(0, -1);
    setTimeout(() => {
      //mainNav?.classList.remove('force-repaint');
      //maskBg?.classList.remove('force-repaint');
      //maskEdge?.classList.remove('force-repaint');
    }, 50);
    setTimeout(() => {
      //console.log(mainNav);
    }, 55);
  };

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
      themeLight();
    }
    localStorage.setItem('isDark', JSON.stringify(nextDark));
    handleThemePref();
    repaintMasks();
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
        className='aria-checked-before:border-ctp-surface2 relative h-8 w-12 rounded-[1em] border border-ctp-text/60 bg-ctp-overlay2/60 shadow-inner before:bg-ctp-base/80 before:shadow-md aria-checked:border-ctp-surface2/60 aria-checked:bg-ctp-surface2/20 aria-checked:shadow-inner aria-checked:before:bg-ctp-midnight/60'
      />
    </div>
  );
}
