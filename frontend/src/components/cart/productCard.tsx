// components/ProductCard.tsx

'use client'; // ✅ ეს აუცილებელია თუ იყენებ useState/useCart hooks

import { useCart } from '@/features/cart/context/CartContext';
import { Product } from '@/types/product/productTypes';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addItem } = useCart();

    return (
        <div className="card">
            <img src={product.image} className="card-img-top" />
            <div className="card-body">
                <h5>{product.name}</h5>
                <p>{product.price} ₾</p>
                <button onClick={() => addItem({ ...product, quantity: 1 })} className="btn btn-primary">
                    დამატება
                </button>
            </div>
        </div>
    );
}
