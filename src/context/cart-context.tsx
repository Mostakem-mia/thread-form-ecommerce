"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { Product } from "../types/product";

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
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");

    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");

        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch {
                setCartItems([]);
            }
        }
        const savedDelivery = localStorage.getItem("deliveryArea");

        if (savedDelivery === "inside" || savedDelivery === "outside") {
            setDeliveryArea(savedDelivery);}
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("cartUpdated"));
    }, [cartItems, loaded]);

    useEffect(() => {
        if (!loaded) return;
    
        localStorage.setItem("deliveryArea", deliveryArea);
    }, [deliveryArea, loaded]);

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
        throw new Error(
            "useCart must be used inside a CartProvider"
        );
    }

    return context;
}