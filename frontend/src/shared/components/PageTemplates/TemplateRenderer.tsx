'use client';

import {PAGE_TEMPLATES, PageTemplate, PageInfo, PageCover, PagePost, PageCategory} from '@/types/page/page';
import {useProducts} from '@/shared/hooks/useProducts';

import ProductsPage from "@/shared/components/PageTemplates/products/page";
import TextPage from "@/shared/components/PageTemplates/text/[slug]/page";
import CalculatePage from "@/shared/components/PageTemplates/calculate/[slug]/page";
import BrandPage from "@/shared/components/PageTemplates/brands/page";
import NotFound from "@/app/[lang]/not-found";

interface TemplateRendererProps {
    page: {
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
        page?: {
            id: number;
            template_id: number;
        }
    }
}

export default function TemplateRenderer({ page }: TemplateRendererProps) {
    const templateId = Number(page.template_id || page.page?.template_id);
    const categoryId = page.id;


    // პროდუქტების ჩატვირთვა მხოლოდ SERVICES template-სთვის
    const { products, loading, error } = useProducts(
        categoryId
        // ,templateId === PAGE_TEMPLATES.SERVICES.id
    );



    switch (templateId) {
        case PAGE_TEMPLATES.TEXT.id: // 1
            return <TextPage page={page} />;

        case PAGE_TEMPLATES.ABOUT.id: // 7
            return <TextPage page={page} />;

        case PAGE_TEMPLATES.SERVICES.id: // 8
            return <BrandPage page={page} products={products} />;

        case PAGE_TEMPLATES.CALCULATE.id: // 11
            return <CalculatePage page={page} products={products} />;

        case PAGE_TEMPLATES.PRODUCTS.id: // 12

            return <ProductsPage  page={page} products={products} />;

        default:
            return <NotFound />;
    }
}