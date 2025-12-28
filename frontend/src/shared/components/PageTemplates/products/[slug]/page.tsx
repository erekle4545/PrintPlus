// shared/components/PageTemplates/products/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
import Cover from "@/shared/components/theme/header/cover/cover";
import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
import QuantityStepper from "@/shared/components/ui/quantity/QuantityStepper";
import Button from "@/shared/components/ui/button/Button";
import Cart from '@/shared/assets/icons/cart/shopping_cart_outline.svg';
import { Product } from "@/types/product/productTypes";
import RelatedProducts from '../../products/RelatedProducts';
import {getAllImages} from "@/shared/utils/imageHelper";
import {generateSlug} from "@/shared/utils/mix";

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    // Product-დან მონაცემების ამოღება
    const images = useMemo(() => {
        return getAllImages(product.info?.covers);
    }, [product.info?.covers]);

    const sizes = useMemo(() => product.sizes || [], [product.sizes]);
    const colors = useMemo(() => product.colors || [], [product.colors]);
    const materials = useMemo(() => product.materials || [], [product.materials]);
    const printTypes = useMemo(() => product.print_types || [], [product.print_types]);
    const extras = useMemo(() => product.extras || [], [product.extras]);

    // State
    const [selectedColor, setSelectedColor] = useState<number | null>(
        colors.length > 0 ? colors[0].id : null
    );
    const [selectedSize, setSelectedSize] = useState<number | null>(
        sizes.length > 0 ? sizes[0].id : null
    );
    const [selectedMaterial, setSelectedMaterial] = useState<number | null>(
        materials.length > 0 ? materials[0].id : null
    );
    const [selectedPrintTypes, setSelectedPrintTypes] = useState<number[]>(
        printTypes.length > 0 ? [printTypes[0].id] : []
    );
    const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
    const [qty, setQty] = useState<number>(1);

    // ფასის გამოთვლა - NaN პრობლემის გამოსწორებით
    const totalPrice = useMemo(() => {
        let price = 0;

        // Base price
        const basePrice = Number(product.sale_price) > 0 ? Number(product.sale_price) : Number(product.base_price);
        price = isNaN(basePrice) ? 0 : basePrice;

        // Size-ის ფასი
        if (selectedSize) {
            const size = sizes.find(s => s.id === selectedSize);
            if (size?.base_price) {
                const sizePrice = Number(size.base_price);
                price += isNaN(sizePrice) ? 0 : sizePrice;
            }
        }

        // Color-ის ფასი
        if (selectedColor) {
            const color = colors.find(c => c.id === selectedColor);
            if (color?.base_price) {
                const colorPrice = Number(color.base_price);
                price += isNaN(colorPrice) ? 0 : colorPrice;
            }
        }

        // Material-ის ფასი
        if (selectedMaterial) {
            const material = materials.find(m => m.id === selectedMaterial);
            if (material?.base_price) {
                const materialPrice = Number(material.base_price);
                price += isNaN(materialPrice) ? 0 : materialPrice;
            }
        }

        // Print Types-ის ფასები
        selectedPrintTypes.forEach(printTypeId => {
            const printType = printTypes.find(pt => pt.id === printTypeId);
            if (printType?.base_price) {
                const printTypePrice = Number(printType.base_price);
                price += isNaN(printTypePrice) ? 0 : printTypePrice;
            }
        });

        // Extras-ის ფასები
        selectedExtras.forEach(extraId => {
            const extra = extras.find(e => e.id === extraId);
            if (extra?.base_price) {
                const extraPrice = Number(extra.base_price);
                price += isNaN(extraPrice) ? 0 : extraPrice;
            }
        });

        const finalPrice = price * qty;
        return isNaN(finalPrice) ? 0 : finalPrice;
    }, [product, selectedSize, selectedColor, selectedMaterial, selectedPrintTypes, selectedExtras, qty, sizes, colors, materials, printTypes, extras]);

    // Extras toggle
    const toggleExtra = (extraId: number) => {
        setSelectedExtras(prev =>
            prev.includes(extraId)
                ? prev.filter(id => id !== extraId)
                : [...prev, extraId]
        );
    };

    // Print Types toggle
    const togglePrintType = (printTypeId: number) => {
        setSelectedPrintTypes(prev =>
            prev.includes(printTypeId)
                ? prev.filter(id => id !== printTypeId)
                : [...prev, printTypeId]
        );
    };

    /**
     * category slug
     */
    const categoryUrl = generateSlug(product?.category?.info?.slug, product?.category?.id, 'c');

    return (
        <>
            <Cover />
            <div className="container py-4">
                <HeaderTitle
                    title={product?.category?.info?.title || ''}
                    slug={categoryUrl}
                />

                <div className="row g-4 pt-1">
                    {/* Left: Gallery */}
                    <div className="col-12 col-lg-6" data-aos={'fade-left'}>
                        <div className="gallery-wrap mb-4">
                            {/* Main slider */}
                            <Swiper
                                modules={[FreeMode, Navigation, Thumbs]}
                                spaceBetween={10}
                                navigation
                                thumbs={{
                                    swiper: thumbsSwiper && !thumbsSwiper.destroyed
                                        ? thumbsSwiper
                                        : null
                                }}
                                className="gallery-main rounded-3"
                            >
                                {images.map((src, i) => (
                                    <SwiperSlide key={`main-${i}`}>
                                        <div className="main-img-box">
                                            <img
                                                src={src}
                                                alt={`${product.info?.name} - ${i + 1}`}
                                                className="img-fluid"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <Swiper
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    onSwiper={setThumbsSwiper}
                                    watchSlidesProgress
                                    freeMode
                                    slidesPerView={4}
                                    spaceBetween={8}
                                    className="gallery-thumbs mt-2"
                                >
                                    {images.map((src, i) => (
                                        <SwiperSlide key={`thumb-${i}`}>
                                            <button
                                                className="thumb-btn"
                                                aria-label={`სურათი ${i + 1}`}
                                            >
                                                <img src={src} alt="" />
                                            </button>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        {/* Description */}
                        {product.info?.description && (
                            <div className="mb-4">
                                <div className="fw-semibold mb-2">დამატებითი ინფორმაცია</div>
                                <div
                                    className="text-secondary small text_font"
                                    dangerouslySetInnerHTML={{ __html: product.info.description }}
                                />
                            </div>
                        )}

                        {/* Full Text */}
                        {product.info?.text && (
                            <div className="mb-4">
                                <div className="fw-semibold mb-2">დეტალური აღწერა</div>
                                <div
                                    className="text-secondary small text_font"
                                    dangerouslySetInnerHTML={{ __html: product.info.text }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: Info/Options */}
                    <div className="col-12 col-lg-6" data-aos={'fade-right'}>
                        <h1 className="h4 mb-2 fw-bolder">{product.info?.name}</h1>

                        {/* Base Price Display */}
                        {product.sale_price > 0 && (
                            <div className="mb-3">
                                <span className="text-decoration-line-through text-muted me-2">
                                    {product.base_price}₾
                                </span>
                                <span className="text-danger fw-semibold">
                                    {product.sale_price}₾
                                </span>
                            </div>
                        )}

                        {/* Colors */}
                        {colors.length > 0 && (
                            <div className="mb-3 mt-4">
                                <div className="fw-semibold mb-2">აირჩიეთ ფერი</div>
                                <div className="d-flex gap-2 flex-wrap">
                                    {colors.map((color) => (
                                        <label
                                            key={color.id}
                                            className={`color-pill ${selectedColor === color.id ? 'active' : ''}`}
                                            title={color.name}
                                            style={{
                                                backgroundColor: color.value,
                                                border: '2px solid',
                                                borderColor: selectedColor === color.id ? '#52BDBD' : '#ddd',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="color"
                                                className="d-none"
                                                checked={selectedColor === color.id}
                                                onChange={() => setSelectedColor(color.id)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {sizes.length > 0 && (
                            <div className="mb-3">
                                <div className="fw-semibold mb-2">აირჩიეთ ზომა</div>
                                <div className="d-grid gap-2">
                                    {sizes.map((size) => (
                                        <label key={size.id} className={'fw-bolder'}>
                                            <TealCheckbox
                                                label={`${size.name} ${size.width ? `(${size.width}x${size.height} სმ)` : ''} ${size.base_price > 0 ? `+${size.base_price}₾` : ''}`}
                                                checked={selectedSize === size.id}
                                                onChange={() => setSelectedSize(size.id)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Materials */}
                        {materials.length > 0 && (
                            <div className="mb-3">
                                <div className="fw-semibold mb-2">აირჩიეთ მასალა</div>
                                <div className="d-grid gap-2">
                                    {materials.map((material) => (
                                        <label key={material.id} className={'fw-bolder'}>
                                            <TealCheckbox
                                                label={`${material.name} ${material.base_price > 0 ? `+${material.base_price}₾` : ''}`}
                                                checked={selectedMaterial === material.id}
                                                onChange={() => setSelectedMaterial(material.id)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Print Types */}
                        {printTypes.length > 0 && (
                            <div className="mb-3">
                                <div className="fw-semibold mb-2">აირჩიეთ ბეჭდვის მეთოდი</div>
                                <div className="d-grid gap-2">
                                    {printTypes.map((printType) => (
                                        <label key={printType.id} className={'fw-bolder'}>
                                            <TealCheckbox
                                                label={`${printType.name} ${printType.base_price > 0 ? `+${printType.base_price}₾` : ''}`}
                                                checked={selectedPrintTypes.includes(printType.id)}
                                                onChange={() => togglePrintType(printType.id)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Extras */}
                        {extras.length > 0 && (
                            <div className="mb-3">
                                <div className="fw-semibold mb-2">დამატებითი ოპციები</div>
                                <div className="d-grid gap-2">
                                    {extras.map((extra) => (
                                        <label key={extra.id} className={'fw-bolder'}>
                                            <TealCheckbox
                                                label={`${extra.name} ${extra.base_price > 0 ? `+${extra.base_price}₾` : ''}`}
                                                checked={selectedExtras.includes(extra.id)}
                                                onChange={() => toggleExtra(extra.id)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-3">
                            <div className="input-group" style={{ maxWidth: 180 }}>
                                <QuantityStepper
                                    label="რაოდენობა"
                                    value={qty}
                                    onChange={setQty}
                                    min={1}
                                    max={99}
                                    size="sm"
                                />
                            </div>
                        </div>

                        {/* Price + Actions */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <div className="h5 m-0 fw-semibold title_font">
                                    სრული ფასი <span style={{ color: '#52BDBD' }}>{totalPrice.toFixed(2)}₾</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            startIcon={<Cart />}
                            className={'text-center fw-bolder d-flex justify-content-center'}
                            variant={'my-btn-blue'}
                            style={{ width: '200px' }}
                        >
                            შეკვეთა
                        </Button>
                    </div>
                </div>

                {/* Related Products */}
                <RelatedProducts categoryId={product.category_id} />
            </div>
        </>
    );
}