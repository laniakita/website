import type { Metadata, Viewport } from 'next';
import { Inter_Tight } from 'next/font/google';
import localFont from 'next/font/local';
import { Suspense, type ReactNode } from 'react';
import '@catppuccin/highlightjs/css/catppuccin-variables.rgb.css';
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

function LoadingSpinner() {
  return (
    <div className='flex size-full min-h-screen items-center justify-center bg-ctp-base dark:bg-ctp-midnight'>
      <div role='status'>
        <span className='icon-[eos-icons--bubble-loading] size-12 fill-ctp-text md:size-20' />
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='en-US'
      dir='ltr'
      className={`${inter_tight.variable} ${zeroxproto.variable} dark`}
      suppressHydrationWarning
    >
      <body
        className={`${inter_tight.className} ctp-latte m-0 min-h-dvh scroll-pt-32 bg-ctp-base p-0 text-ctp-text [box-sizing:border-box] dark:ctp-mocha motion-safe:[scroll-behavior:_smooth] md:scroll-pt-24 dark:bg-ctp-midnight`}
        suppressHydrationWarning
      >
        {/* eslint-disable @next/next/no-sync-scripts -- necessary */
        /* @ts-expect-error -- fetchPriority exists */}
        <script src='/dist/theme-getter.js' fetchPriority='high' />
        <Suspense fallback={<LoadingSpinner />}>
          <ZustandWrappersCore>{children}</ZustandWrappersCore>
        </Suspense>
      </body>
    </html>
  );
}
