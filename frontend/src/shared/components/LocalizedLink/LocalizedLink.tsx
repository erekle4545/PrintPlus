'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { defaultLanguage } from '../../config/i18n';
import React from 'react';

interface LocalizedLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const LocalizedLink: React.FC<LocalizedLinkProps> = ({
         href,
         children,
         className,
         onClick
     }) => {
    const params = useParams();
    const lang = (params?.lang as string) || defaultLanguage;

    // თუ href უკვე იწყება ენით, არ დავამატოთ ხელახლა
    const localizedHref = href?.startsWith(`/${lang}`)
        ? href
        : `/${lang}/${href}`;

    return (
        <Link
            href={localizedHref}
            className={className}
            onClick={onClick}
        >
            {children}
        </Link>
    );
};

export default LocalizedLink;