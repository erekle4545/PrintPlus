"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";

const LangSwitcher: React.FC = () => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { currentLanguage, languages, changeLanguage, loading } = useLanguage();


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const handleChange = (language: Language) => {
        changeLanguage(language);
        setOpen(false);
    };

    const renderLabel = (code: string) => {
        if (code === "ka") return "ქარ";
        if (code === "en") return "ENG";
        if (code === "ru") return "РУС";
        return code.toUpperCase();
    };

    if (loading) {
        return (
            <div className="me-xl-4 me-md-3 d-none d-md-block">
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="me-xl-4 me-md-3 d-none d-md-block" ref={wrapperRef}>
            <div className="lang-wrapper">
                {/* pill button */}
                <button
                    type="button"
                    className="lang-select-btn"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {currentLanguage ? renderLabel(currentLanguage.code) : "ქარ"}
                </button>

                {/* dropdown card */}
                {open && (
                    <div className="lang-card">
                        {languages
                            .filter(lang => lang.status === 1) // მხოლოდ active ენები
                            .map((lang, index, array) => (
                                <React.Fragment key={lang.id}>
                                    <button
                                        type="button"
                                        className={`lang-option ${
                                            currentLanguage?.id === lang.id ? "lang-active" : ""
                                        }`}
                                        onClick={() => handleChange(lang)}
                                    >
                                        {renderLabel(lang.code)}
                                    </button>
                                    {index < array.length - 1 && (
                                        <div className="lang-divider" />
                                    )}
                                </React.Fragment>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LangSwitcher;