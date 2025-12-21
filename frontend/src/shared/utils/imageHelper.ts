// utils/imageHelper.ts
import { PageCover } from '@/types/page/page';

interface ImageHelperOptions {
    /**
     * How many images to return
     * - 1: Only the first image
     * - 'all': All images
     */
    count?: 1 | 'all';

    /**
     * Filter by cover_type
     */
    coverType?: number;

    /**
     * Prefer original image (output_path) or processed image (path)
     * - 'original': Use output_path
     * - 'processed': Use path
     * Default: 'original'
     */
    imageType?: 'original' | 'processed';

    /**
     * Fallback image if none found
     */
    fallback?: string;
}

/**
 * Get the appropriate path from PageCover based on imageType preference
 */
export function getCoverPath(cover: PageCover, imageType: 'original' | 'processed' = 'original'): string | null {
    if (imageType === 'original') {
        return cover.path;
    }
    return cover.output_path;

}

/**
 * Get full image URL from Laravel storage path
 */
export function getImageUrl(path: string | null | undefined): string {
    if (!path) {
        return getNoImagePath();
    }

    // If already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Paths from Laravel typically start with 'storage/' or 'uploads/'
    const fileUrl = process.env.NEXT_PUBLIC_FILE_URL || 'http://localhost:8000/';

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Build full URL
    return `${fileUrl}${cleanPath}`;
}

/**
 * Get no image placeholder path (local Next.js public folder)
 */
export function getNoImagePath(): string {
    return `/assets/img/no_img/Image-not-found.png`;
}

/**
 * Image helper function
 * @param covers - PageCover array
 * @param options - Additional parameters
 * @returns Image path(s)
 */
export function getImages(
    covers: PageCover[] | undefined,
    options: ImageHelperOptions = {}
): string | string[] | null {
    const { count = 1, coverType, imageType = 'original', fallback = null } = options;

    // If covers don't exist or are empty
    if (!covers || covers.length === 0) {
        return fallback;
    }

    // Filter by cover_type
    let filteredCovers = covers;
    if (coverType !== undefined) {
        filteredCovers = covers.filter(cover => cover.cover_type === coverType);
    }

    // If nothing left after filtering
    if (filteredCovers.length === 0) {
        return fallback;
    }

    // If we only want one image
    if (count === 1) {
        const coverPath = getCoverPath(filteredCovers[0], imageType);
        return getImageUrl(coverPath);
    }

    // If we want all images
    return filteredCovers.map(cover => {
        const coverPath = getCoverPath(cover, imageType);
        return getImageUrl(coverPath);
    });
}

/**
 * Simple version - only first image
 */
export function getFirstImage(
    covers: PageCover[] | undefined,
    coverType?: number,
    imageType: 'original' | 'processed' = 'original',
    fallback?: string
): string {
    const defaultFallback = fallback || getNoImagePath();
    const result = getImages(covers, { count: 1, coverType, imageType, fallback: defaultFallback });
    return typeof result === 'string' ? result : defaultFallback;
}

/**
 * Get all images
 */
export function getAllImages(
    covers: PageCover[] | undefined,
    coverType?: number,
    imageType: 'original' | 'processed' = 'original'
): string[] {
    const result = getImages(covers, { count: 'all', coverType, imageType });
    return Array.isArray(result) ? result : result ? [result] : [];
}