"use client";
import React, {useEffect} from "react";
import styles from "./Profile.module.css";
import UserIcon from "@/shared/assets/icons/user/userProfileIcon.svg";
import MyDetailsIcon from "@/shared/assets/icons/user/my_details.svg";
import OrderHistoryIcon from "@/shared/assets/icons/user/order-history.svg";
import KeyIcon from "@/shared/assets/icons/user/key.svg";
import LogOutIcon from "@/shared/assets/icons/user/logout.svg";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import Cover from "@/shared/components/theme/header/cover/cover";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";
import {useLanguage} from "@/context/LanguageContext";
import {useAuth} from "@/context/AuthContext";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const pathname = usePathname();
    const {t} = useLanguage();
    const {user,loading, logout, checkAuth} = useAuth();

    // check auth
    useEffect(() => {
        // Re-check auth once when the page mounts
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    useEffect(() => {
        // Redirect if user is not authenticated
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <>
                <Cover />
                <div className="container text-center mt-5 mb-5">
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">{t('loading','loading')}</span>
                    </div>
                </div>
            </>
        );
    }

    if (!user) {
        router.push("/login");
        // While redirecting
        return null;
    }

    // if user

    const menu = [
        {
            icon: MyDetailsIcon,
            title: t('my.profile','my.profile'),
            path: "/profile"
        },
        {
            icon: OrderHistoryIcon,
            title: t('orders.story'),
            path: "/profile/orders-history"
        },
        {
            icon: KeyIcon,
            title: t('profile.password.change'),
            path: "/profile/change-password"
        },
        {
            icon: LogOutIcon,
            title: t('logout','logout'),
            path: "#",
            isLogout: true
        },
    ];

    const handleMenuClick = (item: any, e: React.MouseEvent) => {
        if (item.isLogout) {
            e.preventDefault();
            logout();
        }
    };

    return (<>
            <Cover />

            <div className="container py-4">
                <HeaderTitle title="პირადი ინფორმაცია" slug={''} />

                <div className="row">
                    <div className="col-sm-12 col-xl-4 col-lg-4" >
                        <div className={styles.sidebar} >
                            <div className={styles.userProfilePanel}>
                                <div><UserIcon /></div>
                                <div className={styles.usernameEmail}>
                                    <h1>{user?.name || '...'}</h1>
                                    <span className="text_font muted">{user?.email || '...'}</span>
                                </div>
                            </div>

                            <ul className={styles.sidebarNav}>
                                {menu.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <li key={item.title} >
                                            <Link
                                                href={item.path}
                                                onClick={(e) => handleMenuClick(item, e)}
                                                className={`title_font d-flex gap-2 align-items-center fw-bolder ${
                                                    pathname === item.path ? styles.active : ""
                                                }`}
                                            >
                                                <IconComponent /> {item.title}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xl-8 col-lg-8">{children}</div>
                </div>
            </div>
        </>
    );
}