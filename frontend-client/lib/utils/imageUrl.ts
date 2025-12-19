import { env } from '@/lib/config/env';



const generateImageUrl = (path: string | undefined | null, folder: string, placeholder: string = 'https://placehold.co/600x400'): string => {
    if (!path) return placeholder;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${env.uploadsBaseUrl}/${folder}/${path}`;
};

export const imageUrl = {
    product: (path: string | undefined | null) => generateImageUrl(path, 'products'),
    category: (path: string | undefined | null) => generateImageUrl(path, 'products'),
    review: (path: string | undefined | null) => generateImageUrl(path, 'products'),
    avatar: (path: string | undefined | null) => generateImageUrl(path, 'products', 'https://placehold.co/100x100?text=User'),
};
