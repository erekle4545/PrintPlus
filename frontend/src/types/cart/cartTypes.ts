// types/cart/cartTypes.ts

export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    discount?: number;
    image?: string;
    color?: string;
    size?: string;
    materials?: string;
    print_type?: string;
    extras?: string[] | null;
    custom_dimensions?: string[] | null;
    uploaded_file?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface AddToCartData {
    product_id: number;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
    extras?: string[];
    materials?: string;
    print_type?: string;
    custom_dimensions?: string[];
    uploaded_file?: string;
    image?: string;
}

export interface CartStats {
    total_items: number;
    total_price: number;
}

export interface CartResponse {
    success: boolean;
    data: CartItem[];
    message?: string;
}