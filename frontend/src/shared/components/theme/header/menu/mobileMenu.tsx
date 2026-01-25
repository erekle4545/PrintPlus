// shared/components/theme/header/menu/mobileMenu.tsx
'use client';

import { useState } from 'react';
import { MenuItem } from '@/types/menu/menu';
import LocalizedLink from '@/shared/components/LocalizedLink/LocalizedLink';
import MenuArrow from '@/shared/assets/icons/menu/menuArrow.svg';
import {generateSlug} from "@/shared/utils/mix";

interface MobileMenuProps {
    items: MenuItem[];
    onClose: () => void;
}

export default function MobileMenu({ items, onClose }: MobileMenuProps) {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

    const toggleItem = (itemId: number) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const renderMenuItem = (item: MenuItem) => {
        if (!item.active) return null;

        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.id);
        const identifyId = item.category_id?item.category_id:item.page_id;
        const menuLink = generateSlug(item.info?.slug,identifyId,item.category_id? 'c':'p')
        if (hasChildren) {
            return (
                <div
                    key={item.id}
                    className={`rounded-2 overflow-hidden ${isExpanded ? 'my-bg-color' : ''}`}
                >
                    <button
                        className="w-100 d-flex fw-bolder align-items-center position-relative px-3 py-2 bg-transparent border-0"
                        onClick={() => toggleItem(item.id)}
                    >
                        <span className="position-absolute start-0 ps-3">
                            <MenuArrow
                                style={{
                                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s ease",
                                    color: isExpanded ? 'white' : 'black'
                                }}
                            />
                        </span>
                        <span className={`mx-auto ${isExpanded ? 'text-white' : 'text-dark'}`}>
                            {item.info?.title}
                        </span>
                    </button>

                    {isExpanded && (
                        <div className="d-flex flex-column rounded-bottom-2 text-center px-3 py-2 bg-white text-black">
                            {item.children?.map((child) => (
                                <div key={child.id}>
                                    {renderSubMenuItem(child)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div key={item.id} className="p-1 rounded-2 overflow-hidden">
                    <LocalizedLink
                        href={menuLink}
                        className="text-decoration-none"
                        onClick={onClose}
                    >
                        <div className="w-100 d-flex align-items-center position-relative">
                            <span className="position-absolute start-0 ps-3" style={{ width: '16px' }}></span>
                            <span className="mx-auto border-bottom text-dark fw-semibold">
                                {item.info?.title}
                            </span>
                        </div>
                    </LocalizedLink>
                </div>
            );
        }
    };

    const renderSubMenuItem = (item: MenuItem) => {
        if (!item.active) return null;

         const identifyId = item.category_id?item.category_id:item.page_id;

        const menuLink = generateSlug(item.info?.slug,identifyId,item.category_id? 'c':'p')

        return (
            <LocalizedLink
                key={item.id}
                href={menuLink}
                className="text-decoration-none text-dark py-1 d-block"
                onClick={onClose}
            >
                {item.info?.title}
            </LocalizedLink>
        );
    };

    return (
        <div className="container position-relative px-0 d-xl-none">
            <div className="d-xl-none container res-menu d-flex flex-column gap-2 bg-white text-black rounded-3 shadow mt-2 p-3">
                {items.map((item) => renderMenuItem(item))}
            </div>
        </div>
    );
}