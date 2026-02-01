'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, currentLanguage } = useLanguage();
    const { handleSocialCallback } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const langCode = currentLanguage?.code || 'ka';

        if (token) {
            // Handle successful authentication
            handleSocialCallback(token)
                .then(() => {
                    setTimeout(() => {
                        router.push(`/${langCode}/dashboard`);
                    }, 500);
                })
                .catch(() => {
                    router.push(`/${langCode}/login`);
                });
        } else if (error) {
            // Handle error
            toast.error(t('auth_failed', 'ავტორიზაცია ვერ მოხერხდა'));
            setTimeout(() => {
                router.push(`/${langCode}/login`);
            }, 1000);
        } else {
            // No token or error
            router.push(`/${langCode}/login`);
        }
    }, [searchParams, router, currentLanguage?.code, handleSocialCallback, t]);

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">{t('loading', 'იტვირთება...')}</span>
                </div>
                <p className="text_font">{t('run_social_auth', 'მიმდინარეობს ავტორიზაცია...')}</p>
            </div>
        </div>
    );
}