
"use client";

import React from "react";
import './langSwitcherSkeleton.css';

const LangSwitcherSkeleton: React.FC = () => {
    return (
        <div className="me-xl-4 me-md-3 d-none d-md-block">
            <div className="lang-wrapper">
                <div className="skeleton-lang-btn"></div>
            </div>
        </div>
    );
};

export default LangSwitcherSkeleton;