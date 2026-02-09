// @/shared/components/modals/AuthModal.tsx
'use client';

import React from 'react';
import { Modal } from 'react-bootstrap';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import Login from "@/app/[lang]/login/page";

interface AuthModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
    returnUrl?: string; // ← დამატებული ოპციური პარამეტრი
}

export default function AuthModal({ show, onHide, onSuccess, returnUrl }: AuthModalProps) {
    const { t } = useLanguage();
    const pathname = usePathname();

    // თუ returnUrl არ არის მითითებული, გამოიყენე მიმდინარე გვერდი
    const redirectUrl = returnUrl || pathname || '/';

    const handleLoginSuccess = () => {
        if (onSuccess) {
            onSuccess();
        }
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">{t('login_required')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center title_font text-muted">
                    {t('login_to_upload_files')}
                </div>
                <Login
                    searchParams={{
                        colSize: 'col-md-12',
                        returnUrl: redirectUrl,
                        handleLoginSuccess:handleLoginSuccess
                    }}

                />
            </Modal.Body>
        </Modal>
    );
}