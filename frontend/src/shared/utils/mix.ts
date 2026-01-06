import {PageCover} from "@/types/page/page";

export const  AUTH_SUCCESS_ROUTES = {
    default: '/',
    admin: '/admin',
    user: '/profile',
};


/**
 * generate slug for product and pages
 * @param slug
 * @param id
 * @param type
 */
export function generateSlug(slug: string, id: number | null, type: string): string {

    return slug+`-${type||'p'}`+id;
}


/**
 *  languages
 */
type Lang = 'ka' | 'en' | 'ru' | 'de' | 'tr' | 'az';

const LANG_MAP: Record<Lang, number> = {
    ka: 1,
    en: 2,
    ru: 3,
    de: 4,
    tr: 5,
    az: 6,
};

export function LanguageArr(lang: string): number {
    if (lang in LANG_MAP) {
        return LANG_MAP[lang as Lang];
    }

    return 1; // default ka
}


