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

    // ✅ Initial load - მხოლოდ ერთხელ
    useEffect(() => {
        loadCart();

        // შევინახოთ საწყისი token
        if (typeof window !== 'undefined') {
            previousTokenRef.current = localStorage.getItem("token");
        }
    }, []); // ✅ ცარიელი array - მხოლოდ mount-ზე

    // ✅ გაუმჯობესებული auth check
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

                // ✅ ფაილების ID-ები და ტიპები
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

// "use client";
//
// import {
//     createContext,
//     useEffect,
//     useState,
//     ReactNode,
//     useCallback,
// } from "react";
//
// import { CartItem } from "@/types/cart/cartTypes";
// import { toast } from "react-toastify";
// import { axiosInstance } from "@/shared/hooks/useHttp";
//
// export interface CartContextType {
//     items: CartItem[];
//     addItem: (item: CartItem) => Promise<void>;
//     removeItem: (id: number) => Promise<void>;
//     updateQuantity: (id: number, quantity: number) => Promise<void>;
//     clearCart: () => Promise<void>;
//     total: number;
//     loading: boolean;
//     refreshCart: () => Promise<void>;
//     mergeGuestCart: () => Promise<void>;
// }
//
// export const CartContext = createContext<CartContextType | undefined>(
//     undefined
// );
//
// export const CartProvider = ({ children }: { children: ReactNode }) => {
//     const [items, setItems] = useState<CartItem[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//     const [hasMerged, setHasMerged] = useState<boolean>(false);
//
//     // ✅ Check authentication status
//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const wasAuthenticated = isAuthenticated;
//         const nowAuthenticated = !!token;
//
//         setIsAuthenticated(nowAuthenticated);
//
//         // ✅ If just logged in, merge guest cart
//         if (!wasAuthenticated && nowAuthenticated && !hasMerged) {
//             mergeGuestCart();
//         }
//     }, []);
//
//     // ✅ Watch for token changes (login/logout)
//     useEffect(() => {
//         const checkAuth = () => {
//             const token = localStorage.getItem("token");
//             const wasAuthenticated = isAuthenticated;
//             const nowAuthenticated = !!token;
//
//             if (wasAuthenticated !== nowAuthenticated) {
//                 setIsAuthenticated(nowAuthenticated);
//
//                 // ✅ If just logged in, merge cart
//                 if (!wasAuthenticated && nowAuthenticated && !hasMerged) {
//                     mergeGuestCart();
//                 }
//
//                 // ✅ If logged out, reload cart (guest cart)
//                 if (wasAuthenticated && !nowAuthenticated) {
//                     setHasMerged(false);
//                     loadCart();
//                 }
//             }
//         };
//
//         // Check every second
//         const interval = setInterval(checkAuth, 1000);
//
//         return () => clearInterval(interval);
//     }, [isAuthenticated, hasMerged]);
//
//     // კალათის ჩატვირთვა backend-იდან (guest ან auth)
//     const loadCart = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await axiosInstance.get("/cart");
//             if (response.data.success) {
//                 setItems(response.data.data || []);
//             }
//         } catch (error) {
//             console.error("Error loading cart:", error);
//             // თუ error-ია, ცარიელი კალათა
//             setItems([]);
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     // ✅ Merge guest cart after login
//     const mergeGuestCart = async () => {
//         if (hasMerged) return; // Already merged
//
//         try {
//             // console.log('🔄 Merging guest cart...');
//             const response = await axiosInstance.post("/cart/merge");
//
//             if (response.data.success) {
//                 // console.log('✅ Cart merged successfully:', response.data);
//                 setHasMerged(true);
//
//                 // Reload cart to show merged items
//                 await loadCart();
//
//                 if (response.data.merged_items > 0) {
//                     toast.success(`კალათაში დაემატა ${response.data.merged_items} პროდუქტი`);
//                 }
//             }
//         } catch (error: any) {
//             console.error('❌ Merge error:', error);
//             // If merge fails, still reload cart
//             await loadCart();
//         }
//     };
//
//     // Initial load
//     useEffect(() => {
//         loadCart();
//     }, [loadCart]);
//
//     // პროდუქტის დამატება
//     const addItem = async (item: CartItem) => {
//         setLoading(true);
//         try {
//             const response = await axiosInstance.post("/cart", {
//                 product_id: item.product_id,
//                 name: item.name,
//                 quantity: item.quantity,
//                 price: item.price,
//                 image: item.image,
//                 discount: item.discount,
//                 color: item.color,
//                 size: item.size,
//                 materials: item.materials,
//                 print_type: item.print_type,
//                 extras: item.extras,
//                 custom_dimensions: item.custom_dimensions,
//                 uploaded_file: item.uploaded_file,
//             });
//
//             if (response.data.success) {
//                 await loadCart(); // Reload cart
//                 // toast.success("დაემატა კალათაში");
//             }
//         } catch (error: any) {
//             console.error("Error adding to cart:", error);
//             toast.error(
//                 error.response?.data?.message || "შეცდომა კალათაში დამატებისას"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // პროდუქტის წაშლა
//     const removeItem = async (id: number) => {
//         setLoading(true);
//         try {
//             const response = await axiosInstance.delete(`/cart/${id}`);
//             if (response.data.success) {
//                 await loadCart();
//                 toast.warn("პროდუქტი წაიშალა კალათიდან");
//             }
//         } catch (error: any) {
//             console.error("Error removing from cart:", error);
//             toast.error(
//                 error.response?.data?.message || "შეცდომა პროდუქტის წაშლისას"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // რაოდენობის განახლება
//     const updateQuantity = async (id: number, quantity: number) => {
//         if (quantity < 1) {
//             await removeItem(id);
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const response = await axiosInstance.put(`/cart/${id}`, {
//                 quantity,
//             });
//
//             if (response.data.success) {
//                 await loadCart();
//             }
//         } catch (error: any) {
//             console.error("Error updating quantity:", error);
//             toast.error(
//                 error.response?.data?.message ||
//                 "შეცდომა რაოდენობის განახლებისას"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // კალათის გასუფთავება
//     const clearCart = async () => {
//         setLoading(true);
//         try {
//             const response = await axiosInstance.post("/cart/clear");
//             if (response.data.success) {
//                 setItems([]);
//                 toast.error("კალათა გასუფთავდა");
//             }
//         } catch (error: any) {
//             console.error("Error clearing cart:", error);
//             toast.error(
//                 error.response?.data?.message ||
//                 "შეცდომა კალათის გასუფთავებისას"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // კალათის განახლება (refresh)
//     const refreshCart = async () => {
//         await loadCart();
//     };
//
//     // ჯამური თანხის გამოთვლა
//     const total = items.reduce((sum, item) => {
//         const price = item.discount
//             ? item.price * (1 - item.discount / 100)
//             : item.price;
//         return sum + price * item.quantity;
//     }, 0);
//
//     return (
//         <CartContext.Provider
//             value={{
//                 items,
//                 addItem,
//                 removeItem,
//                 updateQuantity,
//                 clearCart,
//                 total,
//                 loading,
//                 refreshCart,
//                 mergeGuestCart,
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// };

// "use client";
//
// import {
//     createContext,
//     useEffect,
//     useState,
//     ReactNode,
//     useCallback,
// } from "react";
// import { CartItem } from "@/types/cart/cartTypes";
// import { toast } from "react-toastify";
// import { axiosInstance } from "@/shared/hooks/useHttp";
//
// export interface CartContextType {
//     items: CartItem[];
//     addItem: (item: CartItem) => Promise<void>;
//     removeItem: (id: number) => Promise<void>;
//     updateQuantity: (id: number, quantity: number) => Promise<void>;
//     clearCart: () => Promise<void>;
//     total: number;
//     loading: boolean;
//     refreshCart: () => Promise<void>;
// }
//
// export const CartContext = createContext<CartContextType | undefined>(
//     undefined
// );
//
// export const CartProvider = ({ children }: { children: ReactNode }) => {
//     const [items, setItems] = useState<CartItem[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//
//     // შევამოწმოთ ავტორიზაცია
//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         setIsAuthenticated(!!token);
//     }, []);
//
//     // კალათის ჩატვირთვა backend-იდან
//     const loadCart = useCallback(async () => {
//         if (!isAuthenticated) {
//             // თუ არ არის ავტორიზებული, localStorage-დან ჩაიტვირთოს
//             try {
//                 const saved = localStorage.getItem("cart");
//                 if (saved) {
//                     const parsed = JSON.parse(saved);
//                     if (Array.isArray(parsed)) {
//                         setItems(parsed);
//                     }
//                 }
//             } catch (err) {
//                 console.error("localStorage parse error:", err);
//             }
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const response = await axiosInstance.get("/cart");
//             if (response.data.success) {
//                 setItems(response.data.data || []);
//             }
//         } catch (error) {
//             console.error("Error loading cart:", error);
//             // თუ API error-ია, localStorage-დან ჩაიტვირთოს
//             try {
//                 const saved = localStorage.getItem("cart");
//                 if (saved) {
//                     const parsed = JSON.parse(saved);
//                     if (Array.isArray(parsed)) {
//                         setItems(parsed);
//                     }
//                 }
//             } catch (err) {
//                 console.error("localStorage fallback error:", err);
//             }
//         } finally {
//             setLoading(false);
//         }
//     }, [isAuthenticated]);
//
//     // Initial load
//     useEffect(() => {
//         loadCart();
//     }, [loadCart]);
//
//     // Sync to localStorage for non-authenticated users
//     useEffect(() => {
//         if (!isAuthenticated && items.length > 0) {
//             localStorage.setItem("cart", JSON.stringify(items));
//         }
//     }, [items, isAuthenticated]);
//
//     // Sync across tabs (for non-authenticated users)
//     useEffect(() => {
//         if (isAuthenticated) return; // API-ით სინქრონიზდება
//
//         const syncCart = (event: StorageEvent) => {
//             if (event.key === "cart" && event.newValue) {
//                 try {
//                     const parsed = JSON.parse(event.newValue);
//                     if (Array.isArray(parsed)) {
//                         setItems(parsed);
//                     }
//                 } catch (err) {
//                     console.error("Sync parse error:", err);
//                 }
//             }
//         };
//
//         window.addEventListener("storage", syncCart);
//         return () => window.removeEventListener("storage", syncCart);
//     }, [isAuthenticated]);
//
//     // პროდუქტის დამატება
//     const addItem = async (item: CartItem) => {
//         if (!isAuthenticated) {
//             // LocalStorage mode
//             let updated = false;
//             setItems((prev) => {
//                 const exists = prev.find((i) => i.id === item.id);
//                 if (exists) {
//                     updated = true;
//                     return prev.map((i) =>
//                         i.id === item.id
//                             ? { ...i, quantity: i.quantity + item.quantity }
//                             : i
//                     );
//                 }
//                 return [...prev, item];
//             });
//
//             updated
//                 ? toast.info("პროდუქტის რაოდენობა განახლდა")
//                 : toast.success("დაემატა კალათაში");
//             return;
//         }
//
//         // API mode
//         setLoading(true);
//         try {
//             const response = await axiosInstance.post("/cart", {
//                 product_id: item.product_id,
//                 quantity: item.quantity,
//                 price: item.price,
//                 color: item.color,
//                 materials: item.materials,
//                 print_type: item.print_type,
//                 size: item.size,
//                 image: item.image,
//                 extras: item.extras,
//                 custom_dimensions: item.custom_dimensions,
//                 uploaded_file: item.uploaded_file,
//             });
//
//             if (response.data.success) {
//                 await loadCart(); // Reload cart
//                 toast.success("დაემატა კალათაში");
//             }
//         } catch (error: any) {
//             console.error("Error adding to cart:", error);
//             toast.error(
//                 error.response?.data?.message || "შეცდომა კალათაში დამატებისას"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // პროდუქტის წაშლა
//     const removeItem = async (id: number) => {
//         if (!isAuthenticated) {
//             // LocalStorage mode
//             setItems((prev) => prev.filter((i) => i.id !== id));
//             toast.warn("პროდუქტი წაიშალა კალათიდან");
//             return;
//         }
//
//         // API mode
//         setLoading(true);
//         try {
//             const response = await axiosInstance.delete(`/cart/${id}`);
//             if (response.data.success) {
//                 await loadCart();
//                 toast.warn("პროდუქტი წაიშალა კალათიდან");
//             }
//         } catch (error: any) {
//             console.error("Error removing from cart:", error);
//             toast.error(
//                 error.response?.data?.message || "შეცდომა პროდუქტის წაშლისას"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // რაოდენობის განახლება
//     const updateQuantity = async (id: number, quantity: number) => {
//         if (quantity < 1) {
//             await removeItem(id);
//             return;
//         }
//
//         if (!isAuthenticated) {
//             // LocalStorage mode
//             setItems((prev) =>
//                 prev.map((i) => (i.id === id ? { ...i, quantity } : i))
//             );
//             return;
//         }
//
//         // API mode
//         setLoading(true);
//         try {
//             const response = await axiosInstance.put(`/cart/${id}`, {
//                 quantity,
//             });
//
//             if (response.data.success) {
//                 await loadCart();
//             }
//         } catch (error: any) {
//             console.error("Error updating quantity:", error);
//             toast.error(
//                 error.response?.data?.message ||
//                 "შეცდომა რაოდენობის განახლებისას"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // კალათის გასუფთავება
//     const clearCart = async () => {
//         if (!isAuthenticated) {
//             // LocalStorage mode
//             setItems([]);
//             localStorage.removeItem("cart");
//             toast.error("კალათა გასუფთავდა");
//             return;
//         }
//
//         // API mode
//         setLoading(true);
//         try {
//             const response = await axiosInstance.post("/cart/clear");
//             if (response.data.success) {
//                 setItems([]);
//                 toast.error("კალათა გასუფთავდა");
//             }
//         } catch (error: any) {
//             console.error("Error clearing cart:", error);
//             toast.error(
//                 error.response?.data?.message ||
//                 "შეცდომა კალათის გასუფთავებისას"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // კალათის განახლება (refresh)
//     const refreshCart = async () => {
//         await loadCart();
//     };
//
//     // ჯამური თანხის გამოთვლა
//     const total = items.reduce((sum, item) => {
//         const price = item.discount
//             ? item.price * (1 - item.discount / 100)
//             : item.price;
//         return sum + price * item.quantity;
//     }, 0);
//
//     return (
//         <CartContext.Provider
//             value={{
//                 items,
//                 addItem,
//                 removeItem,
//                 updateQuantity,
//                 clearCart,
//                 total,
//                 loading,
//                 refreshCart,
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// };
