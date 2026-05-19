import { env } from '@/lib/config/env';



const generateImageUrl = (path: string | undefined | null, placeholder: string = 'https://placehold.co/600x400'): string => {
    if (!path) return placeholder;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${env.uploadsBaseUrl}/${path}`;
};

export const imageUrl = {
    product: (path: string | undefined | null) => generateImageUrl(path),
    category: (path: string | undefined | null) => generateImageUrl(path),
    review: (path: string | undefined | null) => generateImageUrl(path),
    avatar: (path: string | undefined | null) => generateImageUrl(path, 'https://placehold.co/100x100?text=User'),
};
