'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CartIcon from '@/assets/icons/menu/cartMenuIcon.svg';
import UserIcon from '@/assets/icons/menu/userIcon.svg';
import SearchIcon from '@/assets/icons/menu/searchIcon.svg';
import PhoneFill from '@/assets/icons/menu/phone-fill.svg';
import MobMenuIcon from '@/assets/icons/menu/mobMenuIcon.svg';
import CloseMobIcon from '@/assets/icons/menu/closeMobIcon.svg';
import MenuArrow from '@/assets/icons/menu/menuArrow.svg';
import DropdownCart from "@/components/theme/header/cart/dropdownCart";
import Slider from "@/components/theme/header/slider/slider";
import {usePathname} from "next/navigation";
import Cover from "@/components/theme/header/cover/cover";
import DesktopMenu from "@/components/theme/header/menu/desktopMenu";
import DropdownAuth from "@/components/theme/header/auth/dropdownAuth";
import LangSwitcher from "@/components/theme/header/language/LangSwitcher";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/*<header className="container-with-bg-image text-white py-xl-2 " >*/}
            <header className="container-with-bg-image text-white  " >
                <div className="container py-xl-2" >
                    <div className="d-flex justify-content-between align-items-center">
                        <Link href="/" className="text-white text-decoration-none h4 pt-3 pb-3 m-0">
                            <Image src="/assets/img/global/logo.svg" alt="ლოგო" width={177} height={40}/>
                        </Link>

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
                                {/*<div className="me-xl-4 me-md-3 d-none d-md-block">*/}
                                {/*    <div className="lang-card">*/}
                                {/*        <button className="lang-option lang-active">*/}
                                {/*            Eng*/}
                                {/*        </button>*/}

                                {/*        <div className="lang-divider"></div>*/}

                                {/*        <button className="lang-option">*/}
                                {/*            ქარ*/}
                                {/*        </button>*/}
                                {/*        <div className="lang-divider"></div>*/}

                                {/*        <button className="lang-option">*/}
                                {/*            Pyc*/}
                                {/*        </button>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                            </div>
                            <button className='border-0 bg-transparent'>
                                <SearchIcon className="top-menu-icon"/>
                            </button>

                            <div className="cart-hover-wrapper">
                                <button className="border-0 bg-transparent">
                                    <UserIcon className="top-menu-icon" />
                                </button>
                                <div className="cart-hover-panel auth-card-panel  bg-white shadow p-3 border">
                                    <DropdownAuth />
                                </div>
                            </div>


                            <div className="cart-hover-wrapper">
                                <button className="border-0 bg-transparent">
                                    <CartIcon className="top-menu-icon" />
                                </button>
                                <div className=" cart-hover-panel bg-white shadow p-3  border" >
                                    <DropdownCart />
                                </div>
                            </div>

                            <div className='ms-xl-4 ms-md-3 d-none d-md-block'>
                                <button className="my-btn-color-bg rounded-pill px-4 d-flex align-items-center gap-3">
                                    <PhoneFill className="top-menu-icon"/> კონტაქტი
                                </button>
                            </div>
                        </div>
                    </div>

                    {menuOpen && (
                        <div className="container position-relative px-0 d-xl-none">
                            <div
                                className="d-xl-none container  res-menu d-flex flex-column gap-2 bg-white text-black rounded-3 shadow mt-2 p-3">
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
                                            <Link href="/about" className="text-decoration-none ">ბაღზე ბაღდა</Link>
                                        </div>
                                    )}
                                </div>

                                {[{ text: "ბროლობით ბაღდა", href: "/services" },
                                    { text: "კავზე ბაღდა", href: "/products" },
                                    { text: "გალერეა", href: "/faq" }].map((item, index) => (
                                    <div key={index} className="p-1 rounded-2 overflow-hidden">
                                        <Link href={item.href} className="text-decoration-none">
                                            <div className="w-100 d-flex align-items-center position-relative">
                                                <span className="position-absolute start-0 ps-3" style={{ width: '16px' }}></span>
                                                <span className="mx-auto border-bottom text-dark fw-semibold">{item.text}</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}

                                <button className="d-block d-sm-none my-btn-color-bg rounded-pill px-4 py-2 mt-2 d-flex align-items-center justify-center gap-2">
                                    <PhoneFill className="top-menu-icon" /> კონტაქტი
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {pathname === '/'&& <Slider/> }
            </header>

        </>
    );
}
