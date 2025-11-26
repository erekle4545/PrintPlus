import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
        | 'my-btn-blue' | 'my-btn-dark' | 'my-btn-light' | 'my-btn-danger' | 'my-btn-light-outline';
    size?: 'sm' | 'lg';
    className?: string;
    children?: React.ReactNode;
    outline?: boolean;

    /** Icon elements */
    startIcon?: React.ReactNode;   // icon placed before text
    endIcon?: React.ReactNode;     // icon placed after text
    loading?: boolean;             // shows spinner and disables button
    rounded?: boolean;             // shows spinner and disables button
    iconGap?: number;              // gap between icon and text in px (default 8)
}

const Button: React.FC<ButtonProps> = ({
           variant = 'primary',
           size,
           outline = false,
           className = '',
           children,
           startIcon,
           endIcon,
           loading = false,
           iconGap = 8,
           disabled,
           rounded = true,
           ...props
   }) => {
    // detect custom variants to map classes correctly
    const isCustom =
        variant === 'my-btn-blue' ||
        variant === 'my-btn-dark' ||
        variant === 'my-btn-light' ||
        variant === 'my-btn-danger' ||
        variant === 'my-btn-light-outline';

    const btnClass = classNames(
        'btn',
        {
            // Bootstrap variants
            [`btn-${variant}`]: !outline && !isCustom,
            [`btn-outline-${variant}`]: outline && !isCustom,

            // Custom variants (your own CSS classes)
            [variant]: isCustom && !outline,
            [`${variant}-outline`]: isCustom && outline,

            // Bootstrap sizes
            [`btn-${size}`]: size,
        },
        // make icons/text center-aligned with a small inline flex layout
        'd-inline-flex align-items-center',
        className
    );

    // If loading is true, we show a spinner and disable the button
    const isDisabled = disabled || loading;

    return (
        <button
            className={`${rounded?'rounded-5':null } ${btnClass} `}
            disabled={isDisabled}
            {...props}
        >
            {/* Loading spinner (Bootstrap) */}
            {loading && (
                <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                />
            )}

            {/* Start icon */}
            {startIcon && (
                <span
                    className="d-inline-flex"
                    style={{ marginRight: children ? iconGap : 0 }}
                    aria-hidden={true}
                >
          {startIcon}
        </span>
            )}

            {/* Button text/content */}
            {children && <span className="d-inline-flex">{children}</span>}

            {/* End icon */}
            {endIcon && (
                <span
                    className="d-inline-flex"
                    style={{ marginLeft: children ? iconGap : 0 }}
                    aria-hidden={true}
                >
          {endIcon}
        </span>
            )}
        </button>
    );
};

export default Button;
