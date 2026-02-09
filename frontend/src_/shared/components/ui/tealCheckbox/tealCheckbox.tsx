'use client';
import React from 'react';
import clsx from 'clsx';
import styles from './tealCheckbox.module.css';

type Props = {
    label?: React.ReactNode;
    /** Controlled API */
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    /** Uncontrolled support (თუ გინდა) */
    defaultChecked?: boolean;

    id?: string;
    name?: string;
    disabled?: boolean;
    /** კვადრატის ზომა პიქსელებში (ნაგულისხმები 24) */
    size?: number;
    className?: string;
    labelClassName?: string;
};

export default function TealCheckbox({
         label,
         checked,
         onChange,
         defaultChecked,
         id,
         name,
         disabled,
         size = 22,
         className,
         labelClassName,
     }: Props) {
    // pass size via CSS var
    const style = { ['--cb-size' as any]: `${size}px` };

    return (
        <label className={clsx(styles.root, className)} style={style}>
            <input
                id={id}
                name={name}
                type="checkbox"
                className={styles.checkbox}
                checked={checked}
                defaultChecked={defaultChecked}
                onChange={onChange}
                disabled={disabled}
            />
             {label && <span className={clsx(styles.text, labelClassName)}>{label}</span>}
        </label>
    );
}
