// components/layout/ClientProviders.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import { useTheme } from 'next-themes';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { ActiveThemeProvider } from '../active-theme';

interface ClientProvidersProps {
  children: React.ReactNode;
  activeThemeValue?: string;
}

export function ClientProviders({ children, activeThemeValue }: ClientProvidersProps) {
  const { resolvedTheme } = useTheme();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ActiveThemeProvider initialTheme={activeThemeValue || resolvedTheme || 'light'}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </ActiveThemeProvider>
    </ThemeProvider>
  );
}
