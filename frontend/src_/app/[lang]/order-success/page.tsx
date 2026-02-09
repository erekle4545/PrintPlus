// app/[lang]/order-success/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cover from "@/shared/components/theme/header/cover/cover";
import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
import { useLanguage } from "@/context/LanguageContext";
import CustomLoader from "@/shared/components/ui/loader/customLoader";
import OrderSuccessContent from "./OrderSuccessContent";

function OrderSuccessPage() {
    return (
        <>
            <Cover />
            <div className="container py-4">
                <Suspense fallback={<CustomLoader />}>
                    <OrderSuccessContent />
                </Suspense>
            </div>
        </>
    );
}

export default OrderSuccessPage;