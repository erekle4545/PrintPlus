// shared/components/theme/header/menu/DesktopMenuSkeleton.tsx
'use client';

import React from 'react';
import './desktopMenuSkeleton.css';

export default function DesktopMenuSkeleton() {
    return (
        <div className="main-menu d-none d-xl-flex align-items-center gap-4">
            <div className="skeleton-menu-item"></div>
            <div className="skeleton-menu-item"></div>
            <div className="skeleton-menu-item"></div>
            <div className="skeleton-menu-item"></div>
            {/*<div className="skeleton-menu-item"></div>*/}
            {/*<div className="skeleton-menu-item"></div>*/}
        </div>
    );
}