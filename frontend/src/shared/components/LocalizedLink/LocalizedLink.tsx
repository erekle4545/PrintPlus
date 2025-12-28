'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { UrlObject } from 'url';
import { defaultLanguage } from '../../config/i18n';

type Href = string | UrlObject;

interface LocalizedLinkProps {
    href: Href;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

function isExternalUrl(href: string) {
    return (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
    );
}

function localizeHref(href: Href, lang: string): Href {
    // Handle string href
    if (typeof href === 'string') {
        if (!href) return `/${lang}`;
        if (isExternalUrl(href)) return href;

        // Ensure leading slash
        const normalized = href.startsWith('/') ? href : `/${href}`;

        // Already localized
        if (normalized.startsWith(`/${lang}`)) return normalized;

        // Root route
        if (normalized === '/') return `/${lang}`;

        // Prefix lang
        return `/${lang}${normalized}`;
    }

    // Handle UrlObject href
    const pathname = href?.pathname;

    // If pathname is not string, just return as-is
    if (typeof pathname !== 'string') return href;

    // Ensure leading slash
    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

    // Already localized
    if (normalizedPathname.startsWith(`/${lang}`)) return href;

    // Root route
    if (normalizedPathname === '/') {
        return { ...href, pathname: `/${lang}` };
    }

    return { ...href, pathname: `/${lang}${normalizedPathname}` };
}

const LocalizedLink: React.FC<LocalizedLinkProps> = ({
                                                         href,
                                                         children,
                                                         className,
                                                         onClick,
                                                     }) => {
    const params = useParams();
    const lang = (params?.lang as string) || defaultLanguage;

    const localizedHref = localizeHref(href, lang);

    return (
        <Link href={localizedHref} className={className} onClick={onClick}>
            {children}
        </Link>
    );
};

export default LocalizedLink;
