import 'dotenv';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { type ReactNode } from 'react';
import '@/css/app.css';
import { DarkStoreProvider } from '@/providers/theme-store-provider';
import NavBar from '@/components/navbar/navbar';
import { themeGetter } from '@/lib/theme-getter';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

const zeroxproto = localFont({
  src: './0xProto-Regular.woff2',
  display: 'swap',
  variable: '--font-zeroxproto',
});

const APP_NAME = 'Lani Akita';
const APP_DEFAULT_TITLE = 'Lani Akita';
const APP_TITLE_TEMPLATE = '%s - Lani Akita';
const APP_DESCRIPTION = "Lani Akita's personal site and dev blog.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL ?? 'https://laniakita.com'),
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
  themeColor: '#000000',
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
        </DarkStoreProvider>
      </body>
    </html>
  );
}
