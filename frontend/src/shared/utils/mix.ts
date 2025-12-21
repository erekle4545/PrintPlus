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