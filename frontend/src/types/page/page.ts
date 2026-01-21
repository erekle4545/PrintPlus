// types/page.ts
export type PageTemplate =
    | 'text'      // id: 1
    | 'form'      // id: 2
    | 'news'      // id: 3
    | 'faq'       // id: 4
    | 'gallery'   // id: 5
    | 'team'      // id: 6
    | 'about'     // id: 7
    | 'services'  // id: 8
    | 'brands'    // id: 9
    | 'borders'   // id: 10
    | 'calculate' // id: 11
    | 'products'; // id: 12

export const PAGE_TEMPLATES = {
    TEXT: { id: 1, name: 'text' as const, show: true },
    FORM: { id: 2, name: 'form' as const, show: false },
    NEWS: { id: 3, name: 'news' as const, show: true },
    FAQ: { id: 4, name: 'faq' as const, show: false },
    GALLERY: { id: 5, name: 'gallery' as const, show: true },
    TEAM: { id: 6, name: 'team' as const, show: true },
    ABOUT: { id: 7, name: 'about' as const, show: false },
    SERVICES: { id: 9, name: 'services' as const, show: true },
    CALCULATE: { id: 11, name: 'calculate' as const, show: true },
    PRODUCTS: { id: 12, name: 'products' as const, show: true },
} as const;

export interface PageInfo {
    slug: string;
    title:string,
    description:string,
    text:string,
    covers:PageCover[]
}

export interface PageCover{
    output_path:string,
    path:string,
    cover_type:number
}


export interface TextPages {
    id: number;
    template_id:number,
    info:PageInfo
}


export interface PagePost {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    image?: string;
    created_at: string;
}

export interface PageCategory {
    id: number;
    page:PageData,
    status:number,
    info:CategoryInfo,
}
export interface CategoryInfo {
    id:number,
    title:string,
    description:string,
    text:string,
    covers: PageCover[],
    slug:string,
    language_id:number
}

export interface PageData {
    id: number;
    type: string;
    template_id: number;
    template_name: PageTemplate;
    status: number;
    show_home_page: boolean;
    info: PageInfo;
    covers: PageCover[];
    posts: PagePost[];
    categories: PageCategory[];
}

export interface PageResponse {
    data: PageData;
}

// Helper
export const getTemplateById = (id: number) => {
    return Object.values(PAGE_TEMPLATES).find(template => template.id === id);
};

export const getTemplateByName = (name: PageTemplate) => {
    return Object.values(PAGE_TEMPLATES).find(template => template.name === name);
};