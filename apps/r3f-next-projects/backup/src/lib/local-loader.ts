'use client';

export default function localLoader({ src, width, quality }: { src?: string; width?: number; quality?: number }) {
  return `${src}?&q=${quality ?? 75}&w=${width}`;
}
