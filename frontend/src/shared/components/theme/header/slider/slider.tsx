'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination,Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import {useSlider} from "@/shared/hooks/useSlider";
import {getFirstImage} from "@/shared/utils/imageHelper";

// slider component for home page
const Slider = () => {

    // use slider  hook
    const {sliders} = useSlider();

    // slider list
    const sliderList = ()=>{

        return  sliders?.map((slider,index)=>{

            return (
                <SwiperSlide key={index}>
                    <div  className='slider-img-size'>
                        <Image  src={getFirstImage(slider?.info?.covers,1,'original')} alt="slider" fill />
                    </div>
                </SwiperSlide>

            );
        });
    }


    return (
        <div className="container pb-1" data-aos='fade-left'>
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{
                    clickable: true,
                    el: '.custom-pagination',
                    renderBullet: (index, className) => {
                        return `<span class="${className}"></span>`;
                    },
                }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                spaceBetween={10}
                slidesPerView={1}
                className="position-relative"
            >
                {sliderList()}
                {/*<SwiperSlide>*/}
                {/*    <div  className='slider-img-size'>*/}
                {/*        /!*<Image src="/assets/img/example/slider1.svg" alt="slider" fill style={{ objectFit: 'cover' }} />*!/*/}
                {/*        <Image  src="/assets/img/example/slider1.svg" alt="slider" fill />*/}
                {/*    </div>*/}
                {/*</SwiperSlide>*/}
                {/*<SwiperSlide>*/}
                {/*    <div  className='slider-img-size'>*/}
                {/*        <Image  src="/assets/img/example/slider1.svg" alt="slider" fill   />*/}
                {/*    </div>*/}
                {/*</SwiperSlide>*/}

            </Swiper>

            {/*  pagination div moved OUTSIDE Swiper */}
            <div className="custom-pagination d-flex gap-2 justify-content-center mt-3 mb-3" />
        </div>
    );
};

export default Slider;
