'use client';

import { useCallback, useEffect, useId } from 'react';
import { useDarkStore } from '@/providers/theme-store-provider';

export default function DarkModeSwitch() {
  const { dark, themeDark, themeLight } = useDarkStore((state) => state);
  const switchId = useId();

  const DEBUG = true;

  const handleThemeDark = useCallback(() => {
    if (DEBUG) console.log('handling themeDark => dark_curr:', localStorage?.getItem('isDark'));
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, [DEBUG]);
  const handleThemeLight = useCallback(() => {
    if (DEBUG) console.log('handling themeLight => dark_curr:', localStorage?.getItem('isDark'));
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }, [DEBUG]);

  // clicking sets the theme pref into localStorage + updates theme
  const handleClick = () => {
    if (DEBUG) console.log('handling theme switch click');
    const nextDark = !dark;
    localStorage.setItem('isDark', JSON.stringify(nextDark));
    if (nextDark) {
      if (DEBUG) console.log(`setting isDark to nextDark (dark): ${nextDark}`);
      themeDark();
      handleThemeDark();
    } else {
      if (DEBUG) console.log(`setting isDark to nextDark (!dark === light): ${nextDark}`);
      themeLight();
      handleThemeLight();
    }
    if (DEBUG) console.log('finished theme switch update => final nextDark val:', nextDark);
  };

  // this useEffect sets the switch for the initial load
  useEffect(() => {
    // init (we don't need to handle themes, just set the store var)
    if (DEBUG) console.log('trying to set initial theme based on local theme pref');
    if (localStorage.getItem('isDark') === 'true') {
      themeDark();
      if (DEBUG) console.log('found pref => dark theme initialized successfully');
    } else if (localStorage.getItem('isDark') === 'false') {
      themeLight();
      if (DEBUG) console.log('found pref => light theme initialized successfully');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      themeDark();
      if (DEBUG) console.log('OS pref => dark theme initialized successfully');
    } else {
      themeLight();
      if (DEBUG) console.log('OS pref => light theme initialized successfully');
    }
    // theme switch is set to dark by default so we probably don't need to handle it, but who knows.
  }, [themeDark, themeLight, DEBUG]);

  // this useEffect handles the OS theme preference + removing localStorage pref
  useEffect(() => {
    // run when prefers color-scheme changes
    const handleOSPref = () => {
      if (DEBUG) console.log('updating theme based on OS preference');
      // remove localStorage pref (if it exists)
      localStorage.removeItem('isDark');
      // set theme store + handle theme class/color-scheme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeDark();
        handleThemeDark();
      } else {
        themeLight();
        handleThemeLight();
      }
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleOSPref);
    return () => {
      window.removeEventListener('change', handleOSPref);
    };
  }, [themeDark, themeLight, DEBUG, handleThemeDark, handleThemeLight]);

  // this useEffect will propagate the theme change to other tabs
  useEffect(() => {
    const handleStorage = () => {
      if (DEBUG) console.log('updating theme from localStorage change');
      if (localStorage.getItem('isDark') === 'true' && !document?.documentElement?.classList?.contains('dark')) {
        themeDark();
        handleThemeDark();
      } else if (localStorage.getItem('isDark') === 'false' && document?.documentElement?.classList?.contains('dark')) {
        themeLight();
        handleThemeLight();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [themeDark, themeLight, handleThemeDark, handleThemeLight, DEBUG]);

  return (
    <div className='s-slider' id='darkmode-switch'>
      <button
        id={`darkmode-button-${switchId}`}
        type='button'
        role='switch'
        onClick={handleClick}
        aria-checked={Boolean(dark)}
        aria-label={dark ? 'Toggle Light theme' : 'Toggle Dark theme'}
        className='aria-checked-before:border-ctp-surface2 relative h-8 w-12 rounded-[1em] border border-ctp-text/60 bg-ctp-overlay2/60 shadow-inner before:bg-ctp-base/80 before:shadow-md aria-checked:border-ctp-surface2/60 aria-checked:bg-ctp-surface2/20 aria-checked:shadow-inner aria-checked:before:bg-ctp-midnight/60'
      />
    </div>
  );
}
