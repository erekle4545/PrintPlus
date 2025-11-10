"use client";

import React, { useState } from "react";
import styles from "./ProfileForm.module.css";
import Cover from "@/components/theme/header/cover/cover";
import { HeaderTitle } from "@/components/theme/page/components/headerTitle";
import TextField from "@/components/ui/textfield/Textfield";
import { Alert } from "@/components/ui/alert/alert";
import UserIcon from "@/assets/icons/user/userProfileIcon.svg";
import MyDetailsIcon from "@/assets/icons/user/my_details.svg";
import OrderHistoryIcon from "@/assets/icons/user/order-history.svg";
import AttentionIcon from "@/assets/icons/user/attention.svg";
import KeyIcon from "@/assets/icons/user/key.svg";
import LogOutIcon from "@/assets/icons/user/logout.svg";
import TealCheckbox from "@/components/ui/tealCheckbox/tealCheckbox";
import Button from "@/components/ui/button/Button";

export default function ProfileForm() {
    const [cityOpen, setCityOpen] = useState(false);
    const [city, setCity] = useState("თბილისი");
    const [region, setRegion] = useState("ბათუმი");

    const cityOptions = ["თბილისი", "ბათუმი", "ქუთაისი", "ზუგდიდი"];

    const userMenuSide = () => {
        return (
            <div className={styles.sidebar} data-aos="fade-up">
                <div className={styles.userProfilePanel}>
                    <div>
                        <UserIcon />
                    </div>
                    <div className={styles.usernameEmail}>
                        <h1>გოგა პაიკიძე</h1>
                        <span className="text_font muted">info@printplus.ge</span>
                    </div>
                </div>

                <ul className={styles.sidebarNav}>
                    <li className={' title_font fw-bolder'}>
                        <div className='d-flex align-items-center'>
                          <div> <MyDetailsIcon/></div>
                            <div>პირადი ინფორმაცია</div>
                        </div>
                    </li>
                    <li className={' title_font fw-bolder'}>
                        <OrderHistoryIcon/> ჩემი შეკვეთები
                    </li>
                    <li className={' title_font fw-bolder'}>
                        <AttentionIcon/> შეკვეთების ისტორია
                    </li>
                    <li className={' title_font fw-bolder'}>
                        <KeyIcon/> პაროლის შეცვლა
                    </li>
                    <li className={' title_font fw-bolder'}>
                        <LogOutIcon/> გასვლა
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <>
            <Cover />
            <div className="container py-4" data-aos="fade-up">
                <HeaderTitle title="პირადი ინფორმაცია" slug={[]} />

                <div className="row">
                    <div className="col-sm-12 col-xl-4 col-lg-4">{userMenuSide()}</div>

                    <div className="col-sm-12 col-xl-8 col-lg-8">
                        <div className={styles.errorBox}>
                            <Alert  className={'w-100'}  message="ჩვენი სერვისით სარგებლობისთვის, გთხოვთ შეავსოთ ყველა ველი" />
                        </div>

                        <div className={styles.formWrapper}>
                            <TextField
                                label="სახელი და გვარი"
                                placeholder="თქვენი სახელი და გვარი"
                                className="text_font"
                            />
                            <TextField
                                label="მობილური"
                                placeholder="მიუთითეთ მობილური ტელეფონი"
                                className="text_font"
                            />
                            <TextField
                                label="ელ-ფოსტა"
                                placeholder="მიუთითეთ ელ-ფოსტა"
                                className="text_font"
                            />
                            <TextField
                                label="პაროლი"
                                placeholder="********"
                                type="password"
                                className="text_font"
                            />
                            <TextField
                                label="გაიმეორეთ პაროლი"
                                placeholder="********"
                                type="password"
                                className="text_font"
                            />

                            {/* Dropdown */}
                            <div className={styles.dropdown}>
                                <button
                                    className={styles.dropdownToggle}
                                    onClick={() => setCityOpen(!cityOpen)}
                                >
                                    {city} <span className={styles.dropdownArrow}>▾</span>
                                </button>
                                {cityOpen && (
                                    <ul className={styles.dropdownMenu}>
                                        {cityOptions.map((option) => (
                                            <li
                                                key={option}
                                                className={styles.dropdownItem}
                                                onClick={() => {
                                                    setCity(option);
                                                    setCityOpen(false);
                                                }}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Checkbox */}
                            <div className={styles.checkboxWrapper}>
                                <label htmlFor="terms" className=' d-flex gap-1 align-items-center'>
                                    <TealCheckbox className='text_font' label={'ვეთანხმები პირობებს და პოლიტიკას'} />
                                    <a href="#" className='text_font'>(წესები და პირობები)</a>
                                </label>
                            </div>
                            <div className='text-center '>
                                <Button size={'sm'} type={'button'} variant={'my-btn-blue'} className={'justify-content-center title_font fw-bolder w-100'}>შენახვა</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
