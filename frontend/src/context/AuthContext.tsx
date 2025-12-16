'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useHttp } from '@/shared/hooks/useHttp';
import { User, AuthResponse, AuthContextType } from '@/types/auth/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const userHttp = useHttp<{ user: User }>();
    const loginHttp = useHttp<AuthResponse>();
    const registerHttp = useHttp<AuthResponse>();
    const logoutHttp = useHttp<{ message: string }>();
    const socialAuthHttp = useHttp<{ url: string }>();
    const refreshHttp = useHttp<{ token: string }>();

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await userHttp.sendRequest({
                url: '/user',
                method: 'GET',
            });

            if (response && response.user) {
                setUser(response.user);
            } else {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; errors?: any }> => {
        try {
            const response = await loginHttp.sendRequest({
                url: '/login',
                method: 'POST',
                data: { email, password },
            });

            if (response && response.token) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', response.token);
                }
                setUser(response.user);
                toast.success('წარმატებით შეხვედით სისტემაში');
                router.push('/dashboard');
                return { success: true };
            }

            toast.error('შესვლა ვერ მოხერხდა');
            return { success: false, errors: { general: 'შესვლა ვერ მოხერხდა' } };
        } catch (error: any) {
            toast.error(error.errors?.general || 'შესვლა ვერ მოხერხდა');
            return {
                success: false,
                errors: error.errors || { general: 'შესვლა ვერ მოხერხდა' },
            };
        }
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        password_confirmation: string
    ): Promise<{ success: boolean; errors?: any }> => {
        try {
            const response = await registerHttp.sendRequest({
                url: '/register',
                method: 'POST',
                data: { name, email, password, password_confirmation },
            });

            if (response && response.token) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', response.token);
                }
                setUser(response.user);
                toast.success('წარმატებით დარეგისტრირდით');
                router.push('/dashboard');
                return { success: true };
            }

            toast.error('რეგისტრაცია ვერ მოხერხდა');
            return { success: false, errors: { general: 'რეგისტრაცია ვერ მოხერხდა' } };
        } catch (error: any) {
            toast.error(error.errors?.general || 'რეგისტრაცია ვერ მოხერხდა');
            return {
                success: false,
                errors: error.errors || { general: 'რეგისტრაცია ვერ მოხერხდა' },
            };
        }
    };

    const socialLogin = async (provider: 'facebook' | 'google'): Promise<void> => {
        try {
            const response = await socialAuthHttp.sendRequest({
                url: `/auth/${provider}`,
                method: 'GET',
            });

            if (response && response.url && typeof window !== 'undefined') {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Social login failed:', error);
            toast.error('სოციალური ქსელით შესვლა ვერ მოხერხდა');
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await logoutHttp.sendRequest({
                url: '/logout',
                method: 'POST',
            });
            toast.success('წარმატებით გამოხვედით სისტემიდან');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('გამოსვლისას მოხდა შეცდომა');
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            setUser(null);
            router.push('/login');
        }
    };

    const refreshToken = async (): Promise<void> => {
        try {
            const response = await refreshHttp.sendRequest({
                url: '/refresh',
                method: 'POST',
            });

            if (response && response.token && typeof window !== 'undefined') {
                localStorage.setItem('token', response.token);
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            toast.error('სესიის განახლება ვერ მოხერხდა');
            logout();
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        socialLogin,
        logout,
        checkAuth,
        refreshToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};