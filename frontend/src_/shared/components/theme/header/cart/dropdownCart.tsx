"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TrashIcon from '@/shared/assets/icons/cart/trash.svg';
import Button from "@/shared/components/ui/button/Button";
import { useCart } from "@/shared/hooks/useCart";

interface DropdownCartProps {
    onClose?: () => void;
}

const DropdownCart: React.FC<DropdownCartProps> = ({ onClose }) => {
    const router = useRouter();
    const { items, updateQuantity, removeItem, total, loading } = useCart();

    const handleDecrease = async (id: number, qty: number) => {
        if (qty <= 1) return;
        await updateQuantity(id, qty - 1);
    };

    const handleIncrease = async (id: number, qty: number) => {
        await updateQuantity(id, qty + 1);
    };

    const handleRemove = async (id: number) => {
        await removeItem(id);
    };

    const handleViewCart = () => {
        router.push('/cart');
        onClose?.();
    };

    const handleCheckout = () => {
        router.push('/checkout');
        onClose?.();
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="position-relative">
            {/* Desktop arrow */}
            <div className="position-absolute top-0 start-50 translate-middle" style={{ marginTop: '-20px' }}>
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: '10px solid white',
                    }}
                />
            </div>

            {/* Close button */}
            <button
                className="position-absolute cart-hover-panel-close-mob top-0 end-0 m-2 btn-close"
                style={{ zIndex: 1060 }}
                aria-label="Close"
                onClick={onClose}
            />

            {/* Header */}
            <div className="text-black">
                <h5 className="text-center title_font_bold m-0">ჩემი კალათა</h5>
                <p className="text-center text_font m-1">
                    {items.length === 0 ? 'კალათა ცარიელია' : 'პროდუქცია'}
                </p>
            </div>

            {/* Cart items */}
            {items.length === 0 ? (
                <div className="text-center py-4 text-muted">
                    <p>თქვენი კალათა ცარიელია</p>
                </div>
            ) : (
                <>
                    <div className="d-flex flex-column gap-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {items.map((item) => {
                            const hasDiscount = !!item.discount && item.discount > 0;
                            const discountedPrice = hasDiscount
                                ? item.price * (1 - (item.discount ?? 0) / 100)
                                : item.price;

                            return (
                                <div
                                    key={item.id}
                                    className="d-flex card-text-color gap-3 cart-dropdown-items-box pb-3 align-items-center"
                                >
                                    {/* Product Image */}
                                    <Image
                                        src={item.image || "/assets/img/products/pro_1.png"}
                                        width={60}
                                        height={60}
                                        alt={item.name}
                                        className="border rounded"
                                        style={{ objectFit: 'cover' }}
                                    />

                                    {/* Product Info */}
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-truncate" style={{ maxWidth: '150px' }}>
                                            {item.name}
                                        </div>

                                        {/* Price */}
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className="fw-bold text-dark" style={{ fontSize: '16px' }}>
                                                {discountedPrice} ₾
                                            </span>
                                            {hasDiscount && (
                                                <>
                                                    <span className="text-decoration-line-through cart-dropdown-min-sale-price">
                                                        {item.price.toFixed(2)}₾
                                                    </span>
                                                    <span className="sale-cart-dropdown-product title_font">
                                                        -{item.discount}%
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Extras info */}
                                        {/*{item.extras && item.extras.length > 0 && (*/}
                                        {/*    <div className="text-muted small mt-1">*/}
                                        {/*        {item.extras.slice(0, 2).join(', ')}*/}
                                        {/*        {item.extras.length > 2 && '...'}*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </div>

                                    {/* Actions */}
                                    <div className="d-flex flex-column align-items-end justify-content-between">
                                        {/* Remove button */}
                                        <button
                                            className="bg-transparent border-0 p-0 mb-2"
                                            onClick={() => handleRemove(item.id)}
                                            disabled={loading}
                                            title="წაშლა"
                                        >
                                            <TrashIcon />
                                        </button>

                                        {/* Quantity selector */}
                                        <div className="quantity-selector d-flex align-items-center">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleDecrease(item.id, item.quantity)}
                                                disabled={loading || item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleIncrease(item.id, item.quantity)}
                                                disabled={loading}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="col-xl-6">
                                <h3 className="m-0" style={{ fontSize: '24px', color: '#232323' }}>
                                    სულ: {total.toFixed(2)}₾
                                </h3>
                            </div>
                            <div className="col-xl-6 d-flex justify-content-end gap-2">
                                <Button
                                    className="title_font fw-bolder"
                                    variant="my-btn-dark"
                                    onClick={handleViewCart}
                                    disabled={loading}
                                >
                                    ნახვა ({totalItems})
                                </Button>
                                <Button
                                    className="title_font fw-bolder"
                                    variant="my-btn-blue"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    ყიდვა
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DropdownCart;

// import React from 'react';
// import Image from 'next/image';
// import TrashIcon from '../../../../assets/icons/cart/trash.svg';
// import Button from "@/shared/components/ui/button/Button";
//
// const DropdownCart = () => {
//
//     return (
//             <div className="position-relative">
//                 {/*  desktop */}
//                     <div className="position-absolute top-0 start-50 translate-middle" style={{ marginTop: '-20px' }}>
//                         <div
//                             style={{
//                                 width: 0,
//                                 height: 0,
//                                 borderLeft: '10px solid transparent',
//                                 borderRight: '10px solid transparent',
//                                 borderBottom: '10px solid white',
//                             }}
//                         />
//                     </div>
//
//                 {/* X*/}
//                 <button
//                     className="position-absolute cart-hover-panel-close-mob top-0 end-0 m-2 btn-close"
//                     style={{ zIndex: 1060 }}
//                     aria-label="Close"
//                 />
//
//                 {/* Header */}
//                 <div className="  text-black">
//                     <h5 className="text-center title_font_bold m-0">ჩემი კალათა</h5>
//                     <p className="text-center text_font m-1">მზა პროდუქცია</p>
//                 </div>
//
//
//                 <div className="d-flex flex-column gap-3">
//                     {[1, 2, 3].map((item) => (
//                         <div key={item} className="d-flex card-text-color gap-3 cart-dropdown-items-box pb-3 align-items-center">
//                             <Image src="/assets/img/example/picture.jpg" width={60} height={60} alt="product" className="border rounded" />
//                             <div className="flex-grow-1">
//                                 <div className="fw-bold">საკანცელარიო</div>
//                                 <div className="d-flex align-items-center gap-2 mt-1">
//                                     <span className="fw-bold text-dark" style={{ fontSize: '16px' }}>10₾</span>
//                                     <span className=" text-decoration-line-through cart-dropdown-min-sale-price " >30₾</span>
//                                     <span className=" sale-cart-dropdown-product title_font  " >
//                                       -30%
//                                     </span>
//                                 </div>
//                             </div>
//
//                             <div className="d-flex flex-column align-items-end justify-content-between">
//                                 <button className="bg-transparent border-0 p-0 mb-2">
//                                     <TrashIcon />
//                                 </button>
//                                 <div className="quantity-selector d-flex align-items-center">
//                                     <button className="quantity-btn">-</button>
//                                     <span className="quantity-value">1</span>
//                                     <button className="quantity-btn">+</button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//
//                 {/* Footer */}
//                 <div className="mt-4 ">
//                     <div className="d-flex justify-content-between  align-items-center  ">
//                         <div className="col-xl-6">
//                             <h3 className="  m-0" style={{ fontSize: '24px',color:'#232323' }}>სულ: 130₾</h3>
//                         </div>
//                         <div className="col-xl-6 d-flex justify-content-end gap-2">
//                             <Button className="title_font fw-bolder" variant="my-btn-dark">ნახვა (7)</Button>
//                             <Button className="title_font fw-bolder" variant="my-btn-blue">ყიდვა</Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//     );
// };
//
// export default DropdownCart;
