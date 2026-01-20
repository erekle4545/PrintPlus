// hooks/useMenu.ts
import {axiosInstance} from './useHttp';
import { MenuItem, MenuResponse } from '@/types/menu/menu';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export const useMenu = () => {
    const { currentLanguage } = useLanguage();
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [bottomMenu, setBottomMenu] = useState<MenuItem[]>([]);
    const [bottomMenuRules, setBottomMenuRules] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentLanguage) {
            fetchMenu();
        }
    }, [currentLanguage]);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get<MenuResponse>('/menu', {
                params: {
                    language_id: currentLanguage?.id
                }
            });

            const topMenu = response.data.data?.filter((x)=> x.type === 1 || x.type === 4);
            const bottomMenu = response.data.data?.filter((x)=> x.type === 2 || x.type === 4);
            const bottomMenuRules = response.data.data?.filter((x)=>  x.type === 5);

            setMenu(topMenu || []);
            setBottomMenu(bottomMenu || []);
            setBottomMenuRules(bottomMenuRules || []);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load menu';
            setError(errorMessage);
            console.error('Menu fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return { menu,bottomMenu,bottomMenuRules, loading, error, refetch: fetchMenu };
};