// hooks/usePage.ts
import { axiosInstance } from './useHttp';
import { PageData, PageResponse } from '@/types/page/page';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';

export const usePage = (slug: string) => {

    const { currentLanguage } = useLanguage();
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentLanguage && slug) {
            fetchPage();
        }
    }, [currentLanguage, slug]);

    const fetchPage = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get<PageResponse>(`/pages/${slug}`, {
                params: {
                    language_id: currentLanguage?.id
                }
            });

            setPage(response.data.data);
        } catch (err: any) {
            const errorMessage = err.response?.status === 404
                ? 'Page not found'
                : err.response?.data?.message || 'Failed to load page';
            setError(errorMessage);
            console.error('Page fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return { page, loading, error, refetch: fetchPage };
};