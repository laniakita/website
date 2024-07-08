import 'dotenv';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import '@/css/app.css';
import { DarkStoreProvider } from '@/providers/theme-store-provider';
import NavBar from '@/components/navbar/navbar';
import { themeGetter } from '@/lib/theme-getter';
import Footer from '@/components/footer/footer';
import {
  BASE_URL,
  APP_NAME,
  APP_DEFAULT_TITLE,
  APP_DESCRIPTION,
  APP_TITLE_TEMPLATE,
  APP_THEME_COLOR,
} from '@/lib/constants';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

const zeroxproto = localFont({
  src: './0xProto-Regular.woff2',
  display: 'swap',
  variable: '--font-zeroxproto',
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
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
    card: 'summary',
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en-US' dir='ltr' className={`${inter.variable} ${zeroxproto.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeGetter }} />
      </head>
      <body className={inter.className}>
        <DarkStoreProvider>
          <NavBar />
          {children}
          <Footer />
        </DarkStoreProvider>
      </body>
    </html>
  );
}

/*
// wip
          <div className='absolute inset-x-0 top-0 lg:top-[3rem] flex w-full items-center justify-center py-4'>
            <Link
              href='#content'
              className='rounded-full bg-ctp-sapphire px-10 py-2 font-mono font-black text-ctp-base opacity-0 focus:opacity-100'
            >
              Skip to Content
            </Link>
          </div>
*/
