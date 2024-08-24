'use client';

import { useEffect, useState } from 'react';

export default function ReadingBar() {
  const [width, setWidth] = useState(0);
  const scrollHeight = () => {
    const content = document.getElementById('content');
    //console.log(content?.scrollTop, content?.scrollHeight);
    const el = document.documentElement;
    const ScrollTop = el.scrollTop || document.body.scrollTop;
    const ScrollHeight = content?.scrollHeight ?? document.body.scrollTop;
    const percent = (ScrollTop / (ScrollHeight - el.clientHeight)) * 100;
    setWidth(percent);
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollHeight);
    return () => {
      window.removeEventListener('scroll', scrollHeight);
    };
  });

  return <div style={{ width: `${width}%` }} className={`h-1 ${width >= 50 ? 'bg-ctp-pink' : 'bg-ctp-mauve'} simple-color-trans`} />;
}
