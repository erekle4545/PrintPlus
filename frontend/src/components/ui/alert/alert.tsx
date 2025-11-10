"use client";
import React from "react";
import styles from "./Alert.module.css";
import { AlertTriangle } from "lucide-react";

interface AlertProps {
    message: string;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({ message, className }) => {
    return (
        <div className={`${styles.alertBox} ${className || ""}`}>
            <AlertTriangle size={18} className={styles.icon} />
            <span className="text_font">{message}</span>
        </div>
    );
};
