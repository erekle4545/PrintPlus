"use client";

import {
    createContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";
import { CartItem } from "@/types/cart/cartTypes";
import { toast } from "react-toastify";

export interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

// ❗ CartContext-ს ვაექსპორტებთ, რომ useCart ჰუქში გამოვიყენოთ
export const CartContext = createContext<CartContextType | undefined>(
    undefined
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const isFirstRender = useRef(true);

    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return [];
        try {
            const saved = localStorage.getItem("cart");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (err) {
            console.error("localStorage parse error:", err);
        }
        return [];
    });

    // Save to localStorage (but not on initial mount)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    // Sync across tabs
    useEffect(() => {
        const syncCart = (event: StorageEvent) => {
            if (event.key === "cart" && event.newValue) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    if (Array.isArray(parsed)) {
                        setItems(parsed);
                        // toast.info("🔄 კალათა განახლდა სხვა ტაბიდან");
                    }
                } catch (err) {
                    console.error("Sync parse error:", err);
                }
            }
        };

        window.addEventListener("storage", syncCart);
        return () => window.removeEventListener("storage", syncCart);
    }, []);

    const addItem = (item: CartItem) => {
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
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.warn("პროდუქტი წაიშალა კალათიდან");
    };

    const updateQuantity = (id: number, quantity: number) => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
        // toast.info("რაოდენობა განახლდა");
    };

    const clearCart = () => {
        setItems([]);
        toast.error("კალათა გასუფთავდა");
    };

    const total = items.reduce((sum, item) => {
        const price = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
};
