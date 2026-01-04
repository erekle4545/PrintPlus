'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {useLanguage} from "@/context/LanguageContext";
import Button from "@/shared/components/ui/button/Button";
import {LogOutIcon} from "lucide-react";
import OrderHistoryIconHeader from "@/shared/assets/icons/user/order-history_header.svg";
import MyDetailsIconHeader from "@/shared/assets/icons/user/my_details_header.svg";
import PasswordChangeIconKey from "@/shared/assets/icons/user/key_header.svg";

const DropdownUserMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const {t} = useLanguage();

    if (!user) return null;

    return (
        <div className="auth-card position-relative text_font">
            {/* Triangle pointer */}
            <div className="position-absolute top-0 start-50 translate-middle" style={{ marginTop: '-20px' }}>
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: '10px solid white',
                    }}
                />
            </div>

            {/* User Info */}
            <div className="text-center ">
                {/*<div className="d-flex justify-content-center mb-2">*/}
                {/*    <div*/}
                {/*        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"*/}
                {/*        style={{ width: '60px', height: '60px', fontSize: '24px' }}*/}
                {/*    >*/}
                {/*        <i className="bi bi-person-fill"></i>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <h5 className="mb-1 title_font text-dark fw-bolder">{user.name}</h5>
                <p className="text-muted small mb-0">{user.email}</p>
            </div>

            <hr className="my-2" />

            {/* Menu Items */}
            <div className="user-menu">
                {/*<Link*/}
                {/*    href="/dashboard"*/}
                {/*    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-bg-light"*/}
                {/*>*/}
                {/*    <i className="bi bi-speedometer2 me-2"></i>*/}
                {/*    <span className="text_font">მთავარი გვერდი</span>*/}
                {/*</Link>*/}
                <Link
                    href="/profile"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-bg-light"
                >
                    <span className={'me-2'}><MyDetailsIconHeader key={1}/></span>
                    <span className="text_font hover-team">{t('my.profile','my.profile')}</span>
                </Link>
                <Link
                    href="/profile/orders-history"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-bg-light"
                >
                    <span className={'me-2'}><OrderHistoryIconHeader key={2}/></span>
                    <span className="text_font">{t('orders.story','orders.story')}</span>
                </Link>
                <Link
                    href="/profile/change-password"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-bg-light"
                >
                    <span className={'me-2'}><PasswordChangeIconKey key={2}/></span>
                    <span className="text_font"> {t('profile.password.change','profile.password.change')}</span>
                </Link>
            </div>
            <hr className="my-2" />
            {/* Logout Button */}
            <div className={'d-flex justify-content-center '}>
                <Button
                    type={'button'}
                    onClick={logout}
                    variant={'my-btn-blue'}
                    startIcon={<LogOutIcon/>}
                    className={'w-50 text-center d-flex justify-content-center -auto'}
                >
                    {t('logout','logout')}
                </Button>
            </div>
        </div>
    );
};

export default DropdownUserMenu;