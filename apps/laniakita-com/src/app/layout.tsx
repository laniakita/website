import 'dotenv'
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { type ReactNode } from 'react';
import '@/css/app.css';
import { DarkStoreProvider } from '@/providers/theme-store-provider';
import ThreeLayout from '@/components/dom/three-layout';
import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

const zeroxproto = localFont({
  src: './0xProto-Regular.woff2',
  display: 'swap',
  variable: '--font-zeroxproto',
});

const APP_NAME = 'Lani Akita';
const APP_DEFAULT_TITLE = 'Lani Akita | Full-Stack Developer';
const APP_TITLE_TEMPLATE = '%s - Lani Akita';
const APP_DESCRIPTION = 'Official site & dev blog of Lani, a Full Stack Developer who thrives on the bleeding edge.';

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
    <html lang='en-US' dir='ltr' className={`${inter.variable} ${zeroxproto.variable}`}>
      <body className={inter.className}>
        <DarkStoreProvider>
          <ThreeLayout camera={{ fov: 45 }}>
            <NavBar />
            <main>{children}</main>
            <Footer />
          </ThreeLayout>
        </DarkStoreProvider>
      </body>
    </html>
  );
}
