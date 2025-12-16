// app/[lang]/[slug]/DynamicPageClient.tsx
'use client';

import { usePage } from '@/shared/hooks/usePage';
import { useLanguage } from '@/context/LanguageContext';
import TemplateRenderer from '@/shared/components/PageTemplates/TemplateRenderer';

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
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (<>
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">{t('page_not_found', 'გვერდი ვერ მოიძებნა')}</h4>
                    <p>{error || t('page_not_exist', 'მოთხოვნილი გვერდი არ არსებობს')}</p>
                </div>
            </div></>
        );
    }

    return <TemplateRenderer page={page} />;
}