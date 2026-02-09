"use client";

import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import TextField from "@/shared/components/ui/textfield/Textfield";
import { Alert } from "@/shared/components/ui/alert/alert";
import Button from "@/shared/components/ui/button/Button";
import { useProfile } from "@/shared/hooks/profile/useProfile";

// Skeleton Loader Component
const SkeletonLoader = () => {
    return (
        <div className={styles.profileSkeletonContainer}>
            {/* Skeleton Field 1 */}
            <div className={styles.profileSkeletonField}>
                <div className={styles.profileSkeletonLabel} />
                <div className={styles.profileSkeletonInput} />
            </div>

            {/* Skeleton Field 2 */}
            <div className={styles.profileSkeletonField}>
                <div className={styles.profileSkeletonLabel} />
                <div className={styles.profileSkeletonInput} />
            </div>

            {/* Skeleton Field 3 */}
            <div className={styles.profileSkeletonField}>
                <div className={styles.profileSkeletonLabel} />
                <div className={styles.profileSkeletonInput} />
            </div>

            {/* Skeleton Button */}
            <div className={styles.profileSkeletonButtonWrapper}>
                <div className={styles.profileSkeletonButton} />
            </div>
        </div>
    );
};

export default function ProfileForm() {
    const { profile, loading, error, updateProfile } = useProfile();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: ""
    });
    const [showAlert, setShowAlert] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // პროფილის მონაცემების ჩატვირთვა
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                email: profile.email || ""
            });
        }
    }, [profile]);

    // ფორმის ცვლილებების დამუშავება
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setShowAlert(false);
        setUpdateSuccess(false);
    };

    // ფორმის გაგზავნა
    const handleSubmit = async () => {
        // ვალიდაცია
        if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
            setShowAlert(true);
            return;
        }

        try {
            await updateProfile(formData);
            setUpdateSuccess(true);
            setShowAlert(false);
        } catch (err) {
            setShowAlert(true);
        }
    };

    // თუ იტვირთება და პროფილი არ არის, აჩვენე Skeleton
    if (loading && !profile) {
        return (
            <div data-aos="fade-up">
                <SkeletonLoader />
            </div>
        );
    }

    return (
        <div data-aos="fade-up">
            {/* Error Alert */}
            {(showAlert || error) && (
                <div className={styles.errorBox}>
                    <Alert
                        className={"w-100"}
                        message={error || "გთხოვთ შეავსოთ ყველა ველი"}
                        type="error"
                    />
                </div>
            )}

            {/* Success Alert */}
            {updateSuccess && (
                <div className={styles.successBox}>
                    <Alert
                        className={"w-100"}
                        message="მონაცემები წარმატებით განახლდა"
                        type="success"
                    />
                </div>
            )}

            {/* Form */}
            <div className={styles.formWrapper}>
                <TextField
                    label="სახელი და გვარი"
                    placeholder="თქვენი სახელი და გვარი"
                    className="text_font"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={loading}
                />
                <TextField
                    label="მობილური"
                    placeholder="მიუთითეთ მობილური ტელეფონი"
                    className="text_font"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={loading}
                />
                <TextField
                    label="ელ-ფოსტა"
                    placeholder="მიუთითეთ ელ-ფოსტა"
                    className="text_font"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
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