'use client';

import Cover from "@/shared/components/theme/header/cover/cover";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
import Button from "@/shared/components/ui/button/Button";
import ShoppingBag from '@/shared/assets/icons/cart/shopping-bag-inside.svg';
import CheckIcon from '@/shared/assets/icons/check/check.svg';
import InfoIcon from '@/shared/assets/icons/info/info.svg';
import FileUploader from "@/shared/components/ui/uploader/FileUploader";
import OrderSidebar from "@/shared/components/ui/orderSidebar/OrderSidebar";
import { Product } from "@/types/product/productTypes";
import { getFirstImage, getImageUrl } from "@/shared/utils/imageHelper";

interface BrandPageDetailsProps {
    product: Product;
}

export default function BrandPageDetails({ product }: BrandPageDetailsProps) {
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [comment, setComment] = useState<string>("");

    // Set first material, size, and first extra as default on mount
    useEffect(() => {
        if (product.info.covers && product.info.covers.length > 0 && !selectedMaterial) {
            setSelectedMaterial('cover-0');
        }
        if (product.sizes && product.sizes.length > 0 && selectedSize === null) {
            setSelectedSize(product.sizes[0].id);
        }
        if (product.extras && product.extras.length > 0 && selectedExtras.length === 0) {
            setSelectedExtras([product.extras[0].id]);
        }
    }, [product, selectedMaterial, selectedSize, selectedExtras.length]);

    // Calculate price based on selections
    const calculatePrice = () => {
        let total = Number(product.sale_price || product.base_price || 0);

        if (selectedSize) {
            const size = product.sizes?.find(s => s.id === selectedSize);
            if (size && size.base_price) {
                total += Number(size.base_price);
            }
        }

        selectedExtras.forEach(extraId => {
            const extra = product.extras?.find(e => e.id === extraId);
            if (extra && extra.base_price) {
                total += Number(extra.base_price);
            }
        });

        return total;
    };

    const price = calculatePrice();

    const handleOrderClick = () => {
        console.log({
            product: product.id,
            material: selectedMaterial,
            size: selectedSize,
            extras: selectedExtras,
            quantity,
            comment,
            totalPrice: price * quantity
        });
    };

    const toggleExtra = (extraId: number) => {
        setSelectedExtras(prev =>
            prev.includes(extraId)
                ? prev.filter(id => id !== extraId)
                : [...prev, extraId]
        );
    };

    return (
        <>
            <Cover />
            <div className="container py-4"     data-aos={"fade-up"}   >
                <HeaderTitle title={product.info.name} slug={product.info.slug} />
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-9">
                        <div className='section-brands p-4'>
                            {/* Product Images - აირჩიე მასალა */}
                            {product.info.covers && product.info.covers.length > 0 && (
                                <>
                                    <h5 className="mb-3 fw-bolder">აირჩიე მასალა</h5>
                                    <div className="row">
                                        {product.info.covers.map((cover, index) => {
                                            const isSelected = selectedMaterial === `cover-${index}`;
                                            return (
                                                <div className="col-6 col-md-3 mb-4" key={index}>
                                                    <div
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => setSelectedMaterial(`cover-${index}`)}
                                                        onKeyDown={(e) =>
                                                            (e.key === "Enter" || e.key === " ") && setSelectedMaterial(`cover-${index}`)
                                                        }
                                                        className={`product-card text-center p-2  ${isSelected ? "is-selected" : ""}`}
                                                        aria-pressed={isSelected}
                                                    >
                                                        {/* image wrapper keeps square ratio and crops nicely */}
                                                        <div className="thumb">
                                                            <Image
                                                                src={getImageUrl(cover?.output_path)}
                                                                alt={`${product.info.name} ${index + 1}`}
                                                                fill
                                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                                className="thumb-img"
                                                            />
                                                        </div>

                                                        {/* centered check badge */}
                                                        {isSelected && (
                                                            <span className="selected-badge" aria-hidden="true">
                                                                <span className="badge-circle">
                                                                    <CheckIcon />
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* title */}
                                                    <div className="mt-2 text-center fw-bolder">
                                                        {product.materials?.[index]?.name || `ბალიშის საფარი ${index + 1}`}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* method - აირჩიე ბალიშის მეთოდი */}
                            {product.extras && product.extras.length > 0 && (
                                <>
                                    <h5 className="mt-4 fw-bolder">აირჩიე ბალიშის მეთოდი</h5>
                                    {product.extras.map((extra) => (
                                        <div key={extra.id}>
                                            <TealCheckbox
                                                label={`${extra.name}${extra.base_price && extra.base_price > 0 ? ` (+${extra.base_price}₾)` : ''}`}
                                                checked={selectedExtras.includes(extra.id)}
                                                onChange={() => toggleExtra(extra.id)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Sizes - აირჩიე ზომა (checkboxes) */}
                            {product.sizes && product.sizes.length > 0 && (
                                <>
                                    <h5 className="mt-4 fw-bolder">აირჩიე ზომა</h5>
                                    {product.sizes.map((size) => (
                                        <div key={size.id}>
                                            <TealCheckbox
                                                label={`${size.name} (${size.width} x ${size.height})${size.base_price && size.base_price > 0 ? ` (+${size.base_price}₾)` : ''}`}
                                                checked={selectedSize === size.id}
                                                onChange={() => setSelectedSize(size.id)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* qty */}
                            <h5 className="mt-4 fw-bolder">მოითხოვე რაოდენობა</h5>
                            <div className="d-flex align-items-center">
                                <button
                                    className={'btn btn-sm  btn-light qty-btn-item fw-bolder'}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="mx-1 qty-span-item">{quantity}</span>
                                <button
                                    className={'btn btn-sm btn-light qty-btn-item fw-bolder'}
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            {/*info*/}
                            <div className='mt-3 gap-2 text_font text-muted d-flex align-items-center align-content-center'>
                                <div>
                                    <InfoIcon />
                                </div>
                                <div>
                                    1000-ზე მეტის შეკვეთის შემთხვევაში გთხოვთ დაგვიკავშირდეთ.
                                </div>
                            </div>

                            {/* comment */}
                            <h5 className="mt-4 fw-bolder">დამატებითი დეტალები</h5>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="შეკვეთასთან დაკავშირებული დამატებითი დეტალები მოგვწერეთ აქ"
                                value={comment}
                                className='text_font'
                                onChange={(e) => setComment(e.target.value)}
                            />

                            <h5 className="mt-4 fw-bolder">ატვირთე ფაილი / ლოგო</h5>
                            <FileUploader
                                uploadUrl={`${process.env.NEXT_PUBLIC_API}/upload`}
                                headers={{ Authorization: `Bearer ` }}
                                accept="application/pdf,image/*"
                                multiple
                                maxSizeMB={50}
                                className={'text_font'}
                                autoUpload
                                onComplete={(items) => console.log("DONE", items)}
                                onError={(items) => console.log("ERR", items)}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-lg-3 mt-4 mt-lg-0 ">
                        <OrderSidebar
                            price={price}
                            quantity={quantity}
                            onOrderClick={handleOrderClick}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}