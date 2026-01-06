"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
import Cover from "@/shared/components/theme/header/cover/cover";
import { useAuth } from "@/context/AuthContext";
import {useLanguage} from "@/context/LanguageContext";
import CustomLoader from "@/shared/components/ui/loader/customLoader";
import CheckoutForm from "@/app/[lang]/checkout/checkoutForm";

export default function CheckOut() {
    const router = useRouter();
    const { user, loading, checkAuth } = useAuth();
    const {t} = useLanguage();
    useEffect(() => {
        // Re-check auth once when the page mounts
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Redirect if user is not authenticated
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <>
                <Cover />
                <div className="container text-center mt-5 mb-5">
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">{t('loading','loading')}</span>
                    </div>
                </div>
            </>
        );
    }

    if (!user) {
        router.push("/login");

        return (<CustomLoader/>);

    }

    return (
        <>
            <Cover />
            <div className="container py-4">
                <HeaderTitle title={t('checkout','checkout')} slug="" />
                {/* Your content */}
                <div className={'col-md-6 m-auto '}>
                    <CheckoutForm />
                </div>
            </div>
        </>
    );
}
