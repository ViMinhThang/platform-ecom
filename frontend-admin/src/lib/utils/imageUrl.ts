/**
 * Image URL utilities
 * Provides consistent image URL generation across the application
 */

import { env } from '@/lib/config/env';

type ImageType = 'products' | 'categories';

/**
 * Generate a full image URL from a relative path
 * @param path - Relative path to the image
 * @param type - Type of image (products, categories)
 * @returns Full URL to the image or placeholder
 */
export const getImageUrl = (path: string | undefined | null, type: ImageType): string => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${env.uploadsBaseUrl}/${type}/${path}`;
};

/**
 * Convenience methods for specific image types
 */
export const imageUrl = {
    product: (path: string | undefined | null) => getImageUrl(path, 'products'),
    category: (path: string | undefined | null) => getImageUrl(path, 'categories'),
};
