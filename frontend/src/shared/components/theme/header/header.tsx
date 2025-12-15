'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useParams } from "next/navigation";
import CartIcon from '@/shared/assets/icons/menu/cartMenuIcon.svg';
import UserIcon from '@/shared/assets/icons/menu/userIcon.svg';
import SearchIcon from '@/shared/assets/icons/menu/searchIcon.svg';
import PhoneFill from '@/shared/assets/icons/menu/phone-fill.svg';
import MobMenuIcon from '@/shared/assets/icons/menu/mobMenuIcon.svg';
import CloseMobIcon from '@/shared/assets/icons/menu/closeMobIcon.svg';
import MenuArrow from '@/shared/assets/icons/menu/menuArrow.svg';
import DropdownCart from "@/shared/components/theme/header/cart/dropdownCart";
import Slider from "@/shared/components/theme/header/slider/slider";
import DesktopMenu from "@/shared/components/theme/header/menu/desktopMenu";
import LangSwitcher from "@/shared/components/theme/header/language/LangSwitcher";
import AuthDropdownWrapper from "@/shared/components/theme/header/auth/AuthDropdownWrapper";
import LocalizedLink from '@/shared/components/LocalizedLink/LocalizedLink';
import {useLanguage} from "@/context/LanguageContext";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const pathname = usePathname();
    const params = useParams();
    const { t } = useLanguage();

    // შეამოწმეთ არის თუ არა home page
    const isHomePage = pathname === `/${params.lang}`;

    return (
        <>
            <header className="container-with-bg-image text-white">
                <div className="container py-xl-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <LocalizedLink href="/" className="text-white text-decoration-none h4 pt-3 pb-3 m-0">
                            <Image src="/assets/img/global/logo.svg" alt="ლოგო" width={177} height={40}/>
                        </LocalizedLink>

                        {/* მობილური ღილაკი */}
                        <div className="d-flex d-md-none justify-content-end order-3">
                            <button
                                className="border-0 bg-transparent fs-3"
                                type="button"
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                {menuOpen ? <CloseMobIcon className="top-menu-icon"/> :
                                    <MobMenuIcon className="top-menu-icon"/>}
                            </button>
                        </div>

                        {/* პლანშეტზე */}
                        <div className="d-xl-none d-none d-md-flex align-items-center order-0 ms-auto me-lg-3">
                            <button
                                className="border-0 bg-transparent fs-3 ms-auto me-lg-3"
                                type="button"
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                {menuOpen ? <CloseMobIcon className="top-menu-icon"/> :
                                    <MobMenuIcon className="top-menu-icon"/>}
                            </button>
                        </div>

                        {/*Desktop*/}
                        <DesktopMenu/>

                        <div className="d-flex align-items-center gap-1">
                            <div className='me-xl-4 me-md-3 d-none d-md-block'>
                                <LangSwitcher/>
                            </div>

                            <button className='border-0 bg-transparent'>
                                <SearchIcon className="top-menu-icon"/>
                            </button>

                            <div className="cart-hover-wrapper">
                                <button className="border-0 bg-transparent">
                                    <UserIcon className="top-menu-icon" />
                                </button>
                                <div className="cart-hover-panel auth-card-panel bg-white shadow p-3 border">
                                    <AuthDropdownWrapper />
                                </div>
                            </div>

                            <div className="cart-hover-wrapper">
                                <button className="border-0 bg-transparent">
                                    <CartIcon className="top-menu-icon" />
                                </button>
                                <div className="cart-hover-panel bg-white shadow p-3 border">
                                    <DropdownCart />
                                </div>
                            </div>

                            <div className='ms-xl-4 ms-md-3 d-none d-md-block'>
                                <button className="my-btn-color-bg rounded-pill px-4 d-flex align-items-center gap-3">
                                    <PhoneFill className="top-menu-icon"/>  {t('contact','კონტაქტი')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {menuOpen && (
                        <div className="container position-relative px-0 d-xl-none">
                            <div className="d-xl-none container res-menu d-flex flex-column gap-2 bg-white text-black rounded-3 shadow mt-2 p-3">
                                <div className={`rounded-2 overflow-hidden ${submenuOpen ? 'my-bg-color' : 'bg-'}`}>
                                    <button
                                        className="w-100 d-flex fw-bolder align-items-center position-relative px-3 py-2 bg-transparent border-0"
                                        onClick={() => setSubmenuOpen(prev => !prev)}
                                    >
                                        <span className="position-absolute start-0 ps-3">
                                            <MenuArrow
                                                style={{
                                                    transform: submenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                    transition: "transform 0.2s ease",
                                                    color: submenuOpen ? 'white' : 'black'
                                                }}
                                            />
                                        </span>
                                        <span className={`mx-auto ${submenuOpen ? 'text-white' : 'text-dark'}`}>
                                            საერთაშორისო ბაღდა
                                        </span>
                                    </button>

                                    {submenuOpen && (
                                        <div className="d-flex flex-column rounded-bottom-2 text-center px-3 py-2 bg-white text-black">
                                            <LocalizedLink href="/about" className="text-decoration-none">
                                                ბაღზე ბაღდა
                                            </LocalizedLink>
                                        </div>
                                    )}
                                </div>

                                {[
                                    { text: "ბროლობით ბაღდა", href: "/services" },
                                    { text: "კავზე ბაღდა", href: "/products" },
                                    { text: "გალერეა", href: "/pictures" }
                                ].map((item, index) => (
                                    <div key={index} className="p-1 rounded-2 overflow-hidden">
                                        <LocalizedLink href={item.href} className="text-decoration-none">
                                            <div className="w-100 d-flex align-items-center position-relative">
                                                <span className="position-absolute start-0 ps-3" style={{ width: '16px' }}></span>
                                                <span className="mx-auto border-bottom text-dark fw-semibold">
                                                    {item.text}
                                                </span>
                                            </div>
                                        </LocalizedLink>
                                    </div>
                                ))}

                                <button className="d-block d-sm-none my-btn-color-bg rounded-pill px-4 py-2 mt-2 d-flex align-items-center justify-center gap-2">
                                    <PhoneFill className="top-menu-icon" />  {t('contact','კონტაქტი')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Slider მხოლოდ home page-ზე */}
                {isHomePage && <Slider/>}
            </header>
        </>
    );
}