"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    type ReactNode,
} from "react";
import { Product } from "../types/product";
import { useAuth } from "./auth-context";

export type CartItem = Product & {
    size?: string;
    color?: string;
    quantity: number;
};

type CartContextType = {
    cartItems: CartItem[];
    cartCount: number;
    loaded: boolean;
    deliveryArea: "inside" | "outside";
    setDeliveryArea: (area: "inside" | "outside") => void;
    addToCart: (
        product: Product,
        size: string,
        color: string,
        quantity: number
    ) => void;
    increaseQuantity: (index: number) => void;
    decreaseQuantity: (index: number) => void;
    removeItem: (index: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
    // ইউজার অনুযায়ী ডাইনামিক স্টোরেজ কী (লগইন না থাকলে guest কী)
    const cartStorageKey = isAuthenticated && user?.email
        ? `app_cart_${user.email.toLowerCase()}`
        : "app_cart_guest";

    const deliveryStorageKey = isAuthenticated && user?.email
        ? `app_delivery_${user.email.toLowerCase()}`
        : "app_delivery_guest";

    const previousStorageKey = useRef(cartStorageKey);
    const previousDeliveryStorageKey = useRef(deliveryStorageKey);

    // যখনই ইউজার লগইন, লগআউট বা অন্য একাউন্টে সুইচ করবে, সাথে সাথে সেই একাউন্টের কার্ট লোড হবে
    useEffect(() => {
        setLoaded(false);

        try {
            const savedCart = localStorage.getItem(cartStorageKey);
            const accountCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
            let nextCart = Array.isArray(accountCart) ? accountCart : [];

            // Preserve a guest cart after login by merging it into the signed-in account cart.
            if (isAuthenticated && user?.email) {
                const guestRaw = localStorage.getItem("app_cart_guest");
                const guestCart: CartItem[] = guestRaw ? JSON.parse(guestRaw) : [];
                if (Array.isArray(guestCart) && guestCart.length > 0) {
                    const merged = [...nextCart];
                    guestCart.forEach((guestItem) => {
                        const index = merged.findIndex((item) =>
                            item.id === guestItem.id &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                        );
                        if (index >= 0) {
                            merged[index] = {
                                ...merged[index],
                                quantity: merged[index].quantity + guestItem.quantity,
                            };
                        } else {
                            merged.push(guestItem);
                        }
                    });
                    nextCart = merged;
                    localStorage.setItem(cartStorageKey, JSON.stringify(nextCart));
                    localStorage.removeItem("app_cart_guest");
                }
            }

            setCartItems(nextCart);
        } catch {
            setCartItems([]);
        }

        try {
            const savedDelivery = localStorage.getItem(deliveryStorageKey);
            if (savedDelivery === "inside" || savedDelivery === "outside") {
                setDeliveryArea(savedDelivery);
            } else {
                setDeliveryArea("inside");
            }
        } catch {
            setDeliveryArea("inside");
        }

        setLoaded(true);
    }, [cartStorageKey, deliveryStorageKey]);

    // কার্ট আইটেম পরিবর্তন হলে ওই ইউজারের নির্দিষ্ট কি-তে সেভ হবে
    useEffect(() => {
        if (!loaded) return;
        if (previousStorageKey.current !== cartStorageKey) {
            previousStorageKey.current = cartStorageKey;
            return;
        }

        localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
        window.dispatchEvent(new Event("cartUpdated"));
    }, [cartItems, cartStorageKey, loaded]);

    // ডেলিভারি এরিয়া পরিবর্তন হলে ওই ইউজারের কি-তে সেভ হবে
    useEffect(() => {
        if (!loaded) return;
        if (previousDeliveryStorageKey.current !== deliveryStorageKey) {
            previousDeliveryStorageKey.current = deliveryStorageKey;
            return;
        }

        localStorage.setItem(deliveryStorageKey, deliveryArea);
    }, [deliveryArea, deliveryStorageKey, loaded]);

    const addToCart = (
        product: Product,
        size: string,
        color: string,
        quantity: number
    ) => {
        setCartItems((currentItems) => {
            const existingIndex = currentItems.findIndex(
                (item) =>
                    item.id === product.id &&
                    item.size === size &&
                    item.color === color
            );

            if (existingIndex >= 0) {
                return currentItems.map((item, index) =>
                    index === existingIndex
                        ? {
                            ...item,
                            quantity: item.quantity + quantity,
                        }
                        : item
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    size,
                    color,
                    quantity,
                },
            ];
        });
    };

    const increaseQuantity = (index: number) => {
        setCartItems((currentItems) =>
            currentItems.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                    : item
            )
        );
    };

    const decreaseQuantity = (index: number) => {
        setCartItems((currentItems) =>
            currentItems.map((item, itemIndex) =>
                itemIndex === index && item.quantity > 1
                    ? {
                        ...item,
                        quantity: item.quantity - 1,
                    }
                    : item
            )
        );
    };

    const removeItem = (index: number) => {
        setCartItems((currentItems) =>
            currentItems.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(cartStorageKey);
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                loaded,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeItem,
                clearCart,
                deliveryArea,
                setDeliveryArea,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside a CartProvider");
    }

    return context;
}