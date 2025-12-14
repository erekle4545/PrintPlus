import React from 'react';
import Button from "@/shared/components/ui/button/Button";
import ShoppingBag from '@/shared/assets/icons/cart/shopping-bag-inside.svg';

interface OrderSidebarProps {
    price: number;
    quantity: number;
    onOrderClick?: () => void;
}

export default function OrderSidebar({ price, quantity, onOrderClick }: OrderSidebarProps) {
    return (
        <div className="text-center p-4 brand-order-sidebar">
            <h5 className='title_font fw-bolder text-center'>ფასის კალკულაცია</h5>
            <div className="my-3 title_font fw-bolder cart-box-inside">
                <h4 className='title_font fw-bolder'>ჯამური ფასი</h4>
                <h4 className='title_font my-text-blue fw-bolder'>{price * quantity} ₾</h4>
            </div>
            <Button
                className={'text-center title_font d-flex justify-content-center'}
                variant={'my-btn-blue'}
                startIcon={<ShoppingBag key={1} />}
                style={{ width: '90%' }}
                onClick={onOrderClick}
            >
                შეკვეთა
            </Button>
        </div>
    );
}