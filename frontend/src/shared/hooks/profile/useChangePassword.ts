import { useState, useCallback } from 'react';
import { changePassword, ChangePasswordData } from '@/shared/api/profile';
import { User } from "@/types/auth/auth";

export function useChangePassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const updatePassword = useCallback(async (data: ChangePasswordData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const user = await changePassword(data);
            setSuccess(true);
            setLoading(false);
            return user;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'პაროლის შეცვლა ვერ მოხერხდა';
            setError(errorMessage);
            setLoading(false);
            throw err;
        }
    }, []);

    const resetState = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return { loading, error, success, updatePassword, resetState };
}