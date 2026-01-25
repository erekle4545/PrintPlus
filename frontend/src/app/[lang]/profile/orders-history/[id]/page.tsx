"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../Profile.module.css";
import { FileText } from "lucide-react";
import { axiosInstance } from "@/shared/hooks/useHttp";
import { useLanguage } from "@/context/LanguageContext";
import CustomLoader from "@/shared/components/ui/loader/customLoader";

interface OrderItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    color: string | null;
    size: string | null;
    extras: any;
    materials: any;
    print_type: string | null;
    custom_dimensions: any;
    covers?: Cover[];
}

interface Cover {
    id: number;
    files_id: number;
    cover_type: string;
    file?: {
        id: number;
        name: string;
        path: string;
        mime_type: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes: string | null;
    payment_method: string;
    total: number;
    subtotal: number;
    delivery_cost: number;
    status: string;
    items: OrderItem[];
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { t } = useLanguage();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance(`/orders/${id}`);
            // console.log("Order details:", response);

            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error: any) {
            console.error("Error fetching order details:", error);
            setError(error.response?.data?.message || t("orders.error_loading"));
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

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            pending: "bg-warning",
            processing: "bg-info",
            shipped: "bg-primary",
            delivered: "bg-success",
            cancelled: "bg-danger",
        };
        return colorMap[status] || "bg-secondary";
    };

    const getPaymentMethodText = (method: string) => {
        const methodMap: Record<string, string> = {
            cash: t("orders.payment.cash"),
            card: t("orders.payment.card"),
            bank_transfer: t("orders.payment.bank_transfer"),
        };
        return methodMap[method] || method;
    };

    if (loading) {
        return <CustomLoader cover={false} />;
    }

    if (error || !order) {
        return (
            <div className="text-center py-5">
                <p className="text-danger">{error || t("orders.not_found")}</p>
                <button
                    onClick={() => router.back()}
                    className="btn btn-primary mt-3"
                >
                    {t("common.back")}
                </button>
            </div>
        );
    }

    return (
        <div className={styles.orderDetail}>
            <div className="d-flex justify-content-between mb-3">
                <div>
                    <h5 className="title_font my-text-blue fw-bolder">
                        {t("orders.order")} {order.order_number}
                    </h5>
                    <p className="text_font text-muted">
                        {formatDate(order.created_at)}
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => router.back()}
                        className="btn btn-text fw-bolder title-color title_font"
                    >
                        ← {t("common.back")}
                    </button>
                </div>
            </div>

            {/* Order Status */}
            <div className="mb-3">
                <span className={`badge ${getStatusColor(order.status)} fs-6`}>
                    {getStatusText(order.status)}
                </span>
            </div>

            {/* Customer Info */}
            <div className={styles.detailBox}>
                <h6 className="title_font fw-bold mb-3">
                    {t("orders.customer_info")}
                </h6>
                <p className="text_font mb-1">
                    <strong>{t("orders.name")}:</strong> {order.name}
                </p>
                <p className="text_font mb-1">
                    <strong>{t("orders.phone")}:</strong> {order.phone}
                </p>
                {order.email && (
                    <p className="text_font mb-1">
                        <strong>{t("orders.email")}:</strong> {order.email}
                    </p>
                )}
                <p className="text_font mb-1">
                    <strong>{t("orders.address")}:</strong> {order.address},{" "}
                    {order.city}
                </p>
                <p className="text_font mb-1">
                    <strong>{t("orders.payment_method")}:</strong>{" "}
                    {getPaymentMethodText(order.payment_method)}
                </p>
            </div>

            {/* Order Items */}
            <div className="mt-4">
                <h6 className="title_font fw-bold mb-3">
                    {t("orders.order_items")}
                </h6>
                {order.items.map((item, index) => (
                    <div key={item.id} className={`${styles.detailBox} mb-3`}>
                        <h6 className="title_font fw-bold mb-2">
                            {index + 1}. {item.name}
                        </h6>

                        {item.color && (
                            <p className="text_font mb-1">
                                <strong>{t("orders.item.color")}:</strong> {item.color}
                            </p>
                        )}
                        {item.size && (
                            <p className="text_font mb-1">
                                <strong>{t("orders.item.size")}:</strong> {item.size}
                            </p>
                        )}
                        {item.print_type && (
                            <p className="text_font mb-1">
                                <strong>{t("orders.item.print_type")}:</strong>{" "}
                                {item.print_type}
                            </p>
                        )}
                        {item.materials && (
                            <p className="text_font mb-1">
                                <strong>{t("orders.item.materials")}:</strong>{" "}
                                {JSON.stringify(item.materials)}
                            </p>
                        )}
                        {/*{item.custom_dimensions && (*/}
                        {/*    <p className="text_font mb-1">*/}
                        {/*        <strong>{t("orders.item.dimensions")}:</strong>{" "}*/}
                        {/*        {JSON.stringify(item.custom_dimensions)}*/}
                        {/*    </p>*/}
                        {/*)}*/}
                        <p className="text_font mb-1">
                            <strong>{t("orders.item.quantity")}:</strong>{" "}
                            {item.quantity}
                        </p>
                        <p className="text_font mb-1">
                            <strong>{t("orders.item.price")}:</strong> {item.price} ₾
                        </p>

                        {/* Uploaded Files for this item */}
                        {item.covers && item.covers.length > 0 && (
                            <div className="mt-3">
                                <h6 className="title_font fw-bold mb-2">
                                    {t("orders.uploaded_files")}
                                </h6>
                                <ul className={styles.fileList}>
                                    {item.covers.map((cover) => (
                                        <li key={cover.id}>
                                            <FileText size={16} />
                                            {cover.file?.name || `File #${cover.files_id}`}
                                            {cover.file?.path && (

                                              <a  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${cover.file.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ms-2 text-primary"
                                                >
                                                    {t("orders.download")}
                                                </a>
                                                )}
                                        </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    ))}
            </div>

            {/* Order Summary */}
            <div className={`${styles.detailBox} mt-4`}>
                <h6 className="title_font fw-bold mb-2">
                    {t("orders.order_summary")}
                </h6>
                <p className="text_font mb-1">
                    <strong>{t("orders.subtotal")}:</strong> {order.subtotal} ₾
                </p>
                <p className="text_font mb-1">
                    <strong>{t("orders.delivery_cost")}:</strong>{" "}
                    {order.delivery_cost} ₾
                </p>
                <p className="text_font fw-bold fs-5">
                    <strong>{t("orders.total")}:</strong> {order.total} ₾
                </p>
            </div>

            {/* Additional Notes */}
            {order.notes && (
            <div className="mt-4">
                <h6 className="title_font fw-bold mb-2">
                    {t("orders.additional_info")}
                </h6>
                <div className={styles.noteBox}>
                    <p className="text_font text-muted">{order.notes}</p>
                </div>
            </div>
            )}
        </div>
    );
}
// "use client";
//
// import React from "react";
// import { useParams,useRouter } from "next/navigation";
// import Link from "next/link";
// import styles from "../../Profile.module.css";
// import { FileText } from "lucide-react";
//
// export default function OrderDetailPage() {
//     const { id } = useParams();
//     const router = useRouter();
//     // მონაცემების მაგალითი — რეალურად ეს წამოვა API-დან
//     const order = {
//         id,
//         date: "10/16/2024",
//         customer: "გიორგი ბეჟანიშვილი",
//         color: "წითელი",
//         size: "XS",
//         printType: "DTF",
//         quantity: 10,
//         price: 75,
//         files: ["file-name-2.pdf", "file-name-1.pdf", "file-name.pdf"],
//         note: "შეკვეთისთვის დამატებითი ინფორმაცია მითითებული არ არის.",
//     };
//
//     return (
//         <div className={styles.orderDetail}>
//             <div className="d-flex justify-content-between  mb-3">
//                 <div  className=''>
//                     <h5 className="title_font my-text-blue fw-bolder text-teal-600">შეკვეთა #{order.id}</h5>
//                     <p className="text_font text-muted">{order.date}</p>
//                 </div>
//                 <div className=''>
//                     <button onClick={() => router.back()} className={`btn btn-text fw-bolder title-color title_font`}>
//                         ← უკან
//                     </button>
//                 </div>
//             </div>
//
//             <div className={styles.detailBox}>
//                 <h6 className="title_font fw-bold mb-2">{order.customer}</h6>
//                 <p className="text_font mb-1">მასალა: ბამბა</p>
//                 <p className="text_font mb-1">ფერი: {order.color}</p>
//                 <p className="text_font mb-1">ზომა: {order.size}</p>
//                 <p className="text_font mb-1">ბეჭდვის მეთოდი: {order.printType}</p>
//                 <p className="text_font mb-1">პრინტის ფორმატი: A5</p>
//                 <p className="text_font mb-1">რაოდენობა: {order.quantity}</p>
//                 <p className="text_font mb-1">ფასი: {order.price} ₾</p>
//                 <p className="text_font text-muted">სტატუსი: დამტკიცებულია</p>
//             </div>
//
//             <div className="mt-4">
//                 <h6 className="title_font fw-bold mb-2">ატვირთული ფაილები</h6>
//                 <ul className={styles.fileList}>
//                     {order.files.map((file) => (
//                         <li key={file}>
//                             <FileText size={16} /> {file}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//
//             <div className="mt-4">
//                 <h6 className="title_font fw-bold mb-2">დამატებითი ინფორმაცია</h6>
//                 <div className={styles.noteBox}>
//                     <p className="text_font text-muted">{order.note}</p>
//                 </div>
//             </div>
//         </div>
//     );
// }
