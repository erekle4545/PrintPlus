'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const DropdownUserMenu: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="auth-card position-relative text_font">
            {/* Triangle pointer */}
            <div className="position-absolute top-0 start-50 translate-middle" style={{ marginTop: '-20px' }}>
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: '10px solid white',
                    }}
                />
            </div>

            {/* User Info */}
            <div className="text-center mb-3">
                <div className="d-flex justify-content-center mb-2">
                    <div
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                        style={{ width: '60px', height: '60px', fontSize: '24px' }}
                    >
                        <i className="bi bi-person-fill"></i>
                    </div>
                </div>
                <h6 className="mb-1 title_font_bold">{user.name}</h6>
                <p className="text-muted small mb-0">{user.email}</p>
            </div>

            <hr className="my-2" />

            {/* Menu Items */}
            <div className="user-menu">
                <Link
                    href="/dashboard"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-bg-light"
                >
                    <i className="bi bi-speedometer2 me-2"></i>
                    <span className="text_font">მთავარი გვერდი</span>
                </Link>

                <Link
                    href="/profile"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-bg-light"
                >
                    <i className="bi bi-person me-2"></i>
                    <span className="text_font">ჩემი პროფილი</span>
                </Link>

                <Link
                    href="/orders"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-bg-light"
                >
                    <i className="bi bi-bag me-2"></i>
                    <span className="text_font">ჩემი შეკვეთები</span>
                </Link>

                <Link
                    href="/settings"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-bg-light"
                >
                    <i className="bi bi-gear me-2"></i>
                    <span className="text_font">პარამეტრები</span>
                </Link>
            </div>

            <hr className="my-2" />

            {/* Logout Button */}
            <button
                onClick={logout}
                className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 text_font"
            >
                <i className="bi bi-box-arrow-right"></i>
                გასვლა
            </button>
        </div>
    );
};

export default DropdownUserMenu;