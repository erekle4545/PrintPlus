"use client";

import {
    createContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
    useRef,
} from "react";

import { CartItem } from "@/types/cart/cartTypes";
import { toast } from "react-toastify";
import { axiosInstance } from "@/shared/hooks/useHttp";
import {useLanguage} from "@/context/LanguageContext";

export interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    total: number;
    loading: boolean;
    refreshCart: () => Promise<void>;
    mergeGuestCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
    undefined
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {t} = useLanguage();
    // ✅ useRef-ით თავიდან ავიცილოთ infinite loop
    const hasMergedRef = useRef(false);
    const previousTokenRef = useRef<string | null>(null);

    // კალათის ჩატვირთვა backend-იდან
    const loadCart = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/cart");
            if (response.data.success) {
                setItems(response.data.data || []);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Merge guest cart after login
    const mergeGuestCart = useCallback(async () => {
        if (hasMergedRef.current) return;

        try {
            const response = await axiosInstance.post("/cart/merge");

            if (response.data.success) {
                hasMergedRef.current = true;
                await loadCart();

                if (response.data.merged_items > 0) {
                    toast.success(`კალათაში დაემატა ${response.data.merged_items} პროდუქტი`);
                }
            }
        } catch (error: any) {
            console.error('❌ Merge error:', error);
            await loadCart();
        }
    }, [loadCart]);

    //   Initial load - მხოლოდ ერთხელ
    useEffect(() => {
        loadCart();

        // შევინახოთ საწყისი token
        if (typeof window !== 'undefined') {
            previousTokenRef.current = localStorage.getItem("token");
        }
    }, []); //   ცარიელი array - მხოლოდ mount-ზე

    //   გაუმჯობესებული auth check
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkAuth = () => {
            const currentToken = localStorage.getItem("token");
            const previousToken = previousTokenRef.current;

            // თუ token შეიცვალა
            if (currentToken !== previousToken) {
                // თუ ახლა შევიდა (null -> token)
                if (!previousToken && currentToken) {
                    if (!hasMergedRef.current) {
                        mergeGuestCart();
                    }
                }

                // თუ გამოვიდა (token -> null)
                if (previousToken && !currentToken) {
                    hasMergedRef.current = false;
                    loadCart();
                }

                // განვაახლოთ previous token
                previousTokenRef.current = currentToken;
            }
        };

        const interval = setInterval(checkAuth, 1000);
        return () => clearInterval(interval);
    }, [loadCart, mergeGuestCart]); // ✅ მხოლოდ საჭირო dependencies

    // პროდუქტის დამატება
    const addItem = async (item: CartItem) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/cart", {
                product_id: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
                discount: item.discount,
                color: item.color,
                size: item.size,
                materials: item.materials,
                print_type: item.print_type,
                extras: item.extras,
                custom_dimensions: item.custom_dimensions,
                uploaded_file: item.uploaded_file,

                //   ფაილების ID-ები და ტიპები
                cover_id: item.cover_id,
                cover_type: item.cover_type,
            });

            if (response.data.success) {
                await loadCart();
            }
        } catch (error: any) {
            console.error("Error adding to cart:", error);
            toast.error(
                error.response?.data?.message || "შეცდომა კალათაში დამატებისას"
            );
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // პროდუქტის წაშლა
    const removeItem = async (id: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete(`/cart/${id}`);
            if (response.data.success) {
                await loadCart();
                toast.warn("პროდუქტი წაიშალა კალათიდან");
            }
        } catch (error: any) {
            console.error("Error removing from cart:", error);
            toast.error(
                error.response?.data?.message || "შეცდომა პროდუქტის წაშლისას"
            );
        } finally {
            setLoading(false);
        }
    };

    // რაოდენობის განახლება
    const updateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) {
            await removeItem(id);
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.put(`/cart/${id}`, {
                quantity,
            });

            if (response.data.success) {
                await loadCart();
            }
        } catch (error: any) {
            console.error("Error updating quantity:", error);
            toast.error(
                error.response?.data?.message ||
                "შეცდომა რაოდენობის განახლებისას"
            );
        } finally {
            setLoading(false);
        }
    };

    // კალათის გასუფთავება
    const clearCart = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/cart/clear");
            if (response.data.success) {
                setItems([]);
                toast.error("კალათა გასუფთავდა");
            }
        } catch (error: any) {
            console.error("Error clearing cart:", error);
            toast.error(
                error.response?.data?.message ||
                "შეცდომა კალათის გასუფთავებისას"
            );
        } finally {
            setLoading(false);
        }
    };

    // კალათის განახლება (refresh)
    const refreshCart = async () => {
        await loadCart();
    };

    // ჯამური თანხის გამოთვლა
    const total = items.reduce((sum, item) => {
        const price = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                loading,
                refreshCart,
                mergeGuestCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

