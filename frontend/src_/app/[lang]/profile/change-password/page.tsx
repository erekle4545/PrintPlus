"use client";

import React, { useState } from "react";
import styles from "../Profile.module.css";
import TextField from "@/shared/components/ui/textfield/Textfield";
import { Alert } from "@/shared/components/ui/alert/alert";
import Button from "@/shared/components/ui/button/Button";
import { useChangePassword } from "@/shared/hooks//profile/useChangePassword";

export default function ChangePassword() {
    const { loading, error, success, updatePassword, resetState } = useChangePassword();

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });
    const [showAlert, setShowAlert] = useState(false);

    // ფორმის ცვლილებების დამუშავება
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setShowAlert(false);
        resetState();
    };

    // ფორმის გაგზავნა
    const handleSubmit = async () => {
        // ვალიდაცია
        if (!formData.current_password || !formData.new_password || !formData.new_password_confirmation) {
            setShowAlert(true);
            return;
        }

        // პაროლების შემოწმება
        if (formData.new_password !== formData.new_password_confirmation) {
            setShowAlert(true);
            return;
        }

        // პაროლის სიგრძის შემოწმება
        if (formData.new_password.length < 8) {
            setShowAlert(true);
            return;
        }

        try {
            await updatePassword(formData);
            // წარმატების შემთხვევაში ფორმის გასუფთავება
            setFormData({
                current_password: "",
                new_password: "",
                new_password_confirmation: ""
            });
        } catch (err) {
            console.error('Password change error:', err);
        }
    };

    return (
        <div data-aos="fade-up">
            {/* Error Alert */}
            {(showAlert || error) && (
                <div className={styles.errorBox}>
                    <Alert
                        className={"w-100"}
                        message={
                            error ||
                            (formData.new_password !== formData.new_password_confirmation
                                ? "პაროლები არ ემთხვევა"
                                : formData.new_password.length < 8
                                    ? "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს"
                                    : "გთხოვთ შეავსოთ ყველა ველი")
                        }
                        type="error"
                    />
                </div>
            )}

            {/* Success Alert */}
            {success && (
                <div className={styles.successBox}>
                    <Alert
                        className={"w-100"}
                        message="პაროლი წარმატებით შეიცვალა"
                        type="success"
                    />
                </div>
            )}

            {/* Form */}
            <div className={styles.formWrapper}>
                <TextField
                    label="ძველი პაროლი"
                    placeholder="********"
                    type="password"
                    className="text_font"
                    value={formData.current_password}
                    onChange={(e) => handleChange("current_password", e.target.value)}
                    disabled={loading}
                />
                <TextField
                    label="ახალი პაროლი"
                    placeholder="********"
                    type="password"
                    className="text_font"
                    value={formData.new_password}
                    onChange={(e) => handleChange("new_password", e.target.value)}
                    disabled={loading}
                />
                <TextField
                    label="გაიმეორეთ პაროლი"
                    placeholder="********"
                    type="password"
                    className="text_font"
                    value={formData.new_password_confirmation}
                    onChange={(e) => handleChange("new_password_confirmation", e.target.value)}
                    disabled={loading}
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
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "იტვირთება..." : "შენახვა"}
                    </Button>
                </div>
            </div>
        </div>
    );
}