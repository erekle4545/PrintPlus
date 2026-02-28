'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Button from "@/shared/components/ui/button/Button";
import {useContact} from "@/shared/hooks/global/useContact";
import {useLanguage} from "@/context/LanguageContext";
import {getAllImages} from "@/shared/utils/imageHelper";
import {useMenu} from "@/shared/hooks/useMenu";
import LocalizedLink from "@/shared/components/LocalizedLink/LocalizedLink";
import {generateSlug} from "@/shared/utils/mix";

const Footer = () => {
    const { data, loading } = useContact();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const {t} = useLanguage();
    const {bottomMenu,bottomMenuRules} = useMenu();
    const handleToggleMenu = (id: string): void => {
        setOpenMenu(prev => (prev === id ? null : id));
    };

    // თუ იტვირთება ან data არ არის, ვაჩვენებთ skeleton-ს ან ძველ სტატიკურ data-ს
    const contactInfo = data ? {
        address: data.info?.address,
        phone: data.phone,
        email: data.email,
        title: data.info?.title,
    } : {
        address: '...',
        phone: '...',
        email: '...',
        title: '...'
    };

    const footerData = [
        {
            id: 'contact',
            title: t('contact.info','საკონტაქტო ინფორმაცია'),
            content: (
                <div className="text-white">
                    <p className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i> {contactInfo.address}</p>
                    <p className="mb-2"><i className="bi bi-telephone-fill me-2"></i> {contactInfo.phone}</p>
                    <p><i className="bi bi-envelope-fill me-2"></i> {contactInfo.email}</p>
                </div>
            )
        },
        {
            id: 'navigation',
            title: t('site.navigation','საიტის ნავიგაცია'),
            content: (
                <ul className="list-unstyled mb-0">
                    {bottomMenu && bottomMenu.length > 0 ? (
                        bottomMenu.map((menuItem) => {
                            const identifyId = menuItem.category_id ? menuItem.category_id : menuItem.page_id;
                            const url = generateSlug(
                                menuItem.info?.slug,
                                identifyId,
                                menuItem.category_id ? 'c' : 'p'
                            );
                            const menuLink = menuItem.info?.link || url || '#';

                            return (
                                <li key={menuItem.id}>
                                    <LocalizedLink
                                        href={menuLink}
                                        className="text-white d-block mb-1"
                                    >
                                        {menuItem.info?.title}
                                    </LocalizedLink>

                                    {menuItem.children && menuItem.children.length > 0 && (
                                        <ul className="list-unstyled ms-3 mt-1">
                                            {menuItem.children.map((child) => {
                                                const childIdentifyId = child.category_id ? child.category_id : child.page_id;
                                                const childUrl = generateSlug(
                                                    child.info?.slug,
                                                    childIdentifyId,
                                                    child.category_id ? 'c' : 'p'
                                                );
                                                const childMenuLink = child.info?.link || childUrl || '#';

                                                return (
                                                    <li key={child.id}>
                                                        <LocalizedLink
                                                            href={childMenuLink}
                                                            className="text-white-50 d-block mb-1"
                                                        >
                                                            {child.info?.title}
                                                        </LocalizedLink>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-white-50"> </li>
                    )}
                </ul>
            )
        },
        {
            id: 'links',
            title: t('site.urls','სასარგებლო ბმულები'),
            content: (
                <ul className="list-unstyled mb-0">
                    {bottomMenuRules && bottomMenuRules.length > 0 ? (
                        bottomMenuRules.map((menuItem) => {
                            const identifyId = menuItem.category_id ? menuItem.category_id : menuItem.page_id;
                            const url = generateSlug(
                                menuItem.info?.slug,
                                identifyId,
                                menuItem.category_id ? 'c' : 'p'
                            );
                            const menuLink = menuItem.info?.link || url || '#';

                            return (
                                <li key={menuItem.id}>
                                    <LocalizedLink
                                        href={menuLink}
                                        className="text-white d-block mb-1"
                                    >
                                        {menuItem.info?.title}
                                    </LocalizedLink>

                                    {menuItem.children && menuItem.children.length > 0 && (
                                        <ul className="list-unstyled ms-3 mt-1">
                                            {menuItem.children.map((child) => {
                                                const childIdentifyId = child.category_id ? child.category_id : child.page_id;
                                                const childUrl = generateSlug(
                                                    child.info?.slug,
                                                    childIdentifyId,
                                                    child.category_id ? 'c' : 'p'
                                                );
                                                const childMenuLink = child.info?.link || childUrl || '#';

                                                return (
                                                    <li key={child.id}>
                                                        <LocalizedLink
                                                            href={childMenuLink}
                                                            className="text-white-50 d-block mb-1"
                                                        >
                                                            {child.info?.title}
                                                        </LocalizedLink>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-white-50"></li>
                    )}
                </ul>
            )
        },
        {
            id: 'social',
            title: t('social.networks','სოციალური მედია'),
            content: (
                <div className="text_font">
                    {data?.meta?.facebook&&<div>
                        <a href={data?.meta?.facebook} target={'_blank'} className="text-white text_font">
                            <i className="bi bi-facebook me-2"></i>Facebook</a>
                    </div>}
                    {data?.meta?.instagram&&<div>
                        <a href={data?.meta?.instagram} target={'_blank'} className="text-white text_font">
                            <i className="bi bi-instagram me-2"></i>Instagram</a>
                    </div>}
                    {data?.meta?.youtube&&<div>
                        <a href={data?.meta?.youtube} target={'_blank'} className="text-white text_font">
                            <i className="bi bi-youtube me-2"></i>Youtube</a>
                    </div>}
                </div>
            )
        }
    ];


    // photo gallery
    const footerGallery = () => {
        return  getAllImages(data?.info?.covers ,14,'processed')?.map((item,index)=>{
            return (<Image key={index} className="rounded-2 hover-zoom custom-footer-img img-fluid" src={item} alt="Color" width={130} height={130} />);
        });
    }


    return (
        <footer className="container-with-bg-image text-white py-5">
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
                            {footerGallery()}
                        </div>
                    </div>
                </div>

                {/* ---------- Bottom Footer ---------- */}
                <div className="text-center  row justify-content-between border-top border-secondary pt-3">
                    <div className="col-xl-6 text-xl-start">{t('all.right.resaved')}  © 2025</div>
                    <div className="col-xl-6 text-xl-end">Designed By: <span className="">{contactInfo.title}</span></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
