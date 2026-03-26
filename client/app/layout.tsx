import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import './globals.css';
import LenisProvider from '@/components/LenisProvider';
import ApiAuthHandler from '@/components/ApiAuthHandler';
import TokenExtractor from '@/components/TokenExtractor';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'MnemoAI — Your Second Brain for the Internet',
  description:
    'Save articles, tweets, videos and PDFs. MnemoAI automatically organizes, tags and resurfaces your saved knowledge with AI-powered semantic search and graph visualization.',
  keywords: ['AI knowledge management', 'personal knowledge base', 'semantic search', 'second brain', 'AI bookmarks'],
  authors: [{ name: 'MnemoAI' }],
  openGraph: {
    title: 'MnemoAI — Your Second Brain for the Internet',
    description: 'Intelligent memory system that automatically organizes and resurfaces your saved knowledge.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MnemoAI — Your Second Brain for the Internet',
    description: 'Save, organize, and rediscover knowledge with AI.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: '#080810',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getToken } = await auth();
  const initialToken = await getToken();

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
        <body className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
          <h1>HELLOW</h1>
        {/* <ClerkProvider> */}
          <TokenExtractor initialToken={initialToken} />
          <ApiAuthHandler />
          <LenisProvider>
            <main className="flex-1">
              {children}
            </main>
          </LenisProvider>
        {/* </ClerkProvider> */}
        </body>
      </html>
  );
}
