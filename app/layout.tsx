import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Bookmarks - Sync your bookmarks in real-time',
  description:
    'Save, organize, and access your favorite links instantly with real-time sync across all your devices. Secure and private bookmark management.',
  openGraph: {
    title: 'Smart Bookmarks - Real-time Bookmark Manager',
    description:
      'Save and sync your bookmarks in real-time across all your devices',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Bookmarks - Real-time Bookmark Manager',
    description:
      'Save and sync your bookmarks in real-time across all your devices',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
