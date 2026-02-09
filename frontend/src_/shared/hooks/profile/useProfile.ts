import { useState, useEffect, useCallback } from 'react';
import { useHttp } from "@/shared/hooks/useHttp";
import { User } from "@/types/auth/auth";

export function useProfile(shouldFetch: boolean = true) {
    const [profile, setProfile] = useState<User | null>(null);
    const { data, error, loading, sendRequest } = useHttp<{ user: User }>();

    // პროფილის ჩატვირთვა
    useEffect(() => {
        if (!shouldFetch) {
            return;
        }

        sendRequest({
            url: '/user',
            method: 'GET',
        });
    }, [shouldFetch, sendRequest]);

    // როცა data განახლდება, დავსეტოთ profile
    useEffect(() => {
        if (data?.user) {
            setProfile(data.user);
        }
    }, [data]);

    // პროფილის განახლება
    const updateProfile = useCallback(async (userData: Partial<User>) => {
        const response = await sendRequest({
            url: '/profile',
            method: 'PUT',
            data: userData
        });

        if (response?.user) {
            setProfile(response.user);
            return response.user;
        }
        throw new Error('Profile update failed');
    }, [sendRequest]);

    return {
        profile,
        loading,
        error: error ? (typeof error === 'string' ? error : error.message || 'დაფიქსირდა შეცდომა') : null,
        updateProfile
    };
}