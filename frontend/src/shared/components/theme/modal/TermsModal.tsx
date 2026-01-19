'use client';

import { useEffect, useState } from 'react';
import {axiosInstance, useHttp} from "@/shared/hooks/useHttp";
import {useLanguage} from "@/context/LanguageContext";

interface TermsModalProps {
    id?: string;
    type?: number;
}

interface TermsData {
    title: string;
    content: string;
}

export default function TermsModal({
                                       id = 'termsModal',
                                       type = 14
                                   }: TermsModalProps) {
    const {t, currentLanguage} = useLanguage();
    const { loading } = useHttp();
    const [termsData, setTermsData] = useState<TermsData | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Ensure component only works on client-side
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        // Bootstrap modal initialization
        const modalElement = document.getElementById(id);
        if (modalElement) {
            // Dynamically import Bootstrap Modal
            import('bootstrap').then((bootstrap) => {
                const modal = new bootstrap.Modal(modalElement);

                // მოდალის გახსნის event listener
                const handleModalShow = async () => {
                    if (!termsData) {
                        try {
                            const response = await axiosInstance.get(`/conditions-pages/terms`, {
                                params: {
                                    language_id: currentLanguage?.id,
                                    type: type
                                }
                            });

                            if (response.data) {
                                setTermsData({
                                    title: response.data.info?.title,
                                    content: response.data?.info.text
                                });
                            }
                        } catch (error) {
                            console.error('Error loading terms:', error);
                            setTermsData({
                                title: ' ',
                                content: ' '
                            });
                        }
                    }
                };

                modalElement.addEventListener('show.bs.modal', handleModalShow);

                return () => {
                    modalElement.removeEventListener('show.bs.modal', handleModalShow);
                    modal.dispose();
                };
            });
        }
    }, [id, isClient, termsData, currentLanguage, type]);

    if (!isClient) {
        return null;
    }

    return (
        <div
            className="modal fade"
            id={id}
            tabIndex={-1}
            aria-labelledby={`${id}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold" id={`${id}Label`}>
                            {loading ? `${t('loading')}...` : termsData?.title || ''}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">{t('loading')}...</span>
                                </div>
                            </div>
                        ) : termsData?.content ? (
                            <div
                                className="terms-content"
                                dangerouslySetInnerHTML={{ __html: termsData.content }}
                            />
                        ) : (
                            <div className="text-center py-4 text-muted">
                                {t('record.not.found')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}