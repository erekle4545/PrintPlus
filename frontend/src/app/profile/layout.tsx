"use client";
import React from "react";
import styles from "./Profile.module.css";
import UserIcon from "@/assets/icons/user/userProfileIcon.svg";
import MyDetailsIcon from "@/assets/icons/user/my_details.svg";
import OrderHistoryIcon from "@/assets/icons/user/order-history.svg";
import AttentionIcon from "@/assets/icons/user/attention.svg";
import KeyIcon from "@/assets/icons/user/key.svg";
import LogOutIcon from "@/assets/icons/user/logout.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cover from "@/components/theme/header/cover/cover";
import {HeaderTitle} from "@/components/theme/page/components/headerTitle";
import {NavLink} from "react-bootstrap";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menu = [
        { icon: <MyDetailsIcon />, title: "პირადი ინფორმაცია", path: "/profile" },
        { icon: <OrderHistoryIcon />, title: "ჩემი შეკვეთები", path: "/profile/my-orders" },
        { icon: <AttentionIcon />, title: "შეკვეთების ისტორია", path: "/profile/orders-history" },
        { icon: <KeyIcon />, title: "პაროლის შეცვლა", path: "/profile/change-password" },
        { icon: <LogOutIcon />, title: "გასვლა", path: "#" },
    ];

    return (<>
            <Cover />
            <div className="container py-4">
                <HeaderTitle title="პირადი ინფორმაცია" slug={[]} />

                <div className="row">
                    <div className="col-sm-12 col-xl-4 col-lg-4" >
                        <div className={styles.sidebar} >
                            <div className={styles.userProfilePanel}>
                                <div><UserIcon /></div>
                                <div className={styles.usernameEmail}>
                                    <h1>გოგა პაიკიძე</h1>
                                    <span className="text_font muted">info@printplus.ge</span>
                                </div>
                            </div>

                            <ul className={styles.sidebarNav}>
                                {menu.map((item) => (
                                    <li key={item.title} >
                                        <Link
                                            href={item.path}
                                            className={`title_font d-flex gap-2 align-items-center fw-bolder ${
                                                pathname === item.path ? styles.active : ""
                                            }`}
                                        >
                                            {item.icon} {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xl-8 col-lg-8">{children}</div>
                </div>
            </div>
        </>
    );
}
