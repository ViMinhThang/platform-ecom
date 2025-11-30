// components/layout/ClientProviders.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { ActiveThemeProvider } from '../active-theme';

interface ClientProvidersProps {
  children: React.ReactNode;
  activeThemeValue?: string;
}

export function ClientProviders({ children, activeThemeValue }: ClientProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ActiveThemeProvider initialTheme={activeThemeValue || 'light'}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </ActiveThemeProvider>
    </ThemeProvider>
  );
}
