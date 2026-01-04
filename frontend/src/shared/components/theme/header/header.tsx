// shared/components/theme/header/Header.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname, useParams } from "next/navigation";
import CartIcon from '@/shared/assets/icons/menu/cartMenuIcon.svg';
import UserIcon from '@/shared/assets/icons/menu/userIcon.svg';
import SearchIcon from '@/shared/assets/icons/menu/searchIcon.svg';
import PhoneFill from '@/shared/assets/icons/menu/phone-fill.svg';
import MobMenuIcon from '@/shared/assets/icons/menu/mobMenuIcon.svg';
import CloseMobIcon from '@/shared/assets/icons/menu/closeMobIcon.svg';
import DropdownCart from "@/shared/components/theme/header/cart/dropdownCart";
import Slider from "@/shared/components/theme/header/slider/slider";
import DesktopMenu from "@/shared/components/theme/header/menu/desktopMenu";
import MobileMenu from "@/shared/components/theme/header/menu/mobileMenu";
import LangSwitcher from "@/shared/components/theme/header/language/LangSwitcher";
import AuthDropdownWrapper from "@/shared/components/theme/header/auth/AuthDropdownWrapper";
import LocalizedLink from '@/shared/components/LocalizedLink/LocalizedLink';
import { useLanguage } from "@/context/LanguageContext";
import { useMenu } from "../../../hooks/useMenu";
import DesktopMenuSkeleton from "@/shared/components/theme/header/menu/loader/DesktopMenuSkeleton";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const params = useParams();
    const { t } = useLanguage();
    const { menu, loading, error } = useMenu();

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

                        {/*Desktop Menu*/}
                        {loading ? (
                            <div className="d-none d-xl-flex align-items-center">
                                {/*<span className="spinner-border spinner-border-sm text-white" role="status">*/}
                                {/*    <span className="visually-hidden">Loading...</span>*/}
                                {/*</span>*/}
                                <DesktopMenuSkeleton/>
                            </div>
                        ) : error ? (
                            <div className="d-none d-xl-block text-white-50 small">{error}</div>
                        ) : (
                            <DesktopMenu items={menu} />
                        )}

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

                    {/* Mobile Menu */}
                    {menuOpen && !loading && !error && (
                        <MobileMenu
                            items={menu}
                            onClose={() => setMenuOpen(false)}
                        />
                    )}
                </div>

                {/* Slider მხოლოდ home page-ზე */}
                {isHomePage && <Slider/>}
            </header>
        </>
    );
}