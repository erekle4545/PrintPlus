import { PageData, PAGE_TEMPLATES } from '@/types/page/page';
import ProductsPage from "@/shared/components/PageTemplates/products/page";
import TextPage from "@/shared/components/PageTemplates/text/[slug]/page";
import BordersPage from "@/shared/components/PageTemplates/borders/page";
import CalculatePage from "@/shared/components/PageTemplates/calculate/[slug]/page";
import BrandPage from "@/shared/components/PageTemplates/brands/page";

import NotFound from "@/app/[lang]/not-found";

interface TemplateRendererProps {
    page: PageData;
}

export default function TemplateRenderer({ page }: TemplateRendererProps) {

    const templateId = Number(page.template_id);

    switch (templateId) {
        case PAGE_TEMPLATES.TEXT.id: // 1
            return <TextPage page={page} />;

        // case PAGE_TEMPLATES.FORM.id: // 2
        //     return <FormPage   />;
        //
        // case PAGE_TEMPLATES.NEWS.id: // 3
        //     return <NewsPage  />;
        //
        // case PAGE_TEMPLATES.FAQ.id: // 4
        //     return <FaqPage   />;
        //
        // case PAGE_TEMPLATES.GALLERY.id: // 5
        //     return <GalleryPage   />;
        //
        // case PAGE_TEMPLATES.TEAM.id: // 6
        //     return <TeamPage   />;
        //
        // case PAGE_TEMPLATES.ABOUT.id: // 7
        //     return <AboutPage   />;
        //
        // case PAGE_TEMPLATES.SERVICES.id: // 8
        //     return <ServicesPage   />;

        case PAGE_TEMPLATES.BRANDS.id: // 9
            return <BrandPage   />;

        case PAGE_TEMPLATES.BORDERS.id: // 10
            return <BordersPage   />;

        case PAGE_TEMPLATES.CALCULATE.id: // 11
            return <CalculatePage   />;

        case PAGE_TEMPLATES.PRODUCTS.id: // 12
            return <ProductsPage  />;

        default:
            return <NotFound />;
    }
}