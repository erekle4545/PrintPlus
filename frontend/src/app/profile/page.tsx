"use client";

import React, { useState } from "react";
import styles from "./Profile.module.css";
import { HeaderTitle } from "@/components/theme/page/components/headerTitle";
import TextField from "@/components/ui/textfield/Textfield";
import { Alert } from "@/components/ui/alert/alert";
import TealCheckbox from "@/components/ui/tealCheckbox/tealCheckbox";
import Button from "@/components/ui/button/Button";

export default function ProfileForm() {
    const [cityOpen, setCityOpen] = useState(false);
    const [city, setCity] = useState("თბილისი");

    const cityOptions = ["თბილისი", "ბათუმი", "ქუთაისი", "ზუგდიდი"];

    return (
        <div data-aos="fade-up">

            {/* Alert */}
            <div className={styles.errorBox}>
                <Alert
                    className={"w-100"}
                    message="ჩვენი სერვისით სარგებლობისთვის, გთხოვთ შეავსოთ ყველა ველი"
                />
            </div>

            {/* Form */}
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
                        type="button"
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
                    <label
                        htmlFor="terms"
                        className="d-flex gap-1 align-items-center"
                    >
                        <TealCheckbox
                            className="text_font"
                            label={"ვეთანხმები პირობებს და პოლიტიკას"}
                        />
                        <a href="#" className="text_font">
                            (წესები და პირობები)
                        </a>
                    </label>
                </div>

                {/* Button */}
                <div className="text-center">
                    <Button
                        size={"sm"}
                        type={"button"}
                        variant={"my-btn-blue"}
                        className={
                            "justify-content-center title_font fw-bolder w-100"
                        }
                    >
                        შენახვა
                    </Button>
                </div>
            </div>
        </div>
    );
}
