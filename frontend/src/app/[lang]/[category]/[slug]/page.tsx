import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/shared/api/products';
import { Product } from '@/types/product/productTypes';
import TemplateDetailsPageRenderer from "@/shared/components/PageTemplates/TemplateDetailsPageRenderer";
import {LanguageArr} from "@/shared/utils/mix";

interface DynamicPageProps {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
}

// Routes that have their own folders (not handled by dynamic pages)
const RESERVED_ROUTES = [
    'products',
    'cart',
    'login',
    'register',
    'profile',
    'checkout',
];

// Server Component
export default async function DynamicPageSlug({ params }: DynamicPageProps) {
    const { slug, lang } = await params;

    // If it's a reserved route, let Next.js handle it with its own folder
    if (RESERVED_ROUTES.includes(slug)) {
        notFound();
    }


    // Get language ID based on lang code
    const languageId = LanguageArr(lang.toString());

    try {
        // Fetch product on server
        const product: Product = await getProductBySlug(slug, languageId);

        if (!product) {
            notFound();
        }

        // Pass product to Template Renderer which will choose the right template
        return <TemplateDetailsPageRenderer product={product} />;

    } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
    }
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: DynamicPageProps) {
    const { slug, lang } = await params;
    const languageId = LanguageArr(lang.toString());

    try {
        const product: Product = await getProductBySlug(slug, languageId);

        if (!product) {
            return {
                title: 'Product Not Found',
            };
        }

        return {
            title: product.info.name,
            description: product.info.description || product.info.name,
            openGraph: {
                title: product.info.name,
                description: product.info.description || product.info.name,
                images: product.info.covers?.map(c => c.output_path || c.path) || [],
            },
        };
    } catch (error) {
        return {
            title: 'Product Not Found',
        };
    }
}

//
// import { notFound } from 'next/navigation';
// import DynamicProductClient from "@/app/[lang]/[category]/[slug]/DynamicProductClient";
//
// interface DynamicPageProps {
//     params: Promise<{
//         lang: string;
//         slug: string;
//     }>;
// }
//
// // Routes that have their own folders (not handled by dynamic pages)
// const RESERVED_ROUTES = [
//     'products',
//     'cart',
//     'login',
//     'register',
//     'profile',
//     'checkout',
// ];
//
// export default async function DynamicPageSlug({ params }: DynamicPageProps) {
//     const { slug } = await params;
//
//     // If it's a reserved route, let Next.js handle it with its own folder
//     if (RESERVED_ROUTES.includes(slug)) {
//         notFound();
//     }
//
//     return <DynamicProductClient slug={slug} />;
// }