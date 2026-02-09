'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, currentLanguage } = useLanguage();
    const { handleSocialCallback } = useAuth();
    const hasProcessed = useRef(false);

    useEffect(() => {
        // თავიდან აცილება duplicate processing-ის
        if (hasProcessed.current) return;

        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const langCode = currentLanguage?.code || 'ka';

        if (token) {
            hasProcessed.current = true;

            // CRITICAL: ჯერ წაშალე ძველი token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                console.log('Old token cleared');
            }

            // Handle successful authentication
            handleSocialCallback(token)
                .then(() => {
                    console.log('Social callback successful');
                    setTimeout(() => {
                        router.push(`/${langCode}`);
                    }, 500);
                })
                .catch((error) => {
                    console.error('Social callback failed:', error);
                    hasProcessed.current = false;
                    router.push(`/${langCode}/login`);
                });
        } else if (error) {
            hasProcessed.current = true;

            // Handle error
            toast.error(t('auth_failed', 'ავტორიზაცია ვერ მოხერხდა'));
            setTimeout(() => {
                router.push(`/${langCode}/login`);
            }, 1000);
        } else {
            // No token or error
            router.push(`/${langCode}/login`);
        }
    }, []);

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