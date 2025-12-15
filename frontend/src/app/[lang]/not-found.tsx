"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import Cover from "@/shared/components/theme/header/cover/cover";
import LocalizedLink from "../../shared/components/LocalizedLink/LocalizedLink";

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <div>
            <Cover />
            <div className='container text-center p-5' data-aos="fade">
                <h1 className="title_font fw-bolder" style={{color:'#FF5D5D'}}>
                    404
                </h1>
                <h2 className="title_font mb-3">
                    {t('page_not_found', 'გვერდი ვერ მოიძებნა')}
                </h2>
                <p className="text_font text-muted mb-4">
                    {t('page_not_found_desc', 'ბოდიშით, თქვენ მიერ მოთხოვნილი გვერდი არ არსებობს ან წაიშალა.')}
                </p>

                <img
                    src={'/assets/img/global/404.svg'}
                    alt="404"
                    className="img-fluid mb-4"
                    style={{maxWidth: '400px'}}
                />

                <div className="mt-4">
                    <LocalizedLink
                        href="/frontend/public"
                        className="btn btn-primary btn-lg text_font"
                    >
                        <i className="bi bi-house-door me-2"></i>
                        {t('back_to_home', 'მთავარ გვერდზე დაბრუნება')}
                    </LocalizedLink>
                </div>
            </div>
        </div>
    );
}