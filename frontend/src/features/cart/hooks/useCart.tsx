// ✅ useCart hook - კალათის ლოგიკა

import { useState } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    discount?: number; // პროცენტულად, optional
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: CartItem) => {
        setItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
            }
            return [...prev, item];
        });
    };

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => {
        const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return sum + price * item.quantity;
    }, 0);

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
    };
}
