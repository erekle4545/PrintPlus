"use client";

import Image from "next/image";

import {  X } from "lucide-react";
import styles from "./Cart.module.css";
import {useCart} from "@/features/cart/hooks/useCart";
import Cover from "@/components/theme/header/cover/cover";
import CartIsEmptyIcon from "@/assets/icons/cart/bg-inside.svg";
import Button from "@/components/ui/button/Button";
import {useRouter} from "next/navigation";
import RemoveIcon from "@/assets/icons/delete/remove.svg";
import WhiteShoppingCart from "@/assets/icons/cart/shopping-cart-white.svg";
 export default function Cart() {
     const router = useRouter();

    const { items, updateQuantity, removeItem, clearCart, total } = useCart();

    const handleDecrease = (id: number, qty: number) => {
        if (qty <= 1) return;
        updateQuantity(id, qty - 1);
    };

    const handleIncrease = (id: number, qty: number) => {
        updateQuantity(id, qty + 1);
    };

    const handleBuyItem = (id: number) => {
        // TODO: აქ შეაერთე checkout ლოგიკას
        console.log("Buy single item", id);
    };

    const handleBuyAll = () => {
        // TODO: აქცეც checkout all ლოგიკა
        console.log("Buy all items", items);
    };

    if (items.length === 0) {
        return (
            <div className={`container text-center ${styles.cartWrapper}`}>
                <h2 className={'fw-bolder p-2 text-center title_font'}>კალათა</h2>
                <div className=' text-muted '>
                    <h3 className='title_font'>კალათა ცარიელია </h3>
                    <CartIsEmptyIcon/>
                    <div>
                        <Button className={'m-5'} type={'button'}  onClick={()=>  router.push('/') } variant={'my-btn-blue'}  > ნახე პროდუქტები </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
            <>
                <Cover/>
                <div className={`container ${styles.cartWrapper}`}>
                    <h2 className={'fw-bolder p-2 text-center title_font'}>კალათა</h2>
                    {/*<HeaderTitle title="კალათა" slug={[]} />*/}

                    <div className={styles.cartList}>
                        {items.map((item) => {
                            const hasDiscount = !!item.discount && item.discount > 0;
                            const discountedPrice = hasDiscount
                                ? item.price * (1 - (item.discount ?? 0) / 100)
                                : item.price;
                            return (
                                <div key={item.id} className={` justify-content-between align-items-center text-center ${styles.cartItem}`}>
                                    {/* left side */}
                                    <div className={styles.itemImageWrap}>
                                        <Image
                                            src={'/assets/img/products/pro_1.png'}
                                            alt={item.name}
                                            width={120}
                                            height={120}
                                            className={styles.itemImage}
                                        />
                                    </div>

                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemTitle}>{item.name}</div>
                                         {/*<div className={styles.itemSubtitle}>ბალიში ნარინჯისფერი</div>*/}
                                    </div>

                                    {/* qty */}
                                    <div className={styles.qtyBlock}>
                                        <span className={styles.qtyLabel}>რაოდენობა</span>
                                        <div className={styles.qtyBox}>
                                            <button
                                                type="button"
                                                className={styles.qtyBtn}
                                                onClick={() =>
                                                    handleDecrease(item.id, item.quantity)
                                                }
                                            >
                                                −
                                            </button>
                                            <span className={styles.qtyValue}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                className={styles.qtyBtn}
                                                onClick={() =>
                                                    handleIncrease(item.id, item.quantity)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* price */}
                                    <div className={styles.priceBlock}>
                                        <span className={styles.priceLabel}>ფასი</span>
                                        <div className={styles.priceRow}>
                                            <span className={styles.priceCurrent}>
                                                {discountedPrice.toFixed(2)}₾
                                            </span>
                                            {hasDiscount && (
                                                <>
                                                    <span className={styles.priceOld}>
                                                        {item.price.toFixed(2)}₾
                                                    </span>
                                                    <span className={styles.discountBadge}>
                                                        -{item.discount}%
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>



                                    {/* right side delete  */}
                                    <div className={styles.itemRight}>

                                            <button
                                                title={'წაშლა'}
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => removeItem(item.id)}
                                                aria-label="წაშლა"
                                            >
                                                <X size={18} />
                                            </button>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ქვედა ზოლი – ყველა ერთად */}
                    <div className={styles.bottomBar}>
                        <div className="d-flex justify-content-between align-items-center gap-2 ">
                            <div>
                                <h5 className="m-1 text_font">ჯამური თანხა:</h5>
                            </div>
                            <div>
                                <h3 className="fw-bolder m-0 text_font">{total.toFixed(2)}₾</h3>
                            </div>
                        </div>

                        <div className={styles.bottomActions}>

                            <Button
                                type={'button'}
                                onClick={clearCart}
                                startIcon={<RemoveIcon/> }
                                variant={'my-btn-danger'}
                            >ყველას წაშლა</Button>

                            <Button
                                type={'button'}
                                onClick={handleBuyAll}

                                startIcon={<WhiteShoppingCart/>}
                                variant={'my-btn-blue'}
                            >შემდეგი გვერდი</Button>
                        </div>
                    </div>
                </div>
            </>
    );
 }
