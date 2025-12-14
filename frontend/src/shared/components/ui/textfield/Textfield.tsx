import React from "react";
import styles from "./TextField.module.css";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    className?: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, error, className, ...rest }) => {
    return (
        <div className={`${styles.wrapper} ${className || ""}`}>
            {label && <label className={styles.label}>{label}</label>}
            <input className={styles.input} {...rest} />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default TextField;
