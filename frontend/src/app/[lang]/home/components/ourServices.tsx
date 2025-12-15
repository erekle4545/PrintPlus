'use client';
import React from 'react';
import Image from 'next/image';

const services = [
    {
        title: 'ბრენდირება',
        image: '/assets/patterns/our_service_1.png', // შენ უნდა ატვირთო ეს ფაილები შენს public ფოლდერში
    },
    {
        title: 'სარეკლამო ბანერა',
        image: '/assets/patterns/our_service_2.png',
    },
    {
        title: 'პროფესიონალური ბეჭდვა',
        image: '/assets/patterns/our_service_3.png',
    },
    {
        title: 'სტანდარტული ფოტოები',
        image: '/assets/patterns/our_service_4.png',
    },
];

const OurServices = () => {
    return (
        <div className="container ">
            <h3 className="text-center fw-bolder mb-3" data-aos="zoom-in">ჩვენი მომსახურება</h3>
            <div className="row g-3">
                {services.map((service, idx) => (

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

                    <div className="col-md-6" key={idx}  data-aos='fade-up'>

                        <div className="   text-center h-100" style={{border:'2px solid #D4D3DA ', backgroundColor:'#FAFAFB',borderRadius:'21.27px'}}>
                            <div className='hover-zoom'>
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    width={570}
                                    height={300}
                                    className="img-fluid p-3 "
                                />
                                <h5 className='fw-bolder mt-1 mb-4'>{service.title}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OurServices;
