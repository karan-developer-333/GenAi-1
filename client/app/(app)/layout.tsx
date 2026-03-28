import type { Metadata, Viewport } from 'next';
import Navbar from './Navbar';
import { FloatingAssistant } from '@/components/FloatingAssistant';


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
  themeColor: '#faf8f5',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-cream)] text-[var(--text-primary)] antialiased">
              
                <Navbar  />
          <main className="flex-1 mt-12 relative">
            {children}
          </main>
          <FloatingAssistant />
      </div>
  );
}
