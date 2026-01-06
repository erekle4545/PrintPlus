export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message?: string;
}

export interface AuthError {
    errors?: {
        [key: string]: string[];
    };
    error?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; errors?: any }>;
    register: (name: string, email: string,phone: string, password: string, password_confirmation: string) => Promise<{ success: boolean; errors?: any }>;
    socialLogin: (provider: 'facebook' | 'google') => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    refreshToken: () => Promise<void>;
}