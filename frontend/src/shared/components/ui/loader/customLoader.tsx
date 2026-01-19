import Cover from "@/shared/components/theme/header/cover/cover";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CustomLoaderProps {
    cover?: boolean;
}

export default function CustomLoader({ cover = true }: CustomLoaderProps) {
    const { t } = useLanguage();

    return (
        <>
            {cover && <Cover />}

            <div className="container text-center mt-5 mb-5">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">
                        {t("loading", "loading")}
                    </span>
                </div>
            </div>
        </>
    );
}
