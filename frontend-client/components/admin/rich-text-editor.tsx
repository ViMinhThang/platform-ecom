'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
    IconBold,
    IconItalic,
    IconStrikethrough,
    IconCode,
    IconList,
    IconListNumbers,
    IconQuote,
    IconArrowBackUp,
    IconArrowForwardUp,
    IconH1,
    IconH2,
    IconH3,
    IconLink,
    IconPhoto
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { descriptionImageService } from '@/lib/services/description-image-service';
import { toast } from 'sonner';
import { env } from '@/lib/config/env';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    productId: number;
}

const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            'data-image-id': {
                default: null,
            },
        };
    },
});

const MenuBar = ({ editor, productId }: { editor: any, productId: number }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0];
                try {
                    const uploaded = await descriptionImageService.uploadImage(productId, file);
                    const fullUrl = `${env.uploadsBaseUrl}/${uploaded.imageUrl}`;
                    editor.chain().focus().setImage({
                        src: fullUrl,
                        'data-image-id': uploaded.id
                    }).run();
                    toast.success('Đã tải ảnh lên');
                } catch (error) {
                    console.error('Upload failed:', error);
                    toast.error('Không thể tải ảnh lên');
                }
            }
        };
        input.click();
    };

    return (
        <div className='flex flex-wrap gap-1 border-b p-2 bg-muted/50'>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn(editor.isActive('heading', { level: 1 }) && 'bg-accent')}
            >
                <IconH1 size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn(editor.isActive('heading', { level: 2 }) && 'bg-accent')}
            >
                <IconH2 size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn(editor.isActive('heading', { level: 3 }) && 'bg-accent')}
            >
                <IconH3 size={18} />
            </Button>
            <div className='w-[1px] h-8 bg-border mx-1' />
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(editor.isActive('bold') && 'bg-accent')}
            >
                <IconBold size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(editor.isActive('italic') && 'bg-accent')}
            >
                <IconItalic size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn(editor.isActive('strike') && 'bg-accent')}
            >
                <IconStrikethrough size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={cn(editor.isActive('code') && 'bg-accent')}
            >
                <IconCode size={18} />
            </Button>
            <div className='w-[1px] h-8 bg-border mx-1' />
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(editor.isActive('bulletList') && 'bg-accent')}
            >
                <IconList size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(editor.isActive('orderedList') && 'bg-accent')}
            >
                <IconListNumbers size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(editor.isActive('blockquote') && 'bg-accent')}
            >
                <IconQuote size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={setLink}
                className={cn(editor.isActive('link') && 'bg-accent')}
            >
                <IconLink size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={addImage}
            >
                <IconPhoto size={18} />
            </Button>
            <div className='w-[1px] h-8 bg-border mx-1' />
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().undo().run()}
            >
                <IconArrowBackUp size={18} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => editor.chain().focus().redo().run()}
            >
                <IconArrowForwardUp size={18} />
            </Button>
        </div>
    );
};

export const RichTextEditor = ({ value, onChange, className, productId }: RichTextEditorProps) => {
    const previousImageIds = useRef<Set<number>>(new Set());

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false
            }),
            CustomImage.configure({
                HTMLAttributes: {
                    class: 'rounded-lg shadow-sm max-h-[500px] w-auto mx-auto my-4',
                },
            }),
            Placeholder.configure({
                placeholder: 'Nhập nội dung...'
            }),
        ],
        immediatelyRender: false,
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);

            const currentImageIds = new Set<number>();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            doc.querySelectorAll('img').forEach(img => {
                const id = img.getAttribute('data-image-id');
                if (id) currentImageIds.add(parseInt(id));
            });

            previousImageIds.current.forEach(id => {
                if (!currentImageIds.has(id)) {
                    descriptionImageService.deleteImage(productId, id)
                        .catch(err => console.error('Failed to mark image as deleted:', err));
                }
            });

            previousImageIds.current = currentImageIds;
        }
    });

    useEffect(() => {
        if (editor && value !== undefined) {
            // Normalize HTML by removing trailing newlines for comparison
            const currentHTML = editor.getHTML()?.replace(/\n$/, '') || '';
            const newValue = value?.replace(/\n$/, '') || '';

            if (currentHTML !== newValue) {
                // Use type assertion to handle TipTap's complex type signature
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (editor.commands as any).setContent(value, false);

                const currentImageIds = new Set<number>();
                const doc = new DOMParser().parseFromString(value, 'text/html');
                doc.querySelectorAll('img').forEach(img => {
                    const id = img.getAttribute('data-image-id');
                    if (id) currentImageIds.add(parseInt(id));
                });
                previousImageIds.current = currentImageIds;
            }
        }
    }, [value, editor]);

    return (
        <div className={cn('flex flex-col border rounded-md overflow-hidden', className)}>
            <MenuBar editor={editor} productId={productId} />
            <EditorContent
                editor={editor}
                className='flex-1 p-4 prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px]'
            />
        </div>
    );
};
