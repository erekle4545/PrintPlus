
export interface MenuItem {
    id: number;
    type: string;
    page_id: number | null;
    meta: Record<string, any> | null;
    active: boolean;
    order: number;
    depth: number;
    parent_id: number | null;
    _lft: number;
    _rgt: number;
    info: {
        id: number;
        menu_id: number;
        language_id: number;
        title: string;
        link: string | null;
        slug: string | null;
    };
    children?: MenuItem[];
}

export interface MenuResponse {
    data: MenuItem[];
}