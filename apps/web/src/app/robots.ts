import type { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  if (APP_URL.includes('https://dev.')) {
    return {
      rules: {
        userAgent: '*',
        disallow: ['/']
      }, 
      sitemap: `${APP_URL}/sitemap.xml`,
    };
  };

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/user/',
        '/users/',
        '/auth/',
        '/login*?*',
        '/signup*?*',
        '/opengraph/',
        // WP crawlers
        '/*/cgi-bin/',
        '/*/wp-admin/',
        '/*/xmlrpc.php'
      ],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
