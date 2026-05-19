'use client';

import { IconX, IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, {
    type DropzoneProps,
    type FileRejection
} from 'react-dropzone';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils/index';

export interface ReviewImageUploaderProps {
    value?: File[];
    onChange?: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number;
}

export function ReviewImageUploader({
    value = [],
    onChange,
    maxFiles = 5,
    maxSize = 1024 * 1024 * 5, // 5MB
}: ReviewImageUploaderProps) {
    const onDrop = React.useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (value.length + acceptedFiles.length > maxFiles) {
                toast.error(`You can only upload up to ${maxFiles} images`);
                return;
            }

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            );

            const updatedFiles = [...value, ...newFiles];
            onChange?.(updatedFiles);

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ file, errors }) => {
                    if (errors[0]?.code === 'file-too-large') {
                        toast.error(`File ${file.name} is too large. Max size is ${formatBytes(maxSize)}`);
                    } else {
                        toast.error(`File ${file.name} was rejected`);
                    }
                });
            }
        },
        [value, maxFiles, maxSize, onChange]
    );

    const removeFile = (index: number) => {
        const file = value[index];
        if (file && 'preview' in file) {
            URL.revokeObjectURL((file as any).preview);
        }
        const newFiles = value.filter((_, i) => i !== index);
        onChange?.(newFiles);
    };

    // Cleanup object URLs on unmount
    React.useEffect(() => {
        return () => {
            value.forEach((file) => {
                if ('preview' in file) {
                    URL.revokeObjectURL((file as any).preview);
                }
            });
        };
    }, []);

    return (
        <div className="space-y-4">
            <Dropzone
                onDrop={onDrop}
                accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}
                maxSize={maxSize}
                maxFiles={maxFiles}
                disabled={value.length >= maxFiles}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                        {...getRootProps()}
                        className={cn(
                            'border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[100px]',
                            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
                            value.length >= maxFiles && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <input {...getInputProps()} />
                        <IconUpload className="w-6 h-6 text-muted-foreground" />
                        <div className="text-center">
                            <p className="text-sm font-medium">
                                Click or drag images to upload
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Up to {maxFiles} images. Max {formatBytes(maxSize)} each.
                            </p>
                        </div>
                    </div>
                )}
            </Dropzone>

            {value.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {value.map((file, index) => (
                        <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
                            <Image
                                src={(file as any).preview || ''}
                                alt={file.name}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <IconX size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
