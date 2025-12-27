// shared/components/PageTemplates/TemplateDetailsPageRenderer.tsx
'use client';

import { PAGE_TEMPLATES } from '@/types/page/page';
import { Product } from "@/types/product/productTypes";

import TextPage from "@/shared/components/PageTemplates/text/[slug]/page";
import CalculatePage from "@/shared/components/PageTemplates/calculate/[slug]/page";
import BrandPage from "@/shared/components/PageTemplates/brands/page";
import NotFound from "@/app/[lang]/not-found";
import BrandPageDetails from "@/shared/components/PageTemplates/brands/[slug]/page";
import ProductDetails from "@/shared/components/PageTemplates/products/[slug]/page";

interface TemplateDetailsPageRendererProps {
    product: Product;
}

export default function TemplateDetailsPageRenderer({ product }: TemplateDetailsPageRendererProps) {
    const templateId = Number(product.category?.page?.template_id);

    switch (templateId) {
        // case PAGE_TEMPLATES.TEXT.id: // 1
        //     return <TextPage product={product} />;
        //
        // case PAGE_TEMPLATES.ABOUT.id: // 7
        //     return <TextPage product={product} />;
        //
        case PAGE_TEMPLATES.SERVICES.id: // 8
            return <BrandPageDetails product={product} />;

        // case PAGE_TEMPLATES.BORDERS.id: // 10
        //     return <BordersPage product={product} />;
        //
        // case PAGE_TEMPLATES.CALCULATE.id: // 11
        //     return <CalculatePage product={product} />;
        //
        case PAGE_TEMPLATES.PRODUCTS.id: // 12
            return <ProductDetails product={product} />;

        default:
            return <NotFound />;
    }
}