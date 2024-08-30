// Cloudflare Image Optimizations Integration: https://developers.cloudflare.com/images/transform-images/integrate-with-frameworks/
const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src;
};
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const params = [`width=${width}`, `quality=${quality ?? 75}`, 'format=auto'];
  return `/cdn-cgi/image/${params.join(',')}/${normalizeSrc(src)}`;
}

//import { BASE_URL } from '@/lib/constants';
// Docs: https://aws.amazon.com/developer/application-security-performance/articles/image-optimization
// cloudfrontLoader
/*export const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  const url = new URL(`${BASE_URL}${src}`);
  url.searchParams.set('format', 'auto');
  url.searchParams.set('width', width.toString());
  url.searchParams.set('quality', (quality ?? 75).toString());
  return url.href;
};*/
