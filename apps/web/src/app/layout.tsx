import type { Metadata, Viewport } from 'next';
import { Inter_Tight } from 'next/font/google';
import localFont from 'next/font/local';
import { type ReactNode } from 'react';

import '@/css/app.css';
import {
  APP_URL,
  APP_NAME,
  APP_DEFAULT_TITLE,
  APP_DESCRIPTION,
  APP_TITLE_TEMPLATE,
  APP_THEME_COLOR,
} from '@/lib/constants';
import ZustandWrappersCore from '@/components/wrappers/main';
import LoginGate from '@/components/auth/login-gate';

const inter_tight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});

const zeroxproto = localFont({
  src: './0xProtoNerdFontPropo-Regular.woff2',
  display: 'swap',
  variable: '--font-zeroxproto',
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: APP_THEME_COLOR,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en-US' dir='ltr' className={`${inter_tight.variable} ${zeroxproto.variable}`} suppressHydrationWarning>
      <head>
        {/* eslint-disable @next/next/no-sync-scripts -- necessary 
            @ts-expect-error -- fetchPriority exists */}
        <script src='/dist/theme-getter.js' fetchPriority='high' />
      </head>
      <body className={`${inter_tight.className} `} suppressHydrationWarning>
        <ZustandWrappersCore>{children}</ZustandWrappersCore>
      </body>
    </html>
  );
}
