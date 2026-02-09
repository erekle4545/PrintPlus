import DynamicPageClient from './DynamicPageClient';

import { notFound } from 'next/navigation';

interface DynamicPageProps {
    params: Promise<{
        lang: string;
        category: string;
    }>;
}

// Routes that have their own folders (not handled by dynamic pages)
const RESERVED_ROUTES = [
    'products',
    'cart',
    'login',
    'register',
    'profile',
    'checkout',
];

export default async function DynamicPage({ params }: DynamicPageProps) {
    const { category } = await params;

    // If it's a reserved route, let Next.js handle it with its own folder
    if (RESERVED_ROUTES.includes(category)) {
        notFound();
    }

    return <DynamicPageClient slug={category} />;
}