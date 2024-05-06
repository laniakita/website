const themeGetterFunc = (): void => {
  if (typeof(localStorage) as unknown === undefined) {
    return
  }
  const isDarkLocal = localStorage.getItem('isDark');
  if (isDarkLocal === 'true') {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else if (isDarkLocal === 'false') {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches && !isDarkLocal) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
};

// eslint-disable-next-line -- cleanest way to convert the function to a string to inject into layout. 
export const themeGetter = `(${themeGetterFunc})()`
