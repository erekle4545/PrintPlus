"use client";

import React from "react";
import styles from "../Profile.module.css";
 import TextField from "@/components/ui/textfield/Textfield";
import { Alert } from "@/components/ui/alert/alert";
import Button from "@/components/ui/button/Button";

export default function ChangePassword() {

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
                    label="ძველი პაროლი"
                    placeholder="********"
                    type="password"
                    className="text_font"
                />
                <TextField
                    label="ახალი პაროლი"
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
