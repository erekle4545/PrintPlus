// shared/components/theme/header/menu/desktopMenu.tsx
'use client';

import { MenuItem } from '@/types/menu/menu';
 import { useState } from 'react';
import MenuArrow from '@/shared/assets/icons/menu/menuArrow.svg';
import LocalizedLink from '@/shared/components/LocalizedLink/LocalizedLink';
import {generateSlug} from "@/shared/utils/mix";

interface DesktopMenuProps {
    items: MenuItem[];
}

export default function DesktopMenu({ items }: DesktopMenuProps) {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

    const renderMenuItem = (item: MenuItem, depth: number = 0) => {
        if (!item.active) return null;

        const hasChildren = item.children && item.children.length > 0;
        const identifyId = item.category_id?item.category_id:item.page_id;

        const url = generateSlug(item.info?.slug,identifyId,item.category_id? 'c':'p')

        const menuLink = item.info?.link || url || '#';

        if (depth === 0) {
            // Top level menu items
            if (hasChildren) {
                return (
                    <div
                        key={item.id}
                        className="dropdown"
                        onMouseEnter={() => setActiveDropdown(item.id)}
                        onMouseLeave={() => {
                            setActiveDropdown(null);
                            setActiveSubmenu(null);
                        }}
                    >
                        <div className="menu-link d-inline-flex align-items-center gap-1">
                            {item.info?.title} <MenuArrow />
                        </div>
                        <ul className={`dropdown-menu ${activeDropdown === item.id ? 'show' : ''}`}>
                            {item.children?.map((child) => renderMenuItem(child, depth + 1))}
                        </ul>
                    </div>
                );
            } else {
                return (
                    <LocalizedLink key={item.id} href={menuLink} className="menu-link">
                        {item.info?.title}
                    </LocalizedLink>
                );
            }
        } else if (depth === 1) {
            // First level dropdown items
            if (hasChildren) {
                return (
                    <li
                        key={item.id}
                        className="dropdown-submenu position-relative"
                        onMouseEnter={() => setActiveSubmenu(item.id)}
                        onMouseLeave={() => setActiveSubmenu(null)}
                    >
                        <div className="dropdown-item d-inline-flex align-items-center gap-1">
                            {item.info?.title} <MenuArrow />
                        </div>
                        <ul className={`dropdown-menu position-absolute ${activeSubmenu === item.id ? 'show' : ''}`}>
                            {item.children?.map((child) => renderMenuItem(child, depth + 1))}
                        </ul>
                    </li>
                );
            } else {
                return (
                    <li key={item.id}>
                        <LocalizedLink href={menuLink} className="dropdown-item">
                            {item.info?.title}
                        </LocalizedLink>
                    </li>
                );
            }
        } else {
            // Deeper nested items (depth 2+)
            return (
                <li key={item.id}>
                    <LocalizedLink href={menuLink} className="dropdown-item">
                        {item.info?.title}
                    </LocalizedLink>
                </li>
            );
        }
    };

    return (
        <div className="main-menu d-none d-xl-flex align-items-center gap-4">
            {items.map((item) => renderMenuItem(item))}
        </div>
    );
}