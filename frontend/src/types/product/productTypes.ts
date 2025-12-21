export interface Product {
    id: number;
    category_id: number;
    price: number;
    info:ProductInfo
}

export interface ProductInfo {
    id: number;
    product_id: number;
    language_id: number;
    description: number;
    title: number;
    price: number;
}


