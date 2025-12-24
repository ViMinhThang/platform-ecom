'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
    IconBold,
    IconItalic,
    IconStrikethrough,
    IconList,
    IconListNumbers,
    IconQuote,
    IconArrowBackUp,
    IconArrowForwardUp,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface ReviewRichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className='flex flex-wrap gap-1 border-b p-1.5 bg-muted/30'>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn('h-8 w-8', editor.isActive('bold') && 'bg-accent')}
                title="Bold"
            >
                <IconBold size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn('h-8 w-8', editor.isActive('italic') && 'bg-accent')}
                title="Italic"
            >
                <IconItalic size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn('h-8 w-8', editor.isActive('strike') && 'bg-accent')}
                title="Strikethrough"
            >
                <IconStrikethrough size={16} />
            </Button>

            <div className='w-[1px] h-6 bg-border mx-1 my-auto' />

            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn('h-8 w-8', editor.isActive('bulletList') && 'bg-accent')}
                title="Bullet List"
            >
                <IconList size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn('h-8 w-8', editor.isActive('orderedList') && 'bg-accent')}
                title="Ordered List"
            >
                <IconListNumbers size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn('h-8 w-8', editor.isActive('blockquote') && 'bg-accent')}
                title="Blockquote"
            >
                <IconQuote size={16} />
            </Button>

            <div className='w-[1px] h-6 bg-border mx-1 my-auto' />

            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className='h-8 w-8'
                title="Undo"
            >
                <IconArrowBackUp size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className='h-8 w-8'
                title="Redo"
            >
                <IconArrowForwardUp size={16} />
            </Button>
        </div>
    );
};

export const ReviewRichTextEditor = ({ value, onChange, placeholder, className }: ReviewRichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Write your review...',
            }),
        ],
        immediatelyRender: false,
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[150px] p-4 prose prose-sm dark:prose-invert max-w-none',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className={cn('flex flex-col border rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring transition-shadow', className)}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
