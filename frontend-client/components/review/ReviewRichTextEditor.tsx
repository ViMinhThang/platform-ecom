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
                className={cn('size-8', editor.isActive('bold') && 'bg-accent')}
                title="In đậm"
            >
                <IconBold size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn('size-8', editor.isActive('italic') && 'bg-accent')}
                title="In nghiêng"
            >
                <IconItalic size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn('size-8', editor.isActive('strike') && 'bg-accent')}
                title="Gạch ngang"
            >
                <IconStrikethrough size={16} />
            </Button>

            <div className='w-[1px] h-6 bg-border mx-1 my-auto' />

            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn('size-8', editor.isActive('bulletList') && 'bg-accent')}
                title="Danh sách gạch đầu dòng"
            >
                <IconList size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn('size-8', editor.isActive('orderedList') && 'bg-accent')}
                title="Danh sách đánh số"
            >
                <IconListNumbers size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn('size-8', editor.isActive('blockquote') && 'bg-accent')}
                title="Trích dẫn"
            >
                <IconQuote size={16} />
            </Button>

            <div className='w-[1px] h-6 bg-border mx-1 my-auto' />

            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className='size-8'
                title="Hoàn tác"
            >
                <IconArrowBackUp size={16} />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className='size-8'
                title="Làm lại"
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
                placeholder: placeholder || 'Viết đánh giá của bạn...',
            }),
        ],
        immediatelyRender: false,
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[150px] p-4 prose prose-sm max-w-none',
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
