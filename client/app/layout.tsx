import type { Metadata, Viewport } from 'next';
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import './globals.css';

import ApiAuthHandler from '@/components/ApiAuthHandler';
import TokenExtractor from '@/components/TokenExtractor';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full`}>
        <body className="min-h-full flex flex-col bg-background text-foreground antialiased transition-colors duration-300">
        <ClerkProvider> 
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TokenExtractor initialToken={initialToken} />
            <ApiAuthHandler />
            <main className="flex-1">
              {children}
            </main>
          </ThemeProvider>
         </ClerkProvider> 
        </body>
      </html>
  );
}
