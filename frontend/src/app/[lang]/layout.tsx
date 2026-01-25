import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/index.css";
import { CartProvider } from "@/context/CartContext";
import AOSProvider from "@/shared/providers/AOSProvider";
import Header from "@/shared/components/theme/header/header";
import Footer from "@/shared/components/theme/footer/footer";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { notFound } from 'next/navigation';
import { languages, isValidLanguage } from '@/shared/config/i18n';
import {ContactProvider} from "@/context/ContactContext";
import ScrollToTop from "@/shared/components/ui/scroll/ScrollToTop";

// Static params generation
export async function generateStaticParams() {
    return languages.map((lang) => ({ lang }));
}

// Metadata per language
export async function generateMetadata({
                                           params
                                       }: {
    params: Promise<{ lang: string }>
}): Promise<Metadata> {
    const { lang } = await params; // await დამატებული

    const titles: Record<string, string> = {
        ka: 'Print Plus - სარეკლამო კომპანია',
        en: 'Print Plus - Advertising Company',
        ru: 'Print Plus - Рекламная компания'
    };

    const descriptions: Record<string, string> = {
        ka: 'Print Plus - ციფრული და ოფსეტური ბეჭდვა',
        en: 'Print Plus - Digital and Offset Printing',
        ru: 'Print Plus - Цифровая и офсетная печать'
    };

    return {
        title: titles[lang] || titles.ka,
        description: descriptions[lang] || descriptions.ka,
    };
}

export default async function LangLayout({
     children,
     params,
 }: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>; // Promise type
}) {
    const { lang } = await params; // await დამატებული

    // შეამოწმეთ ენა
    if (!isValidLanguage(lang)) {
        notFound();
    }

    return (
        <html lang={lang}>
        <body>
        <AuthProvider>
            <LanguageProvider initialLang={lang}>
                <ContactProvider>
                    <CartProvider>
                        <AOSProvider />
                        <ScrollToTop />
                        <Header />

                        {children}

                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            className={'text_font'}
                            toastClassName={'text_font'}
                            theme="light"
                        />
                        <Footer />
                    </CartProvider>
                </ContactProvider>
            </LanguageProvider>
        </AuthProvider>
        </body>
        </html>
    );
}