'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import {useLanguage} from "@/context/LanguageContext";
import {Product} from "@/types/product/productTypes";
import {getFirstImage} from "@/shared/utils/imageHelper";
import Link from "next/link";
import {generateSlug} from "@/shared/utils/mix";


interface OurProductsCarouselProps {
    products: Product[] ;
    locale: string;
}

const OurProductsCarousel: React.FC<OurProductsCarouselProps> = ({locale, products}) => {
    const { t } = useLanguage();

    if (!products || products.length === 0) return null;


    const arrowStyle = {
        zIndex: 5555,
        fontSize: '30px',
        width: '60px',
        height: '60px',
        border: '2px solid #E3E3E3',
        backgroundColor: '#fff',
    };

    const commonClass = 'btn border-1 rounded-circle';

    return (
        <div className="text-center my-5" data-aos="fade-up">
            <h3 className="fw-bold mb-4">ჩვენი პროდუქტები</h3>
            <div className="position-relative col-auto d-flex justify-content-center">
                <Swiper
                    className="col-xl-10"
                    modules={[Navigation]}
                    navigation={{
                        nextEl: '.custom-next',
                        prevEl: '.custom-prev',
                    }}
                    slidesPerView={5}
                    spaceBetween={0}
                    breakpoints={{
                        0: { slidesPerView: 2 },
                        576: { slidesPerView: 3 },
                        768: { slidesPerView: 3 },
                        992: { slidesPerView: 5 },
                    }}
                >
                    {products.map((product) => {
                        console.log(product)
                        // product category slug
                        const categoryProductSlug = product.category?.info?.slug+'/'+product?.info?.slug;
                        // product details url
                        const url = generateSlug(categoryProductSlug,product.id,'pr');
                        // return
                        return  (
                            <SwiperSlide key={product.id}>
                                <div className="text-center hover-zoom">
                                    <Link href={url}>
                                        <div
                                            className="rounded-circle overflow-hidden mx-auto"
                                            style={{width: 200, height: 200}}
                                        >

                                            <Image
                                                src={getFirstImage(product?.info?.covers, 1, 'processed')}
                                                alt={product.info?.name || 'Product'}
                                                width={200}
                                                height={200}
                                                style={{objectFit: 'contain'}}
                                            />

                                        </div>
                                        <div className="mt-2 fw-bolder">{product.info?.name}</div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Desktop ღილაკები */}
                <div className="d-none d-xl-block">
                    <button
                        style={arrowStyle}
                        className={`${commonClass} custom-prev position-absolute top-50 start-0 translate-middle-y`}
                    >
                        ←
                    </button>
                    <button
                        style={arrowStyle}
                        className={`${commonClass} custom-next position-absolute top-50 end-0 translate-middle-y`}
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Mobile ღილაკები */}
            <div className="d-xl-none d-md-block text-center mt-3">
                <button style={arrowStyle} className={`${commonClass} custom-prev mx-2`}>
                    ←
                </button>
                <button style={arrowStyle} className={`${commonClass} custom-next mx-2`}>
                    →
                </button>
            </div>
        </div>
    );
};

export default OurProductsCarousel;