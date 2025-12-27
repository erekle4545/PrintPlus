import { axiosInstance } from "./useHttp";
import { SliderData, SliderResponse } from "@/types/home/home";
import { useLanguage } from "@/context/LanguageContext";
import { useCallback, useEffect, useState } from "react";

export const useSlider = () => {
    const { currentLanguage } = useLanguage();

    const [sliders, setSliders] = useState<SliderData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSlider = useCallback(async () => {
        if (!currentLanguage?.id) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get<SliderResponse>("/slider", {
                params: { language_id: currentLanguage.id },
            });

            setSliders(response.data?.sliders ?? []);
        } catch (err: any) {
            const errorMessage =
                err.response?.status === 404
                    ? "Slider not found"
                    : err.response?.data?.message || "Failed to load slider";
            setError(errorMessage);
            console.error("Slider fetch error:", err);
            setSliders([]);
        } finally {
            setLoading(false);
        }
    }, [currentLanguage?.id]);

    useEffect(() => {
        fetchSlider();
    }, [fetchSlider]);

    return { sliders, loading, error, refetch: fetchSlider };
};
