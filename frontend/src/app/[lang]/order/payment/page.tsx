"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import Cover from "@/shared/components/theme/header/cover/cover";
import Button from "@/shared/components/ui/button/Button";

function PaymentContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'success' | 'failed' | null>(null);

    useEffect(() => {
        const statusParam = searchParams.get('status');
        if (statusParam === 'success' || statusParam === 'failed') {
            setStatus(statusParam);
        }
    }, [searchParams]);

    const handleGoHome = () => {
        router.push('/');
    };

    const handleViewOrders = () => {
        router.push('/profile/orders-history');
    };

    if (status === 'success') {
        return (
            <div>
                <Cover />
                <div className='container text-center p-5'>
                    <div className="mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: '120px',
                                height: '120px',
                                backgroundColor: '#D4EDDA',
                                animation: 'scaleIn 0.5s ease-out'
                            }}
                        >
                            <svg
                                width="60"
                                height="60"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#28A745"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>

                    <h1 className="title_font fw-bold mb-3" style={{color:'#28A745'}}>
                        {t('payment_successful', 'გადახდა წარმატებულია')}
                    </h1>

                    <p className="text_font text-muted mb-4" style={{fontSize: '1.1rem'}}>
                        {t('payment_success_desc', 'თქვენი გადახდა წარმატებით დასრულდა. შეკვეთა მუშავდება და მალე დაგიკავშირდებით.')}
                    </p>

                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Button
                            onClick={handleViewOrders}
                            className={'title_font btn-success'}
                        >
                            {t('view_orders', 'ჩემი შეკვეთები')}
                        </Button>
                        <Button
                            onClick={handleGoHome}
                            className={'title_font'}
                            variant={'my-btn-light-outline'}
                        >
                            {t('go_to_home', 'მთავარ გვერდზე დაბრუნება')}
                        </Button>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes scaleIn {
                        from {
                            transform: scale(0);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div>
                <Cover />
                <div className='container text-center p-5' data-aos="fade-up">
                    <div className="mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: '120px',
                                height: '120px',
                                backgroundColor: '#F8D7DA',
                                animation: 'scaleIn 0.5s ease-out'
                            }}
                        >
                            <svg
                                width="60"
                                height="60"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#DC3545"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </div>
                    </div>

                    <h1 className="title_font fw-bold mb-3" style={{color:'#DC3545'}}>
                        {t('payment_failed', 'გადახდა ვერ შესრულდა')}
                    </h1>

                    <p className="text_font text-muted mb-4" style={{fontSize: '1.1rem'}}>
                        {t('payment_failed_desc', 'სამწუხაროდ, თქვენი გადახდა არ შესრულებულა. გთხოვთ სცადოთ თავიდან ან დაგვიკავშირდით.')}
                    </p>

                    <div className="alert alert-danger mx-auto mb-4" style={{maxWidth: '600px', borderRadius: '8px'}}>
                        <p className="text_font mb-0">
                            <strong>{t('possible_reasons', 'შესაძლო მიზეზები')}:</strong>
                        </p>
                        <ul className="text_font text-start mt-2 mb-0" style={{fontSize: '0.95rem'}}>
                            <li>{t('insufficient_funds', 'არასაკმარისი თანხა ბარათზე')}</li>
                            <li>{t('incorrect_card_details', 'არასწორი ბარათის მონაცემები')}</li>
                            <li>{t('bank_declined', 'ბანკმა უარყო ტრანზაქცია')}</li>
                            <li>{t('technical_error', 'ტექნიკური შეფერხება')}</li>
                        </ul>
                    </div>

                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Button
                            onClick={() => router.push('/cart')}
                            className={'title_font btn-success'}
                            variant={'my-btn-blue'}
                        >
                            {t('try_again', 'თავიდან ცდა')}
                        </Button>
                        <Button
                            onClick={handleGoHome}
                            className={'title_font'}
                            variant={'my-btn-light-outline'}
                        >
                            {t('go_to_home', 'მთავარ გვერდზე დაბრუნება')}
                        </Button>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes scaleIn {
                        from {
                            transform: scale(0);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        );
    }

    return null;
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div>
                <Cover />
                <div className="container text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}