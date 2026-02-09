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
import {PageCategory} from "@/types/page/page";


interface OurProductsCarouselProps {
    category: PageCategory[] ;
    locale: string;
}

const OurProductsCarousel: React.FC<OurProductsCarouselProps> = ({locale, category}) => {
    const { t } = useLanguage();
    // console.log(category)
    if (!category || category.length === 0) return null;


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
            <h3 className="fw-bold mb-4">{ t('ourProducts','ჩვენი პროდუქტები')}</h3>
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
                    {category.map((item) => {

                        // product category slug
                        const categoryProductSlug =  item?.info?.slug;
                        // product details url
                        const url = generateSlug(categoryProductSlug,item.id,'c');
                        // return
                        return  (
                            <SwiperSlide key={item.id}>
                                <div className="text-center hover-zoom">
                                    <Link href={url}>
                                        <div
                                            className="rounded-circle overflow-hidden mx-auto"
                                            style={{width: 200, height: 200}}
                                        >

                                            <Image
                                                src={getFirstImage(item?.info?.covers, 1, 'processed')}
                                                alt={item.info?.title || 'category'}
                                                width={200}
                                                height={200}
                                                style={{objectFit: 'contain'}}
                                            />

                                        </div>
                                        <div className="mt-2 fw-bolder">{item.info?.title}</div>
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