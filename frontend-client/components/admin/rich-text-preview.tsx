'use client';

import { cn } from '@/lib/utils';

interface RichTextPreviewProps {
    content: string;
    className?: string;
}

export const RichTextPreview = ({ content, className }: RichTextPreviewProps) => {
    return (
        <div
            className={cn(
                'prose prose-sm dark:prose-invert max-w-none p-4 min-h-[400px]',
                className
            )}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};
