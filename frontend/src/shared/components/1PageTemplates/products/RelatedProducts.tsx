'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import Button from "@/shared/components/ui/button/Button";
import ArrowRightLine from '@/shared/assets/icons/menu/arrow-right-line.svg';
import {useProducts} from "@/shared/hooks/useProducts";
import {getFirstImage} from "@/shared/utils/imageHelper";
import {useLanguage} from "@/context/LanguageContext";
import Link from "next/link";
import {generateSlug} from "@/shared/utils/mix";
import LocalizedLink from "@/shared/components/LocalizedLink/LocalizedLink";
import {useRouter} from "next/navigation";

interface RelatedProductsProps {
    categoryId: number;
}

export default function RelatedProducts({ categoryId }: RelatedProductsProps) {
    const {products} = useProducts(categoryId);
    const {t} = useLanguage();
    const route = useRouter();
    if (products.length === 0) return null;

    const readMoreSlug = generateSlug('/'+products[0]?.category?.info?.slug,products[0]?.category?.id,'c');
    return (
        <>
            <div className="d-flex mt-5 align-items-center justify-content-between mb-3"
                 data-aos={'fade-up'}>
                <h2 className="h5 m-0 fw-semibold">{t('similarProducts')}</h2>
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
                {products.map((p) => {
                    // console.log(p)
                    // პროდუქტის URL
                    const productUrl = generateSlug(p?.category?.info?.slug+'/'+p?.info?.slug, p.id, 'pr');

                    return (
                        <SwiperSlide key={p.id}>
                            <LocalizedLink href={productUrl} className="text-decoration-none">
                                <div className="card h-100 border-0" style={{ cursor: 'pointer' }}>
                                    <img
                                        src={getFirstImage(p?.info?.covers, 1, 'processed')}
                                        className="card-img-top"
                                        alt={p?.info?.name}
                                        style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                                    />
                                    <div className="card-body p-3">
                                        <div className="fw-semibold small text-dark">{p?.info?.name}</div>
                                    </div>
                                </div>
                            </LocalizedLink>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <div className='text-center mt-2'>
                <Button
                    className={'text-center text_font d-flex justify-content-center'}
                    variant={'my-btn-light-outline'}
                    endIcon={<ArrowRightLine />}
                    style={{width:'200px'}}
                    onClick={()=>route.push(readMoreSlug)}
                >
                    {t('readMore')}
                </Button>
            </div>
        </>
    );
}