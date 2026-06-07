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
                'rich-text-content prose prose-sm max-w-none',
                'p-2 sm:p-4 rounded-none',
                '[&_img]:rounded-none [&_img]:mx-auto [&_img]:my-8 [&_img]:border-none',
                '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4',
                '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3',
                '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2',
                '[&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-muted-foreground/90',
                '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-2',
                '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-2',
                '[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6',
                className
            )}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};
