'use client';

import React from 'react';
import Image from "next/image";

const Cover = () => {

    return (
        <div
            className='page-cover bg-black'

        >
            <Image
                src="/assets/img/example/cover.png"
                alt="cover"
                fill
                data-aos={'fade-right'}
                style={{ objectFit: "cover" }}
            />
        </div>

    )
}

export default Cover;