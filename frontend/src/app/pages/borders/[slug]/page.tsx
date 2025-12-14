'use client';

import React, { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";
import Cover from "@/shared/components/theme/header/cover/cover";
import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
import QuantityStepper from "@/shared/components/ui/quantity/QuantityStepper";
import Button from "@/shared/components/ui/button/Button";
import Cart from '@/shared/assets/icons/cart/shopping_cart_outline.svg';
import ArrowRightLine from '@/shared/assets/icons/menu/arrow-right-line.svg';


// ----- Types

type ColorKey = 'gold' | 'black' | 'silver' | 'brown';
type SizeKey = 'A5_15x21' | 'A4_21x30' | 'A3_30x42';

// ----- Mock data

const IMAGES = [
    '/assets/img/products/pro_2.png',
    '/assets/img/products/pro_1.png',
    '/assets/img/products/pro_1.png',
    '/assets/img/products/pro_1.png',
];

const SIZE_LABEL: Record<SizeKey, string> = {
    A5_15x21: 'A5 15x21 სმ',
    A4_21x30: 'A4 21x30 სმ',
    A3_30x42: 'A3 30x42 სმ',
};

const SIZE_PRICE: Record<SizeKey, number> = {
    A5_15x21: 130,
    A4_21x30: 160,
    A3_30x42: 210,
};

const COLOR_LABEL: Record<ColorKey, string> = {
    gold: 'ოქროსფერი',
    black: 'შავი',
    silver: 'ვერცხლისფერი',
    brown: 'ყავისფერი',
};

const RELATED = [
    { id: 1, title: 'მუქი ოქროს კუთხე', price: 95, img: '/assets/img/products/pro_2.png' },
    { id: 2, title: 'შავი ოქროს ზოლით', price: 99, img: '/assets/img/products/pro_2.png' },
    { id: 3, title: 'მბზინავი ოქრო', price: 89, img: '/assets/img/products/pro_2.png' },
    { id: 4, title: 'ვერცხლი ოქროს ზღვარი', price: 92, img: '/assets/img/products/pro_2.png' },
    { id: 5, title: 'კაკაოსფერი ოქროს ზოლით', price: 97, img: '/assets/img/products/pro_2.png' },
    { id: 6, title: 'ოქრო მჩატე ორნამენტით', price: 96, img: '/assets/img/products/pro_2.png' },
];


export default function ProductDetails() {
    // gallery state
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    // options
    const [color, setColor] = useState<ColorKey>('gold');
    const [size, setSize] = useState<SizeKey>('A5_15x21');
    const [qty, setQty] = useState<number>(1);

    const unitPrice = useMemo(() => SIZE_PRICE[size], [size]);
    const total = useMemo(() => unitPrice * qty, [unitPrice, qty]);

    // Handlers
    const inc = () => setQty((q) => Math.min(99, q + 1));
    const dec = () => setQty((q) => Math.max(1, q - 1));

    return (<>
            <Cover/>
            <div className="container py-4">
                {/* Breadcrumbs */}
                <HeaderTitle title="ჩარჩოები" slug={[]} />
                <div className="row g-4 pt-1">
                    {/* Left: Gallery */}
                    <div className="col-12 col-lg-6"  data-aos={'fade-left'}>
                        <div className="gallery-wrap mb-4">
                            {/* Main slider */}
                            <Swiper
                                modules={[FreeMode, Navigation, Thumbs]}
                                spaceBetween={10}
                                navigation
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                className="gallery-main rounded-3"
                            >
                                {IMAGES.map((src, i) => (
                                    <SwiperSlide key={`main-${i}`}>
                                        <div className="main-img-box">
                                            <img src={src} alt="პროდუქტის ფოტო" className="img-fluid" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Thumbnails */}
                            <Swiper
                                modules={[FreeMode, Navigation, Thumbs]}
                                onSwiper={setThumbsSwiper}
                                watchSlidesProgress
                                freeMode
                                slidesPerView={4}
                                spaceBetween={8}
                                className="gallery-thumbs mt-2"
                            >
                                {IMAGES.map((src, i) => (
                                    <SwiperSlide key={`thumb-${i}`}>
                                        <button className="thumb-btn" aria-label={`სურათი ${i + 1}`}>
                                            <img src={src} alt="" />
                                        </button>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        {/* Description */}
                        <div className="mb-4">
                            <div className="fw-semibold mb-2">დამატებითი ინფორმაცია</div>
                            <div className="text-secondary small text_font">
                                ჩარჩო დამზადებულია მყარი მასალისგან, ორნამენტი შესრულებულია მაღალი სიზუსტით.
                                რეკომენდებულია მშრალ ქსოვილზე გაწმენდა. ფერი შეიძლება ოდნავ განსხვავდებოდეს
                                მონიტორის კალიბრაციის მიხედვით.
                            </div>
                        </div>
                    </div>

                    {/* Right: Info/Options */}
                    <div className="col-12 col-lg-6" data-aos={'fade-right'}>
                        <h1 className="h4 mb-2 fw-bolder">როკოკოს სტილის ჩარჩო — ხელნაკეთი ორნამენტებით</h1>


                        {/* Colors */}
                        <div className="mb-3 mt-4">
                            <div className="fw-semibold mb-2">აირჩიეთ ფერები</div>
                            <div className="d-flex gap-2">
                                {(['gold', 'black', 'silver', 'brown'] as ColorKey[]).map((c) => (
                                    <label key={c} className={`color-pill ${color === c ? 'active' : ''}`} title={COLOR_LABEL[c]}>
                                        <input
                                            type="radio"
                                            name="color"
                                            className="d-none"
                                            checked={color === c}
                                            onChange={() => setColor(c)}
                                        />
                                        <span data-color={c} />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-3">
                            <div className="fw-semibold  mb-2">აირჩიეთ ქაღალდს შესაბამისი ზომა</div>
                            <div className="d-grid gap-2">
                                {(Object.keys(SIZE_LABEL) as SizeKey[]).map((k) => (

                                    // <label key={k} className={`size-option ${size === k ? 'active' : ''}`}>
                                    <label key={k} className={'fw-bolder'}>
                                        <TealCheckbox
                                            label= {SIZE_LABEL[k]}
                                            checked={size === k}
                                            onChange={(e) =>  setSize(k)}

                                        />

                                    </label>
                                ))}
                            </div>
                        </div>

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
                        <div className="d-flex align-items-center justify-content-between mb-3" >
                            <div>
                                 <div className="h5 m-0 fw-semibold title_font">ფასი <span style={{color:'#52BDBD'}}>{total}₾</span> </div>
                            </div>

                        </div>
                        <Button
                            startIcon={<Cart />}
                            className={'text-center fw-bolder  d-flex justify-content-center'}
                            variant={'my-btn-blue'}
                            style={{width:'200px'}}
                        >შეკვეთა</Button>

                    </div>
                </div>

                {/* Related */}
                <div className="d-flex mt-5 align-items-center justify-content-between mb-3" data-aos={'fade-up'}>
                    <h2 className="h5 m-0 fw-semibold">მსგავსი პროდუქტები</h2>
                    {/*<a href="#" className="text-decoration-none">მეტის ნახვა →</a>*/}
                </div>

                <Swiper
                    modules={[FreeMode, Navigation]}
                    navigation
                    freeMode
                    spaceBetween={16}
                    className="related-swiper"
                    data-aos={'fade-in'}
                    breakpoints={{
                        0: { slidesPerView: 2 },
                        576: { slidesPerView: 3 },
                        992: { slidesPerView: 4 },
                        1200: { slidesPerView: 5 },
                    }}
                >
                    {RELATED.map((p) => (
                        <SwiperSlide key={p.id}>
                            <div className="card h-100  border-0">
                                <img src={p.img} className="card-img-top" alt={p.title} style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
                                <div className="card-body p-3">
                                     <div className="fw-semibold small">{p.title}</div>
                                </div>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='text-center mt-2'>
                    <Button
                        className={'text-center  text_font d-flex justify-content-center'}
                        variant={'my-btn-light-outline'}
                        endIcon={<ArrowRightLine />}
                        style={{width:'200px'}}
                    >სრულად ნახვა</Button>
                </div>

                {/* Local styles to match the mock */}

            </div>
        </>
    );
}
