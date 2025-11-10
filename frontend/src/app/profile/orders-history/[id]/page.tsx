"use client";

import React from "react";
import { useParams,useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../Profile.module.css";
import { FileText } from "lucide-react";

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    // მონაცემების მაგალითი — რეალურად ეს წამოვა API-დან
    const order = {
        id,
        date: "10/16/2024",
        customer: "გიორგი ბეჟანიშვილი",
        color: "წითელი",
        size: "XS",
        printType: "DTF",
        quantity: 10,
        price: 75,
        files: ["file-name-2.pdf", "file-name-1.pdf", "file-name.pdf"],
        note: "შეკვეთისთვის დამატებითი ინფორმაცია მითითებული არ არის.",
    };

    return (
        <div className={styles.orderDetail}>
            <div className="d-flex justify-content-between  mb-3">
                <div  className=''>
                    <h5 className="title_font my-text-blue fw-bolder text-teal-600">შეკვეთა #{order.id}</h5>
                    <p className="text_font text-muted">{order.date}</p>
                </div>
                <div className=''>
                    <button onClick={() => router.back()} className={`btn btn-text fw-bolder title-color title_font`}>
                        ← უკან
                    </button>
                </div>
            </div>

            <div className={styles.detailBox}>
                <h6 className="title_font fw-bold mb-2">{order.customer}</h6>
                <p className="text_font mb-1">მასალა: ბამბა</p>
                <p className="text_font mb-1">ფერი: {order.color}</p>
                <p className="text_font mb-1">ზომა: {order.size}</p>
                <p className="text_font mb-1">ბეჭდვის მეთოდი: {order.printType}</p>
                <p className="text_font mb-1">პრინტის ფორმატი: A5</p>
                <p className="text_font mb-1">რაოდენობა: {order.quantity}</p>
                <p className="text_font mb-1">ფასი: {order.price} ₾</p>
                <p className="text_font text-muted">სტატუსი: დამტკიცებულია</p>
            </div>

            <div className="mt-4">
                <h6 className="title_font fw-bold mb-2">ატვირთული ფაილები</h6>
                <ul className={styles.fileList}>
                    {order.files.map((file) => (
                        <li key={file}>
                            <FileText size={16} /> {file}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <h6 className="title_font fw-bold mb-2">დამატებითი ინფორმაცია</h6>
                <div className={styles.noteBox}>
                    <p className="text_font text-muted">{order.note}</p>
                </div>
            </div>
        </div>
    );
}
