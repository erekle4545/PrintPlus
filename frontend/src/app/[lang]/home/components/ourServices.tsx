'use client';
import React from 'react';
import Image from 'next/image';
import {PageData, TextPages} from "@/types/page/page";
import {getFirstImage} from "@/shared/utils/imageHelper";
import {useLanguage} from "@/context/LanguageContext";
import Link from "next/link";
import LocalizedLink from "@/shared/components/LocalizedLink/LocalizedLink";
import {generateSlug} from "@/shared/utils/mix";

interface OurServicesProps {
    services: PageData  | null;
}

const OurServices: React.FC<OurServicesProps> = ({ services }) => {
    const {t} = useLanguage();
    if (!services) return null;

    // component service list
    const list = () => {
        return  services?.categories.map((service, idx) => {
            // url
           const url = generateSlug(service?.info?.slug, service.id, 'c');
            // get first images
           const firstImage = getFirstImage(service.info?.covers,undefined,'original');

           return (
                // <div className="col-md-6" key={idx}  >
                //
                //     <div className=" rounded  text-center " style={{border:'2px solid #D4D3DA ', backgroundColor:'#FAFAFB'}}>
                //         <div className=''
                //              style={{
                //
                //                  backgroundImage: 'url("/assets/patterns/background-card.svg")',
                //                  backgroundRepeat: 'no-repeat',
                //                  backgroundSize: 'contain', // სრული დაფარვა კიდეებამდე
                //                  backgroundPosition: 'center',
                //                  // padding: '3rem'
                //              }}
                //         >
                //             <Image
                //                 src={service.image}
                //                 alt={service.title}
                //                 width={1} // აუცილებელია `next/image`-ში რიცხვი მაინც
                //                 height={1}
                //                 className="img-fluid p-3"
                //                 style={{
                //                     height: '30vh',
                //                     width: 'auto',
                //                     objectFit: 'contain',
                //                 }}
                //                 unoptimized
                //             />
                //
                //             <h5 className='fw-bolder mt-1 mb-4'>{service.title}</h5>
                //         </div>
                //     </div>
                // </div>
                <div className="col-md-6" key={idx} data-aos='fade-up'>
                    <div className="text-center h-100" style={{border: '2px solid #D4D3DA ', backgroundColor: '#FAFAFB', borderRadius: '21.27px'}}>
                        <LocalizedLink href={url} >
                            <div className='hover-zoom'>
                                <Image
                                    src={firstImage}
                                    alt={service?.info?.title}
                                    width={570}
                                    height={300}
                                    className="img-fluid p-3 "
                                />
                                <h5 className='fw-bolder mt-1 mb-4'>{service?.info?.title}</h5>
                            </div>
                        </LocalizedLink>
                    </div>
                </div>
            )
        })
    }

    // return component
    return (
        <div className="container ">
            <h3 className="text-center fw-bolder mb-3" data-aos="zoom-in">{t('ourService','ჩვენი მომსახურება')}</h3>
            <div className="row g-3">
                {list()}
            </div>
        </div>
    );
};

export default OurServices;
