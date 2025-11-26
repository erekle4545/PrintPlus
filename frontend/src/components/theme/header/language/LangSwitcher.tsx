"use client";

import React, { useState } from "react";

type LangCode = "ka" | "en" | "ru";

interface LangSwitcherProps {
    defaultLang?: LangCode;
    onChange?: (lang: LangCode) => void; // optional callback for i18n
}

const LangSwitcher: React.FC<LangSwitcherProps> = ({
       defaultLang = "ka",
       onChange,
   }) => {
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState<LangCode>(defaultLang);

    const handleChange = (code: LangCode) => {
        setLang(code);
        setOpen(false);

        if (onChange) {
            onChange(code);
        }
        // აქ შეგიძლია ჩასვა შენი i18n ლოგიკა
        // i18n.changeLanguage(code);
    };

    const renderLabel = (code: LangCode) => {
        if (code === "ka") return "ქარ";
        if (code === "en") return "ENG";
        return "РУС";
    };

    return (
        <div className="me-xl-4 me-md-3 d-none d-md-block">
            <div className="lang-wrapper">
                {/* pill button (ქარ + ისარი) */}
                <button
                    type="button"
                    className="lang-select-btn"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {renderLabel(lang)}
                </button>

                {/* dropdown card */}
                {open && (
                    <div className="lang-card">
                        <button
                            type="button"
                            className={
                                "lang-option " +
                                (lang === "en" ? "lang-active" : "")
                            }
                            onClick={() => handleChange("en")}
                        >
                            Eng
                        </button>

                        <div className="lang-divider" />

                        <button
                            type="button"
                            className={
                                "lang-option " +
                                (lang === "ru" ? "lang-active" : "")
                            }
                            onClick={() => handleChange("ru")}
                        >
                            Pyc
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LangSwitcher;
