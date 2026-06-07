import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ThemeSelector } from '../theme-selector';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import CtaGithub from './cta-github';

export default function Header() {
  return (
    <header className='flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-3 px-4'>
        <SidebarTrigger className='-ml-1 size-8' />
        <Separator orientation='vertical' className='mr-1 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 pr-4'>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <CtaGithub />
        <Separator orientation='vertical' className='mx-1 h-6' />
        <UserNav />
        <ModeToggle />
        <ThemeSelector />
      </div>
    </header>
  );
}
