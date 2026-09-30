"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    size?: string;
    color?: string;
    quantity: number;
};

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");

        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        setLoaded(true);
    }, []);

    const updateCart = (items: CartItem[]) => {
        setCartItems(items);
        localStorage.setItem("cartItems", JSON.stringify(items));
    };

    const increaseQuantity = (index: number) => {
        const updated = [...cartItems];
        updated[index].quantity += 1;
        updateCart(updated);
    };

    const decreaseQuantity = (index: number) => {
        const updated = [...cartItems];

        if (updated[index].quantity > 1) {
            updated[index].quantity -= 1;
            updateCart(updated);
        }
    };

    const removeItem = (index: number) => {
        const updated = cartItems.filter((_, i) => i !== index);
        updateCart(updated);
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const [delivery, setDelivery] = useState("dhaka");

    const deliveryCharge = delivery === "dhaka" ? 80 : 150;
    const total = subtotal + (cartItems.length > 0 ? deliveryCharge : 0);

    if (!loaded) {
        return <div className="p-10 text-center">Loading cart...</div>;
    }

    return (
        <main className="min-h-screen bg-white px-5 py-12 text-black md:px-12">
            <div className="mx-auto max-w-6xl">
                <Link href="/" className="text-sm text-gray-500 hover:text-black">
                    ← Continue Shopping
                </Link>

                <h1 className="mb-10 mt-5 text-3xl font-semibold">
                    Your Shopping Bag
                </h1>

                {cartItems.length === 0 ? (
                    <div className="py-20 text-center">
                        <h2 className="mb-4 text-xl font-medium">
                            Your shopping bag is empty
                        </h2>

                        <Link
                            href="/"
                            className="inline-block bg-black px-8 py-3 text-white hover:bg-gray-800"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-12 md:grid-cols-[1fr_350px]">
                        <div>
                            {cartItems.map((item, index) => (
                                <div
                                    key={`${item.id}-${item.size}-${item.color}-${index}`}
                                    className="flex gap-5 border-b py-6"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-32 w-28 object-cover"
                                    />

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <h2 className="font-medium">{item.name}</h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {item.category}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Size: {item.size || "Not selected"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Color: {item.color || "Not selected"}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center border">
                                                <button
                                                    onClick={() => decreaseQuantity(index)}
                                                    className="px-3 py-1"
                                                >
                                                    −
                                                </button>

                                                <span className="px-3">{item.quantity}</span>

                                                <button
                                                    onClick={() => increaseQuantity(index)}
                                                    className="px-3 py-1"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(index)}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <p className="whitespace-nowrap font-medium">
                                        ৳{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <aside className="h-fit border p-6">
                            <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

                            <div className="mb-4 flex justify-between">
                                <span>Subtotal</span>
                                <span>৳{subtotal}</span>
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium">
                                    Delivery Location
                                </label>

                                <select
                                    value={delivery}
                                    onChange={(e) => setDelivery(e.target.value)}
                                    className="w-full border p-3"
                                >
                                    <option value="dhaka">Inside Dhaka — ৳80</option>
                                    <option value="outside">Outside Dhaka — ৳150</option>
                                </select>
                            </div>

                            <div className="mb-4 flex justify-between">
                                <span>Delivery Charge</span>
                                <span>৳{deliveryCharge}</span>
                            </div>

                            <div className="mb-6 flex justify-between border-t pt-4 text-lg font-semibold">
                                <span>Total</span>
                                <span>৳{total}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full bg-black py-4 text-center text-white hover:bg-gray-800"
                            >
                                Proceed to Checkout
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}