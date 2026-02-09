// shared/hooks/useProducts.ts
import {useState, useEffect} from 'react';
import {getProductBySlug, getProductsByCategory} from '@/shared/api/products';
import {useLanguage} from "@/context/LanguageContext";
import {Product} from "@/types/product/productTypes";

/**
 *
 * @param categoryId
 * @param shouldFetch
 */
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


/**
 *
 * @param slug
 * @param shouldFetch
 */
export function useProduct(slug: string | undefined, shouldFetch: boolean = true) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {currentLanguage} = useLanguage();

    useEffect(() => {
        if (!shouldFetch || !slug) {
            return;
        }

        setLoading(true);
        setError(null);

        getProductBySlug(slug, currentLanguage?.id)
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setError(err.message || 'Failed to fetch product');
                setLoading(false);
            });
    }, [slug, shouldFetch, currentLanguage?.id]);

    return { product, loading, error };
}