// app/[lang]/order-success/OrderSuccessContent.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/shared/hooks/useHttp";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "react-toastify";
import styles from "./OrderSuccess.module.css";
import Button from "@/shared/components/ui/button/Button";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}



interface OrderDetails {
    order_number: string;
    status: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string | null;
    notes: string;
    total: number;
    payment_method: string;
    payment_status: string;
    transaction_id: string | null;
    created_at: string;
    items: OrderItem[];
}

export default function OrderSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<OrderDetails | null>(null);

    const orderNumber = searchParams.get("order");

    useEffect(() => {
        if (!orderNumber) {
            toast.error(t('order.error.no.number'));
            // router.push("/");
            return;
        }

        loadOrderDetails();
    }, [orderNumber]);

    const loadOrderDetails = async () => {
        try {
            const response = await axiosInstance.get(`/orders/${orderNumber}`);

            if (response.data.success) {
                setOrder(response.data.data);
            } else {
                toast.error(t('order.error.not.found'));
                router.push("/");
            }
        } catch (error: any) {
            console.error("Error loading order:", error);
            toast.error(error.response?.data?.message || t('order.error.loading'));
            router.push("/");
        } finally {
            setLoading(false);
        }
    };

    const getPaymentStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            pending: { label: t('order.payment.pending'), className: 'bg-warning' },
            paid: { label: t('order.payment.paid'), className: 'bg-success' },
            failed: { label: t('order.payment.failed'), className: 'bg-danger' },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`badge ${config.className}`}>{config.label}</span>;
    };

    const renderPaymentDetails = () => {
        if (!order) return null;

        const paymentKey = order?.payment_method;
        // console.log(order?.payment_method)
        switch (paymentKey) {
            case 'cash':
                return (
                    <div className={styles.paymentSection}>
                        <h5 className="fw-bold mb-3">💵 {t('order.payment.cash.title')}</h5>
                        <div className={styles.infoCard}>
                            <p className="mb-2">
                                <strong>{t('order.payment.cash.instruction')}</strong>
                            </p>
                            <p className="text-muted mb-0">
                                {t('order.payment.cash.delivery.info')}
                            </p>
                        </div>
                    </div>
                );

            case 'bank_transfer':
                return (
                    <div className={styles.paymentSection}>
                        <h5 className="fw-bold mb-3">🏦 {t('order.payment.transfer.title')}</h5>
                        <div className={styles.infoCard}>
                            <p className="mb-3">
                                <strong>{t('order.payment.transfer.instruction')}</strong>
                            </p>

                            <div className={styles.bankDetails}>
                                <div className="mb-2">
                                    <span className="text-muted">{t('order.payment.transfer.bank')}:</span>{' '}
                                    <strong>თიბისი ბანკი (TBC Bank)</strong>
                                </div>
                                <div className="mb-2">
                                    <span className="text-muted">{t('order.payment.transfer.account')}:</span>{' '}
                                    <strong className={styles.copyable}>GE00TB0000000000000000</strong>
                                </div>
                                <div className="mb-2">
                                    <span className="text-muted">{t('order.payment.transfer.recipient')}:</span>{' '}
                                    <strong>შპს ბიზნეს სახელი</strong>
                                </div>
                                <div className="mb-2">
                                    <span className="text-muted">{t('order.payment.transfer.code')}:</span>{' '}
                                    <strong>000000000</strong>
                                </div>
                                <div className="mb-3">
                                    <span className="text-muted">{t('order.payment.transfer.purpose')}:</span>{' '}
                                    <strong className={styles.copyable}>შეკვეთა #{order.order_number}</strong>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mt-2">
                                <small>
                                    ⚠️ {t('order.payment.transfer.warning')}
                                </small>
                            </div>
                        </div>
                    </div>
                );

            case 'card':
            case 'online':
                return (
                    <div className={styles.paymentSection}>
                        <h5 className="fw-bold mb-3">💳 {t('order.payment.card.title')}</h5>
                        <div className={styles.infoCard}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span>{t('order.payment.status')}:</span>
                                {getPaymentStatusBadge(order.payment_status)}
                            </div>

                            {order.transaction_id && (
                                <div className="mb-2">
                                    <span className="text-muted">{t('order.payment.transaction')}:</span>{' '}
                                    <code>{order.transaction_id}</code>
                                </div>
                            )}

                            {order.payment_status === 'paid' && (
                                <div className="alert alert-success mb-0">
                                    ✅ {t('order.payment.card.success')}
                                </div>
                            )}

                            {order.payment_status === 'pending' && (
                                <div className="alert alert-info mb-0">
                                    ⏳ {t('order.payment.card.pending')}
                                </div>
                            )}

                            {order.payment_status === 'failed' && (
                                <div className="alert alert-danger mb-0">
                                    ❌ {t('order.payment.card.failed')}
                                    <div className="mt-2">
                                        <Button
                                            size="sm"
                                            variant="my-btn-blue"
                                            onClick={() => {/* Retry payment logic */}}
                                        >
                                            {t('order.payment.retry')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className={styles.successContainer}>
            {/* Success Header */}
            <div className={styles.successHeader} data-aos="fade-down">
                <div className={styles.successIcon}>✓</div>
                <h2 className="fw-bold mb-2">{t('order.success.title')}</h2>
                <p className="text-muted mb-0">{t('order.success.subtitle')}</p>
            </div>

            {/* Order Number */}
            <div className={styles.orderNumber} data-aos="fade-up">
                <span className="text-muted">{t('order.number')}:</span>
                <strong className="ms-2">#{order.order_number}</strong>
            </div>

            <div className="row">
                {/* Left Column - Payment Details */}
                <div className="col-md-6 mb-4" data-aos="fade-right">
                    {renderPaymentDetails()}
                </div>

                {/* Right Column - Order Details */}
                <div className="col-md-6 mb-4" data-aos="fade-left">
                    <div className={styles.orderSection}>
                        <h5 className="fw-bold mb-3">📦 {t('order.details.title')}</h5>

                        <div className={styles.infoCard}>
                            <div className={styles.detailRow}>
                                <span className="text-muted">{t('order.details.name')}:</span>
                                <strong>{order.name}</strong>
                            </div>
                            <div className={styles.detailRow}>
                                <span className="text-muted">{t('order.details.phone')}:</span>
                                <strong>{order.phone}</strong>
                            </div>
                            {order.email && (
                                <div className={styles.detailRow}>
                                    <span className="text-muted">{t('order.details.email')}:</span>
                                    <strong>{order.email}</strong>
                                </div>
                            )}
                            <div >
                                <span className="text-muted">{t('order.details.address')}: </span>
                                <span className={'text_font fw-bolder'}> {order.address}</span>
                            </div>
                            {order.city && (
                                <div className={styles.detailRow}>
                                    <span className="text-muted">{t('order.details.city')}:</span>
                                    <strong>{order.city}</strong>
                                </div>
                            )}
                            {order.notes && (
                                <div className={styles.detailRow}>
                                    <span className="text-muted">{t('order.details.notes')}:</span>
                                    <span>{order.notes}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className={styles.orderSection}>
                        <h5 className="fw-bold mb-3">🛒 {t('order.items.title')}</h5>

                        <div className={styles.itemsList}>
                            {order.items.map((item, index) => (
                                <div key={index} className={styles.orderItem}>
                                    <div className={styles.itemInfo}>
                                        <strong>{item.name}</strong>
                                        <span className="text-muted">x{item.quantity}</span>
                                    </div>
                                    <strong>{item.total?.toFixed(2)} ₾</strong>
                                </div>
                            ))}
                        </div>

                        <div className={styles.totalRow}>
                            <strong>{t('order.total')}:</strong>
                            <strong className={styles.totalAmount}>{order.total.toFixed(2)} ₾</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions} data-aos="fade-up">
                <Button
                    variant="my-btn-blue"
                    onClick={() => router.push('/')}
                >
                    {t('order.continue.shopping')}
                </Button>
                <Button
                    variant="my-btn-light-outline"
                    onClick={() => router.push('/profile/orders-history')}
                >
                    {t('order.view.orders')}
                </Button>
            </div>
        </div>
    );
}