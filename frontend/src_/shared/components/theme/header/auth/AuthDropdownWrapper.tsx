'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import DropdownAuth from '../auth/dropdownAuth';
import DropdownUserMenu from './DropdownUserMenu';

const AuthDropdownWrapper: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="auth-card position-relative text_font">
                <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">იტვირთება...</span>
                    </div>
                </div>
            </div>
        );
    }

    return user ? <DropdownUserMenu /> : <DropdownAuth />;
};

export default AuthDropdownWrapper;