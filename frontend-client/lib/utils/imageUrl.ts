/**
 * Image URL utilities
 * Provides consistent image URL generation across the application
 */

import { env } from '@/lib/config/env';

type ImageType = 'products' | 'categories' | 'reviews';

/**
 * Generate a full image URL from a relative path
 * @param path - Relative path to the image
 * @param type - Type of image (products, categories, reviews)
 * @returns Full URL to the image or placeholder
 */
export const getImageUrl = (path: string | undefined | null, type: ImageType): string => {
    // Return placeholder for empty/null paths
    if (!path) return 'https://placehold.co/600x400';

    // Return as-is if already a full URL
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    // Build URL from uploads base + type + path
    return `${env.uploadsBaseUrl}/${type}/${path}`;
};

/**
 * Convenience methods for specific image types
 */
export const imageUrl = {
    product: (path: string | undefined | null) => getImageUrl(path, 'products'),
    category: (path: string | undefined | null) => getImageUrl(path, 'categories'),
    review: (path: string | undefined | null) => getImageUrl(path, 'reviews'),
};
