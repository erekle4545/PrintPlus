'use client'

import React from 'react';
import Image from "next/image";
import Button from "@/shared/components/ui/button/Button";
import {useLanguage} from "@/context/LanguageContext";
import {TextPages} from "@/types/page/page";
import {getFirstImage} from "@/shared/utils/imageHelper";
import {useRouter} from "next/navigation";
import {generateSlug} from "@/shared/utils/mix";

interface AboutProps {
    AboutProps: TextPages | null;
}

const About: React.FC<AboutProps> = ({ AboutProps }) => {

    const { t } = useLanguage();

    const route = useRouter();

    if (!AboutProps) {
        return null;
    }
    // page
    const firstImage = getFirstImage(AboutProps.info?.covers)
    // url
    const url = generateSlug(AboutProps.info?.slug, AboutProps?.id, 'p');
    //return component
    return (
        <div className="container my-5">
            <h3 className="text-center fw-bolder mb-4" data-aos="zoom-in">
                {t('aboutUs','ჩვენი შესახებ')}
            </h3>
            <div className="row g-4 text_font">
                <div className="col-xl-6">
                    <div className="position-relative" style={{ width: '100%', height: 'auto' }}>
                        <Image
                            src={firstImage}
                            alt={AboutProps.info?.title || ''}
                            width={700}
                            height={500}
                            className="img-fluid rounded"
                            unoptimized={firstImage.startsWith('http://localhost')} // Development-ისთვის
                        />
                    </div>
                </div>
                <div className="col-xl-6">

                    <h4 className='title_font fw-bolder'>{AboutProps.info?.title}</h4>

                    <p className="text-muted lh-lg" data-aos="fade-left">
                        {AboutProps.info?.description}
                    </p>

                    <Button  onClick={()=>route.push(url)}  className={'btn border-1 title_font fw-bolder'} variant='my-btn-light-outline'>
                        {t('readMore','გაიგე მეტი')} →
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default About;