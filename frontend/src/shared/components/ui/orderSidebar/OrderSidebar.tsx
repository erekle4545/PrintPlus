
import React from 'react';
import Button from "@/shared/components/ui/button/Button";
import ShoppingBag from '@/shared/assets/icons/cart/shopping-bag-inside.svg';
import ShoppingCart from '@/shared/assets/icons/cart/shopping-cart-white.svg';
import {useLanguage} from "@/context/LanguageContext";

interface OrderSidebarProps {
    price: number;
    quantity: number;
    onOrderClick?: () => void;
    onAddToCart?: () => void;
    isLoading?: boolean;
}

export default function OrderSidebar({
         price,
         quantity,
         onOrderClick,
         onAddToCart,
         isLoading = false
     }: OrderSidebarProps) {

    const {t} = useLanguage();

    return (
        <div className="text-center p-4 brand-order-sidebar">
            <h5 className='title_font fw-bolder text-center'>{t('price.calculation')}</h5>

            <div className="my-3 title_font fw-bolder cart-box-inside">
                <h4 className='title_font fw-bolder'>{t('total.price')}</h4>
                <h4 className='title_font my-text-blue fw-bolder'>
                    {(price * quantity).toFixed(2)} ₾
                </h4>
            </div>

            {/* ღილაკების container */}
            <div className="d-flex flex-column gap-2 align-items-center">
                {/* კალათაში დამატება - თუ onAddToCart prop არსებობს */}
                {onAddToCart && (
                    <Button
                        className='text-center title_font d-flex justify-content-center'
                        variant='my-btn-blue'
                        startIcon={<ShoppingCart key="cart" />}
                        style={{ width: '90%' }}
                        onClick={onAddToCart}
                        disabled={isLoading}
                    >
                        {isLoading ? t('sidebar.adding') : t('add_to_cart')}
                    </Button>
                )}

                {/* შეკვეთის გაფორმება */}
                <Button
                    className='text-center title_font d-flex justify-content-center'
                    variant='my-btn-blue'
                    startIcon={<ShoppingBag key="order" />}
                    style={{ width: '90%' }}
                    onClick={onOrderClick}
                    disabled={isLoading}
                >
                    {isLoading ? t('processing') : t('order')}
                </Button>
            </div>
        </div>
    );
}

// import React from 'react';
// import Button from "@/shared/components/ui/button/Button";
// import ShoppingBag from '@/shared/assets/icons/cart/shopping-bag-inside.svg';
// import ShoppingCart from '@/shared/assets/icons/cart/shopping-cart-white.svg';
// import {useLanguage} from "@/context/LanguageContext";
//
// interface OrderSidebarProps {
//     price: number;
//     quantity: number;
//     onOrderClick?: () => void;
//     onAddToCart?: () => void;
//     isLoading?: boolean;
// }
//
// export default function OrderSidebar({
//              price,
//              quantity,
//              onOrderClick,
//              onAddToCart,
//              isLoading = false
//          }: OrderSidebarProps) {
//
//     const {t} = useLanguage();
//
//     return (
//         <div className="text-center p-4 brand-order-sidebar">
//             <h5 className='title_font fw-bolder text-center'>ფასის კალკულაცია</h5>
//
//             <div className="my-3 title_font fw-bolder cart-box-inside">
//                 <h4 className='title_font fw-bolder'>ჯამური ფასი</h4>
//                 <h4 className='title_font my-text-blue fw-bolder'>
//                     {(price * quantity).toFixed(2)} ₾
//                 </h4>
//             </div>
//
//             {/* ღილაკების container */}
//             <div className="d-flex flex-column gap-2 align-items-center">
//                 {/* კალათაში დამატება - თუ onAddToCart prop არსებობს */}
//                 {onAddToCart && (
//                     <Button
//                         className='text-center title_font d-flex justify-content-center'
//                         variant='my-btn-blue'
//                         startIcon={<ShoppingCart key="cart" />}
//                         style={{ width: '90%' }}
//                         onClick={onAddToCart}
//                         disabled={isLoading}
//                     >
//                         {isLoading ? 'დამატება...' : 'კალათაში დამატება'}
//                     </Button>
//                 )}
//
//                 {/* შეკვეთის გაფორმება */}
//                 <Button
//                     className='text-center title_font d-flex justify-content-center'
//                     variant='my-btn-blue'
//                     startIcon={<ShoppingBag key="order" />}
//                     style={{ width: '90%' }}
//                     onClick={onOrderClick}
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'დამუშავება...' : 'შეკვეთა'}
//                 </Button>
//             </div>
//         </div>
//     );
// }
//