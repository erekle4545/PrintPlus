'use client';

import { Product } from '@/types/product/productTypes';
import {useCart} from "@/shared/hooks/useCart";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addItem } = useCart();

    return (
        <div className="card">
            {/*<img src={product.image} className="card-img-top" />*/}
            {/*<div className="card-body">*/}
            {/*    <h5>{product.name}</h5>*/}
            {/*    <p>{product.price} ₾</p>*/}
            {/*    <button*/}
            {/*        onClick={() =>*/}
            {/*            addItem({*/}
            {/*                id: product.id,*/}
            {/*                name: product.name,*/}
            {/*                price: product.price,*/}
            {/*                image: product.image,*/}
            {/*                quantity: 1,*/}
            {/*                discount: product.discount,*/}
            {/*            })*/}
            {/*        }*/}
            {/*        className="btn btn-primary"*/}
            {/*    >*/}
            {/*        დამატება*/}
            {/*    </button>*/}
            {/*</div>*/}
        </div>
    );
}
