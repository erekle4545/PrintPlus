'use client'

import React from 'react';
import Image from "next/image";
import Button from "@/shared/components/ui/button/Button";

const About = () => {
    return (
        <div className="container my-5">
            <h3 className="text-center fw-bolder mb-4" data-aos="zoom-in">ჩვენი შესახებ</h3>
            <div className="row g-4 text_font">
                <div className="col-xl-6">
                    <div className="position-relative" style={{ width: '100%', height: 'auto' }}>
                        <Image
                            src="/assets/img/example/home-about.png"
                            alt="ჩვენი შესახებ"
                            width={700}
                            height={500}
                            className="img-fluid rounded "
                        />
                    </div>
                </div>
                <div className="col-xl-6">
                    <h4 className='title_font fw-bolder'>ჩვენი ისტორია და მიზანი</h4>
                    <p className="text-muted lh-lg" data-aos="fade-left">
                        ჩვენი კომპანია გთავაზობთ ინოვაციურ და მომხმარებელზე მორგებულ სერვისებს, რომლებიც გათვლილია თქვენი კომფორტისა და წარმატების უზრუნველსაყოფად. ჩვენთვის მნიშვნელოვანია ხარისხი, სანდოობა და განვითარება.
                    </p>
                    <p className="text-muted lh-lg" data-aos="fade-left" data-aos-delay="100">
                        ჩვენ გთავაზობთ პროფესიონალურ მიდგომას და მუდმივად ვეძებთ ახალ გზებს, რათა დავაკმაყოფილოთ ჩვენი კლიენტების მოლოდინი.
                    </p>
                    <Button className={'btn  border-1 title_font fw-bolder'} variant='my-btn-light-outline'>გაიგე მეტი  →</Button>
                </div>
            </div>
        </div>
    );
}

export default About;
