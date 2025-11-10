'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Button from "@/components/ui/button/Button";

const footerData = [
    {
        id: 'contact',
        title: 'საკონტაქტო ინფორმაცია',
        content: (
            <div className="text-white">
                <p className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i> თბილისი, ბარათაშვილის 16</p>
                <p className="mb-2"><i className="bi bi-telephone-fill me-2"></i> +995 598 393 836</p>
                <p><i className="bi bi-envelope-fill me-2"></i> info@printplus.ge</p>
            </div>
        )
    },
    {
        id: 'navigation',
        title: 'საიტის ნავიგაცია',
        content: (
            <ul className="list-unstyled mb-0">
                <li><Link href="#" className="text-white d-block mb-1">ჩვენ შესახებ</Link></li>
                <li><Link href="#" className="text-white d-block mb-1">სერვისები</Link></li>
                <li><Link href="#" className="text-info d-block mb-1">მომსახურება</Link></li>
                <li><Link href="#" className="text-white d-block mb-1">პროდუქტები</Link></li>
                <li><Link href="#" className="text-white d-block">ფასები</Link></li>
            </ul>
        )
    },
    {
        id: 'links',
        title: 'სასარგებლო ბმულები',
        content: (
            <ul className="list-unstyled mb-0">
                <li><Link href="#" className="text-white d-block mb-1">ნამუშევრები და პროექტები</Link></li>
                <li><Link href="#" className="text-white d-block mb-1">ბლოგი</Link></li>
                <li><Link href="#" className="text-white d-block">ციფრული დიზაინის კატალოგი</Link></li>
            </ul>
        )
    },
    {
        id: 'social',
        title: 'სოციალური მედია',
        content: (
            <div className="text_font">
                <div><a href="https://facebook.com" className="text-white text_font"><i className="bi bi-facebook me-2"></i>Facebook</a></div>
                <div><a href="https://instagram.com" className="text-white text_font"><i className="bi bi-instagram me-2"></i>Instagram</a></div>
            </div>
        )
    }
];

const Footer = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const handleToggleMenu = (id: string): void => {
        setOpenMenu(prev => (prev === id ? null : id));
    };

    return (
        <footer className="container-with-bg-image text-white py-5" >
            <div className="container text_font" style={{ fontSize: '15px', lineHeight: '1.8' }} data-aos={'fade-up'}>

                {/* ---------- Desktop & Tablet Layout ---------- */}
                <div className="row d-none d-md-flex justify-content-between text-white flex-wrap">
                    <div className="col-md-3 col-xl-2 hidden-footer-tab footer-hover mb-4">
                        <Link href="/" className="text-white text-decoration-none h4 d-block mb-3">
                            <Image src="/assets/img/global/logo.svg" alt="ლოგო" width={177} height={40} />
                        </Link>
                    </div>

                    <div className="col-md-3 col-xl-3 footer-hover mb-4" key="contact">
                        <h6 className="title_font fw-bolder mb-3">{footerData[0].title}</h6>
                        {footerData[0].content}
                    </div>

                    {footerData.slice(1, 3).map(({ id, title, content }) => (
                        <div className="col-md-3 col-xl-2 footer-hover mb-4" key={id}>
                            <h6 className="title_font fw-bolder mb-3">{title}</h6>
                            {content}
                        </div>
                    ))}

                    <div className="col-md-3 col-xl-2 footer-hover mb-4" key="social">
                        <h6 className="title_font fw-bolder mb-3">{footerData[3].title}</h6>
                        {footerData[3].content}
                    </div>
                </div>

                {/* ---------- Mobile Layout ---------- */}
                <div className="d-md-none text-center">
                    <Image src="/assets/img/global/logo.svg" alt="ლოგო" width={160} height={36} className="mb-2 mx-auto" />

                    <div className="mb-4 text-center">
                        <h6 className="p-3 title_font text-white">საიტის გამოწერა</h6>
                        <form className="d-flex justify-content-center">
                            <div className="input-group bg-white rounded-pill overflow-hidden" style={{ maxWidth: '90%' }}>
                                <input type="email" placeholder="თქვენი ელ-ფოსტა" className="form-control border-0 shadow-none p-2" style={{ fontSize: '14px' }} />
                                <Button className="btn m-1 fw-bolder title_font" variant="my-btn-blue">გამოწერა</Button>
                            </div>
                        </form>
                    </div>

                    <div className="accordion mb-4" id="footerAccordion">
                        {footerData.map(({ id, title, content }) => (
                            <div className="accordion-item bg-transparent mt-1 mb-1 border-0" key={id}>
                                <h2 className="accordion-header title_font">
                                    <button className={`accordion-button ${openMenu === id ? 'my-text-color' : 'collapsed'} text-white`} type="button" style={{ backgroundColor: '#3E3E47' }} onClick={() => handleToggleMenu(id)}>
                                        {title}
                                    </button>
                                    <hr style={{ borderTop: '1px solid #4e4e58', margin: '0' }} />
                                </h2>
                                <div className={`accordion-collapse collapse ${openMenu === id ? 'show' : ''}`} style={{ backgroundColor: '#3E3E47' }}>
                                    <div className="accordion-body footer-hover text-start">
                                        {content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ---------- Subscription Section ---------- */}
                <div className="row mt-4 justify-content-between align-items-center">
                    <div className="col-md-3 col-xl-2 show-footer-tab footer-hover mb-4">
                        <Link href="/" className="text-white text-decoration-none h4 d-block mb-3">
                            <Image src="/assets/img/global/logo.svg" alt="ლოგო" width={177} height={40} />
                        </Link>
                    </div>
                    <div className="d-none d-sm-block col-md-6 col-xl-6 mb-4">
                        <h6 className="mb-3 ms-4 fw-bolder title_font text-white">საიტის გამოწერა</h6>
                        <form className="d-flex">
                            <div className="input-group bg-white rounded-pill overflow-hidden" style={{ maxWidth: '400px' }}>
                                <input type="email" placeholder="თქვენი ელ-ფოსტა" className="form-control border-0 shadow-none p-3" style={{ fontSize: '14px' }} />
                                <Button className="btn m-1 fw-bolder title_font" variant="my-btn-blue">გამოწერა</Button>
                            </div>
                        </form>
                    </div>

                    <div className='col-md-6 hidden-footer-tab col-sm-12 mb-4'>
                        <div className=" d-flex flex-row flex-wrap justify-content-center justify-content-md-end gap-3">
                            <Image className="rounded-2 hover-zoom custom-footer-img img-fluid" src="/assets/img/example/home-about.png" alt="Color" width={130} height={130} />
                            <Image className="rounded-2 hover-zoom custom-footer-img img-fluid" src="/assets/img/example/home-about.png" alt="Photo" width={130} height={130} />
                            <Image className="rounded-2 hover-zoom custom-footer-img img-fluid" src="/assets/img/example/home-about.png" alt="Banner" width={130} height={130} />
                        </div>
                    </div>
                </div>

                {/* ---------- Bottom Footer ---------- */}
                <div className="text-center  row justify-content-between border-top border-secondary pt-3">
                    <div className="col-xl-6 text-xl-start">ყველა უფლება დაცულია © 2025</div>
                    <div className="col-xl-6 text-xl-end">Designed By: <span className="">Printplus.Ge</span></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
