// shared/api/products.ts
export async function getProductsByCategory(categoryId: number, languageId?: number): Promise<any[]> {
    try {
        const params = new URLSearchParams({
            category_id: categoryId.toString(),
        });

        if (languageId) {
            params.append('language_id', languageId.toString());
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`;


        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });


        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}