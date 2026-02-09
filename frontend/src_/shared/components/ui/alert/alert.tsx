"use client";
import React from "react";
import styles from "./Alert.module.css";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps {
    message: string;
    className?: string;
    type?: "error" | "success" | "info" | "warning";
}

export const Alert: React.FC<AlertProps> = ({ message, className, type = "error" }) => {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle size={18} className={styles.icon} />;
            case "info":
                return <Info size={18} className={styles.icon} />;
            case "warning":
                return <AlertTriangle size={18} className={styles.icon} />;
            case "error":
            default:
                return <XCircle size={18} className={styles.icon} />;
        }
    };

    const alertClass = `${styles.alertBox} ${styles[type]} ${className || ""}`;

    return (
        <div className={alertClass}>
            {getIcon()}
            <span className="text_font">{message}</span>
        </div>
    );
};