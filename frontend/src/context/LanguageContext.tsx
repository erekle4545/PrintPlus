'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useHttp } from '@/shared/hooks/useHttp';
import { useRouter, usePathname } from 'next/navigation';

// Types
interface Language {
    id: number;
    label: string;
    code: string;
    location: string;
    default: number;
    status: number;
}

interface Translations {
    [key: string]: string;
}

interface LanguageContextType {
    currentLanguage: Language | null;
    languages: Language[];
    translations: Translations;
    loading: boolean;
    changeLanguage: (language: Language) => void;
    t: (key: string, fallback?: string) => string;
}

interface LanguageProviderProps {
    children: ReactNode;
    initialLang?: string;
}

interface LanguagesResponse {
    success: boolean;
    data: {
        languages: Language[];
        default: Language;
    };
}

interface TranslationsResponse {
    success: boolean;
    data: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
                                                                      children,
                                                                      initialLang
                                                                  }) => {
    const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [translations, setTranslations] = useState<Translations>({});
    const [loading, setLoading] = useState<boolean>(true);
    const { sendRequest } = useHttp();
    const router = useRouter();
    const pathname = usePathname();

    // Load translations function with useCallback
    const loadTranslations = useCallback(async (langCode: string): Promise<void> => {
        try {
            // @ts-ignore
            const result = await sendRequest<TranslationsResponse>({
                url: `/translations/${langCode}`,
                method: 'GET'
            });
            console.log(result)
            if (result?.success) {
                setTranslations(result.data);
            }
        } catch (error) {
            console.error('Error loading translations:', error);
            setTranslations({});
        }
    }, [sendRequest]);

    // Load languages function with useCallback
    const loadLanguages = useCallback(async (): Promise<void> => {
        try {
            // @ts-ignore
            const result = await sendRequest<LanguagesResponse>({
                url: '/languages/active',
                method: 'GET'
            });

            if (result?.success) {
                setLanguages(result.data.languages);

                // თუ initialLang არის URL-დან
                if (initialLang) {
                    const urlLang = result.data.languages.find(
                        (lang: Language) => lang.code === initialLang
                    );
                    if (urlLang) {
                        setCurrentLanguage(urlLang);
                        setLoading(false);
                        return;
                    }
                }

                // localStorage შემოწმება
                if (typeof window !== 'undefined') {
                    const savedLang = localStorage.getItem('selectedLanguage');
                    if (savedLang) {
                        try {
                            const parsedLang: Language = JSON.parse(savedLang);
                            const langExists = result.data.languages.find(
                                (lang: Language) => lang.id === parsedLang.id
                            );
                            if (langExists) {
                                setCurrentLanguage(parsedLang);
                            } else {
                                setCurrentLanguage(result.data.default);
                            }
                        } catch (e) {
                            console.error('Error parsing saved language:', e);
                            setCurrentLanguage(result.data.default);
                        }
                    } else {
                        setCurrentLanguage(result.data.default);
                    }
                } else {
                    setCurrentLanguage(result.data.default);
                }
            }
        } catch (error) {
            console.error('Error loading languages:', error);
        } finally {
            setLoading(false);
        }
    }, [sendRequest, initialLang]);

    // Load languages on mount
    useEffect(() => {
        loadLanguages();
    }, [loadLanguages]); // დაემატა loadLanguages dependency

    // Load translations when language changes
    useEffect(() => {
        if (currentLanguage) {
            loadTranslations(currentLanguage.code);
            if (typeof window !== 'undefined') {
                localStorage.setItem('selectedLanguage', JSON.stringify(currentLanguage));
            }
        }
    }, [currentLanguage, loadTranslations]); // დაემატა loadTranslations dependency

    const changeLanguage = (language: Language): void => {
        setCurrentLanguage(language);

        // URL-ის შეცვლა
        if (pathname) {
            const segments = pathname.split('/');
            // პირველი segment არის ენის კოდი
            segments[1] = language.code;
            const newPath = segments.join('/');
            router.push(newPath);
        }
    };

    const t = (key: string, fallback?: string): string => {
        return translations[key] || fallback || key;
    };

    const value: LanguageContextType = {
        currentLanguage,
        languages,
        translations,
        loading,
        changeLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export type { Language, Translations, LanguageContextType };