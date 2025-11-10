'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';

const products = [
    { title: 'ჩარჩოები', image: '/assets/img/example/image.png' },
    { title: 'საკანცელარიო ნივთები', image: '/assets/img/example/image.png' },
    { title: 'სტიკერები', image: '/assets/img/example/image.png' },
    { title: 'საოჯახო ალბომები', image: '/assets/img/example/image.png' },
    { title: 'სასაჩუქრე ბარათები', image: '/assets/img/example/image.png' },
    { title: 'სასაჩუქრე ბარათები', image: '/assets/img/example/image.png' },
    { title: 'სასაჩუქრე ბარათები', image: '/assets/img/example/image.png' },
    { title: 'სასაჩუქრე ბარათები', image: '/assets/img/example/image.png' },
];

const OurProductsCarousel = () => {
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
                    {products.map((product, index) => (
                        <SwiperSlide key={index}>
                            <div className="text-center hover-zoom">
                                <div
                                    className="rounded-circle overflow-hidden mx-auto"
                                    style={{ width: 200, height: 200 }}
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        width={200}
                                        height={200}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="mt-2 fw-bolder">{product.title}</div>
                            </div>
                        </SwiperSlide>
                    ))}
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
