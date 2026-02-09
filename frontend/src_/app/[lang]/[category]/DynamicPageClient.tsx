'use client';

import { usePage } from '@/shared/hooks/usePage';
import { useLanguage } from '@/context/LanguageContext';
import TemplateRenderer from '@/shared/components/PageTemplates/TemplateRenderer';
import NotFound from "@/app/[lang]/not-found";

interface DynamicPageClientProps {
    slug: string;
}

export default function DynamicPageClient({ slug }: DynamicPageClientProps) {

    const { page, loading, error } = usePage(slug);

    const { t } = useLanguage();

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">იტვირთება...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (<NotFound/>);
    }

    return <TemplateRenderer page={page} />;
}