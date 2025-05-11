import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { AppStoreProvider } from '@/lib/store';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ReflectAI',
  description: 'AI-Powered Reactive Journaling',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppStoreProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <div className="flex flex-col flex-1 min-h-screen">
              <AppHeader />
              <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
                {children}
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
        </AppStoreProvider>
      </body>
    </html>
  );
}
