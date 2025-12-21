// shared/hooks/useProducts.ts
import {useState, useEffect} from 'react';
import {getProductsByCategory} from '@/shared/api/products';
import {useLanguage} from "@/context/LanguageContext";

interface Product {
    id: number;
    info?: {
        title?: string;
        slug?: string;
        covers?: any;
    };
}

export function useProducts(categoryId: number | undefined, shouldFetch: boolean = true) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {currentLanguage} = useLanguage();

    useEffect(() => {
        if (!shouldFetch || !categoryId) {
            return;
        }

        setLoading(true);
        setError(null);

        getProductsByCategory(categoryId,currentLanguage?.id)
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setError(err.message || 'Failed to fetch products');
                setLoading(false);
            });
    }, [categoryId, shouldFetch]);

    return { products, loading, error };
}