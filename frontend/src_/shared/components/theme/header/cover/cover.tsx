"use client";

import React from 'react';
import Image from "next/image";

interface CoverProps {
    img?: string;
}

const Cover = ({ img }: CoverProps) => {
    const coverImage = img || "/assets/img/example/cover.png";

    return (
        <div className='page-cover bg-black relative w-full aspect-video'>
            <Image
                src={coverImage}
                alt="cover"
                fill
                data-aos='fade-right'
                style={{ objectFit: "cover" }}
                priority
            />
        </div>
    );
}

export default Cover;