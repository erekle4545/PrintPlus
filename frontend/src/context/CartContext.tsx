"use client";

import {
    createContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { CartItem } from "@/types/cart/cartTypes";
import { toast } from "react-toastify";
import { axiosInstance } from "@/shared/hooks/useHttp";

export interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    total: number;
    loading: boolean;
    refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
    undefined
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // შევამოწმოთ ავტორიზაცია
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    // კალათის ჩატვირთვა backend-იდან
    const loadCart = useCallback(async () => {
        if (!isAuthenticated) {
            // თუ არ არის ავტორიზებული, localStorage-დან ჩაიტვირთოს
            try {
                const saved = localStorage.getItem("cart");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        setItems(parsed);
                    }
                }
            } catch (err) {
                console.error("localStorage parse error:", err);
            }
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.get("/cart");
            if (response.data.success) {
                setItems(response.data.data || []);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            // თუ API error-ია, localStorage-დან ჩაიტვირთოს
            try {
                const saved = localStorage.getItem("cart");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        setItems(parsed);
                    }
                }
            } catch (err) {
                console.error("localStorage fallback error:", err);
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Initial load
    useEffect(() => {
        loadCart();
    }, [loadCart]);

    // Sync to localStorage for non-authenticated users
    useEffect(() => {
        if (!isAuthenticated && items.length > 0) {
            localStorage.setItem("cart", JSON.stringify(items));
        }
    }, [items, isAuthenticated]);

    // Sync across tabs (for non-authenticated users)
    useEffect(() => {
        if (isAuthenticated) return; // API-ით სინქრონიზდება

        const syncCart = (event: StorageEvent) => {
            if (event.key === "cart" && event.newValue) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    if (Array.isArray(parsed)) {
                        setItems(parsed);
                    }
                } catch (err) {
                    console.error("Sync parse error:", err);
                }
            }
        };

        window.addEventListener("storage", syncCart);
        return () => window.removeEventListener("storage", syncCart);
    }, [isAuthenticated]);

    // პროდუქტის დამატება
    const addItem = async (item: CartItem) => {
        if (!isAuthenticated) {
            // LocalStorage mode
            let updated = false;
            setItems((prev) => {
                const exists = prev.find((i) => i.id === item.id);
                if (exists) {
                    updated = true;
                    return prev.map((i) =>
                        i.id === item.id
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    );
                }
                return [...prev, item];
            });

            updated
                ? toast.info("პროდუქტის რაოდენობა განახლდა")
                : toast.success("დაემატა კალათაში");
            return;
        }

        // API mode
        setLoading(true);
        try {
            const response = await axiosInstance.post("/cart", {
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                color: item.color,
                materials: item.materials,
                print_type: item.print_type,
                size: item.size,
                image: item.image,
                extras: item.extras,
                custom_dimensions: item.custom_dimensions,
                uploaded_file: item.uploaded_file,
            });

            if (response.data.success) {
                await loadCart(); // Reload cart
                toast.success("დაემატა კალათაში");
            }
        } catch (error: any) {
            console.error("Error adding to cart:", error);
            toast.error(
                error.response?.data?.message || "შეცდომა კალათაში დამატებისას"
            );
        } finally {
            setLoading(false);
        }
    };

    // პროდუქტის წაშლა
    const removeItem = async (id: number) => {
        if (!isAuthenticated) {
            // LocalStorage mode
            setItems((prev) => prev.filter((i) => i.id !== id));
            toast.warn("პროდუქტი წაიშალა კალათიდან");
            return;
        }

        // API mode
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

        if (!isAuthenticated) {
            // LocalStorage mode
            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, quantity } : i))
            );
            return;
        }

        // API mode
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
        if (!isAuthenticated) {
            // LocalStorage mode
            setItems([]);
            localStorage.removeItem("cart");
            toast.error("კალათა გასუფთავდა");
            return;
        }

        // API mode
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
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// "use client";
//
// import {
//     createContext,
//     useEffect,
//     useRef,
//     useState,
//     ReactNode,
// } from "react";
// import { CartItem } from "@/types/cart/cartTypes";
// import { toast } from "react-toastify";
//
// export interface CartContextType {
//     items: CartItem[];
//     addItem: (item: CartItem) => void;
//     removeItem: (id: number) => void;
//     updateQuantity: (id: number, quantity: number) => void;
//     clearCart: () => void;
//     total: number;
// }
//
// // ❗ CartContext-ს ვაექსპორტებთ, რომ useCart ჰუქში გამოვიყენოთ
// export const CartContext = createContext<CartContextType | undefined>(
//     undefined
// );
//
// export const CartProvider = ({ children }: { children: ReactNode }) => {
//     const isFirstRender = useRef(true);
//
//     const [items, setItems] = useState<CartItem[]>(() => {
//         if (typeof window === "undefined") return [];
//         try {
//             const saved = localStorage.getItem("cart");
//             if (saved) {
//                 const parsed = JSON.parse(saved);
//                 if (Array.isArray(parsed)) return parsed;
//             }
//         } catch (err) {
//             console.error("localStorage parse error:", err);
//         }
//         return [];
//     });
//
//     // Save to localStorage (but not on initial mount)
//     useEffect(() => {
//         if (isFirstRender.current) {
//             isFirstRender.current = false;
//             return;
//         }
//         localStorage.setItem("cart", JSON.stringify(items));
//     }, [items]);
//
//     // Sync across tabs
//     useEffect(() => {
//         const syncCart = (event: StorageEvent) => {
//             if (event.key === "cart" && event.newValue) {
//                 try {
//                     const parsed = JSON.parse(event.newValue);
//                     if (Array.isArray(parsed)) {
//                         setItems(parsed);
//                         // toast.info("🔄 კალათა განახლდა სხვა ტაბიდან");
//                     }
//                 } catch (err) {
//                     console.error("Sync parse error:", err);
//                 }
//             }
//         };
//
//         window.addEventListener("storage", syncCart);
//         return () => window.removeEventListener("storage", syncCart);
//     }, []);
//
//     const addItem = (item: CartItem) => {
//         let updated = false;
//
//         setItems((prev) => {
//             const exists = prev.find((i) => i.id === item.id);
//             if (exists) {
//                 updated = true;
//                 return prev.map((i) =>
//                     i.id === item.id
//                         ? { ...i, quantity: i.quantity + item.quantity }
//                         : i
//                 );
//             }
//             return [...prev, item];
//         });
//
//         updated
//             ? toast.info("პროდუქტის რაოდენობა განახლდა")
//             : toast.success("დაემატა კალათაში");
//     };
//
//     const removeItem = (id: number) => {
//         setItems((prev) => prev.filter((i) => i.id !== id));
//         toast.warn("პროდუქტი წაიშალა კალათიდან");
//     };
//
//     const updateQuantity = (id: number, quantity: number) => {
//         setItems((prev) =>
//             prev.map((i) => (i.id === id ? { ...i, quantity } : i))
//         );
//         // toast.info("რაოდენობა განახლდა");
//     };
//
//     const clearCart = () => {
//         setItems([]);
//         toast.error("კალათა გასუფთავდა");
//     };
//
//     const total = items.reduce((sum, item) => {
//         const price = item.discount
//             ? item.price * (1 - item.discount / 100)
//             : item.price;
//         return sum + price * item.quantity;
//     }, 0);
//
//     return (
//         <CartContext.Provider
//             value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// };
