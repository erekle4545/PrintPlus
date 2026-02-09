// types/cover.ts
import {PageCover} from "@/types/page/page";

export enum CoverType {
    DEFAULT = 1,
    FACEBOOK = 2,
    SLIDER = 3,
    PROJECT_IMAGE = 4,
    PROJECT_THUMBNAIL = 5,
    MAIN_IMAGE = 6,
    USER_AVATAR = 7,
    HEADER_LOGO = 9,
    FAVICON = 10,
    FOOTER_LOGO = 13,
    GALLERY = 14,
    ICON = 15,
    SLIDER_BACKGROUND = 16,
    GALLERY_THUMB = 17,
    PAGE_COVER = 18,
}



export interface CoverConfig {
    id: number;
    description: string;
}

export const COVER_TYPES: Record<string, CoverConfig> = {
    default: {
        id: 1,
        description: 'Default Cover',
    },
    facebook: {
        id: 2,
        description: 'Facebook cover',
    },
    slider: {
        id: 3,
        description: 'Slider Cover',
    },
    project_image: {
        id: 4,
        description: 'Map Image',
    },
    project_thumbnail: {
        id: 5,
        description: 'Thumbnail Image',
    },
    main_image: {
        id: 6,
        description: 'Default Image',
    },
    user_avatar: {
        id: 7,
        description: 'User Avatar',
    },
    header_logo: {
        id: 9,
        description: 'Header logo Color',
    },
    favicon: {
        id: 10,
        description: 'Site Favicon',
    },
    footer_logo: {
        id: 13,
        description: 'Footer logo',
    },
    gallery: {
        id: 14,
        description: 'Gallery',
    },
    icon: {
        id: 15,
        description: 'Icon',
    },
    slider_background: {
        id: 16,
        description: 'Slider BackGround',
    },
    gallery_thumb: {
        id: 17,
        description: 'Gallery thumbnail',
    },
    page_cover: {
        id: 18,
        description: 'Page Background Cover',
    },
} as const;

/**
 * Get cover by type
 * @param covers - Array of covers
 * @param type - Cover type ID or key
 * @returns Cover object or null
 */
export function getCoverByType(
    covers: PageCover[] | undefined,
    type: keyof typeof COVER_TYPES | number
): PageCover | null {
    if (!covers || covers.length === 0) return null;

    const typeId = typeof type === 'number'
        ? type
        : COVER_TYPES[type]?.id;

    return covers.find(cover => cover.cover_type === typeId) || null;
}

/**
 * Get cover image path
 * @param covers - Array of covers
 * @param type - Cover type ID or key
 * @param fallback - Fallback image path
 * @returns Image path or fallback
 */
export function getCoverImage(
    covers: PageCover[] | undefined,
    type: keyof typeof COVER_TYPES | number,
    fallback: string = '/assets/img/example/cover.png'
): string {
    const cover = getCoverByType(covers, type);
    return cover?.path || fallback;
}

/**
 * Check if cover exists
 * @param covers - Array of covers
 * @param type - Cover type ID or key
 * @returns Boolean
 */
export function hasCover(
    covers: PageCover[] | undefined,
    type: keyof typeof COVER_TYPES | number
): boolean {
    return getCoverByType(covers, type) !== null;
}