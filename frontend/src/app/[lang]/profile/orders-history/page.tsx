"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../Profile.module.css";
import Button from "@/shared/components/ui/button/Button";
import {axiosInstance} from "@/shared/hooks/useHttp";
 import {useLanguage} from "@/context/LanguageContext";
import CustomLoader from "@/shared/components/ui/loader/customLoader";

interface OrderItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    order_number: string;
    created_at: string;
    name: string;
    total: number;
    status: string;
    items: OrderItem[];
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function OrdersHistory() {
    const router = useRouter();
    const { t } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const fetchOrders = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await axiosInstance(`/orders?page=${page}&per_page=15`);


            if (response.data.success) {
                setOrders(response.data.data.data);
                setMeta({
                    current_page: response.data.data.current_page,
                    last_page: response.data.data.last_page,
                    per_page: response.data.data.per_page,
                    total: response.data.data.total,
                });
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ka-GE");
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: t("orders.status.pending"),
            processing: t("orders.status.processing"),
            shipped: t("orders.status.shipped"),
            delivered: t("orders.status.delivered"),
            cancelled: t("orders.status.cancelled"),
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return <CustomLoader cover={false}/>;
    }

    if (!loading && orders.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">{t("orders.no_orders")}</p>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.ordersGrid}>
                {orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                        <p className="title_font text-muted">
                            {t("orders.order")} {order.order_number}
                        </p>
                        <p className="text_font">{formatDate(order.created_at)}</p>
                        <h6 className="fw-bold title_font">{order.name}</h6>
                        <p className="text_font">
                            {t("orders.items_count")} - {order.items?.length || 0}
                        </p>
                        <p className="text_font">
                            {t("orders.total_price")} - {order.total}₾
                        </p>
                        <div className="d-flex gap-2 align-items-center mb-2">
                            <span
                                className={`badge ${
                                    order.status === 'delivered'
                                        ? 'bg-success'
                                        : order.status === 'cancelled'
                                            ? 'bg-danger'
                                            : 'bg-warning'
                                }`}
                            >
                                {getStatusText(order.status)}
                            </span>
                        </div>

                        <Button
                            type="button"
                            variant="my-btn-blue"
                            onClick={() =>
                                router.push(`/profile/orders-history/${order.order_number}`)
                            }
                            rounded={false}
                            className="justify-content-center title_font fw-bolder w-100 rounded-2"
                        >
                            {t("orders.details")}
                        </Button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {t("pagination.previous")}
                            </button>
                        </li>

                        {[...Array(meta.last_page)].map((_, index) => (
                            <li
                                key={index}
                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === meta.last_page ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === meta.last_page}
                            >
                                {t("pagination.next")}
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}