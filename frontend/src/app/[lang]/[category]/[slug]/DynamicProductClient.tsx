
'use client';

// import { useLanguage } from '@/context/LanguageContext';
// import { useProduct } from "@/shared/hooks/useProducts";
import TemplateDetailsPageRenderer from "@/shared/components/PageTemplates/TemplateDetailsPageRenderer";
import {Product} from "@/types/product/productTypes";

interface DynamicProductClientProps {
    product: Product;
}

export default function DynamicProductClient({ product }: DynamicProductClientProps) {
    // const { product, loading, error } = useProduct(slug);
    // const { t } = useLanguage();

    // if (loading) {
    //     return (
    //         <div className="container py-5">
    //             <div className="text-center">
    //                 <div className="spinner-border" role="status">
    //                     <span className="visually-hidden">იტვირთება...</span>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }
    //
    // if (error || !product) {
    //     return (
    //         <div className="container py-5">
    //             <div className="alert alert-danger" role="alert">
    //                 <h4 className="alert-heading">{t('page_not_found', 'გვერდი ვერ მოიძებნა')}</h4>
    //                 <p>{error || t('page_not_exist', 'მოთხოვნილი გვერდი არ არსებობს')}</p>
    //             </div>
    //         </div>
    //     );
    // }

    return <TemplateDetailsPageRenderer product={product} />;
}