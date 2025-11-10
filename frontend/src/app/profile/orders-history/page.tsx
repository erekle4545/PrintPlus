"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "../Profile.module.css";
import Button from "@/components/ui/button/Button";

export default function OrdersHistory() {
    const router = useRouter();

    const orders = Array(9).fill({
        id: 548774,
        order_number: "#548774",
        date: "10/16/2024",
        title: "გიორგი ბეჟანიშვილი",
        items: "შეკვეთის რაოდენობა - 10",
        price: "ჯამური ფასი - 75₾",
    });

    return (
        <div data-aos="fade-up">
            <div className={styles.ordersGrid}>
                {orders.map((order, index) => (
                    <div key={index} className={styles.orderCard}>
                        <p className="title_font text-muted">
                            შეკვეთა {order.order_number}
                        </p>
                        <p className="text_font">{order.date}</p>
                        <h6 className="fw-bold title_font">{order.title}</h6>
                        <p className="text_font">{order.items}</p>
                        <p className="text_font">{order.price}</p>

                        <Button
                            type="button"
                            variant="my-btn-blue"
                            onClick={() =>
                                router.push(`/profile/orders-history/${order.id}`)
                            }
                            rounded={false}
                            className="justify-content-center title_font fw-bolder w-100 rounded-2"
                        >
                            დეტალურად
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
