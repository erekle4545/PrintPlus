

"use client";

import {
    createContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { axiosInstance } from "@/shared/hooks/useHttp";
 import { useLanguage } from "@/context/LanguageContext";
import {ContactTypes} from "@/types/contact/contactTypes";

export interface ContactContextType {
    data: ContactTypes | null;
    loading: boolean;
    refetch: () => Promise<void>;

}

export const ContactContext = createContext<ContactContextType | undefined>(
    undefined
);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ContactTypes | null>(null);
    const { currentLanguage } = useLanguage();

    const contactLoad = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/contact", {
                params: {
                    language_id: currentLanguage?.id,
                },
            });

            if (response.data) {
                setData(response.data.data || null);
            }
        } catch (error) {
            console.error("Error loading contact:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [currentLanguage]);

    // Initial load
    useEffect(() => {
        contactLoad();
    }, [contactLoad]);

    return (
        <ContactContext.Provider
            value={{
                data,
                loading,
                refetch: contactLoad,
            }}
        >
            {children}
        </ContactContext.Provider>
    );
};