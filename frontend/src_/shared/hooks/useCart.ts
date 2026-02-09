import { useContext } from 'react';
import { CartContext, CartContextType } from '@/context/CartContext';

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart უნდა გამოიყენოთ CartProvider-ის შიგნით');
    }

    return context;
};