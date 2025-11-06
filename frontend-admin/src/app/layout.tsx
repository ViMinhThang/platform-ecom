// app/layout.tsx
import { cookies } from 'next/headers';
import { ClientProviders } from '@/components/layout/ClientProviders';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { fontVariables } from '@/lib/font';
import './globals.css';
import './theme.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('bg-background overflow-hidden font-sans antialiased', fontVariables, activeThemeValue ? `theme-${activeThemeValue}` : '', isScaled ? 'theme-scaled' : '')}>
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        <NuqsAdapter>
          <ClientProviders activeThemeValue={activeThemeValue as string}>
            <Toaster />
            {children}
          </ClientProviders>
        </NuqsAdapter>
      </body>
    </html>
  );
}
