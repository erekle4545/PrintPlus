'use client';

import React, { useCallback } from 'react';
import styles from './QuantityStepper.module.css';

export type QuantityStepperProps = {
    value: number;
    onChange: (next: number) => void;
    /** Minimum allowed value (default: 1) */
    min?: number;
    /** Maximum allowed value (default: 99) */
    max?: number;
    /** Step size (default: 1) */
    step?: number;
    /** Optional label shown above the control */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className for the outer wrapper */
    className?: string;
    /** Size of buttons/input */
    size?: 'sm' | 'md' | 'lg';
};

/**
 * Reusable Quantity Stepper — rounded pill with dotted separators (– 1 +)
 * Usage:
 *   <QuantityStepper value={qty} onChange={setQty} label="რაოდენობა" />
 */
export default function QuantityStepper({
        value,
        onChange,
        min = 1,
        max = 99,
        step = 1,
        label,
        disabled = false,
        className,
        size = 'md',
}: QuantityStepperProps) {
    const clamp = useCallback(
        (v: number) => Math.max(min, Math.min(max, v)),
        [min, max]
    );

    const inc = useCallback(() => {
        if (disabled) return;
        onChange(clamp(value + step));
    }, [disabled, clamp, onChange, step, value]);

    const dec = useCallback(() => {
        if (disabled) return;
        onChange(clamp(value - step));
    }, [disabled, clamp, onChange, step, value]);

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyDigits = e.target.value.replace(/[^0-9]/g, '');
        if (onlyDigits === '') return onChange(min);
        const n = Number(onlyDigits);
        onChange(clamp(n));
    };

    const onBlur = () => onChange(clamp(value || min));

    const sz = size === 'lg' ? 44 : size === 'sm' ? 32 : 38;

    return (
        <div className={className}>
            {label && <div className={styles.qtyLabel}>{label}</div>}

            <div
                className={`${styles.qty} ${disabled ? styles.isDisabled : ''}`}
                role="group"
                aria-label={label || 'Quantity stepper'}
                style={{ ['--sz' as any]: `${sz}px` }}
            >
                <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={dec}
                    aria-label="მოკლება"
                    disabled={disabled || value <= min}
                >
                    –
                </button>

                <input
                    className={styles.qtyInput}
                    inputMode="numeric"
                    value={String(value)}
                    onChange={onInput}
                    onBlur={onBlur}
                    aria-live="polite"
                    aria-label="რაოდენობა"
                    disabled={disabled}
                />

                <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={inc}
                    aria-label="მატება"
                    disabled={disabled || value >= max}
                >
                    +
                </button>
            </div>
        </div>
    );
}
