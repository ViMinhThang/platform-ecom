import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-56px)]'>
          <div className='p-6 flex flex-1'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='p-6 flex flex-1'>{children}</div>
      )}
    </>
  );
}
