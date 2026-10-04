"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/navbar";
import { products } from "../../data/products";

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
    const [relatedStart, setRelatedStart] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(4);

    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");

        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        setLoaded(true);
    }, []);

    const cartCategories = [...new Set(
        cartItems.map((item) => item.category)
    )];

    const relatedProducts = products.filter(
        (product) =>
            cartCategories.includes(product.category) &&
            !cartItems.some((item) => item.id === product.id)
    );

    useEffect(() => {
        const updateItemsPerView = () => {
            setItemsPerView(window.innerWidth < 768 ? 2 : 4);
        };

        updateItemsPerView();

        window.addEventListener("resize", updateItemsPerView);

        return () => {
            window.removeEventListener("resize", updateItemsPerView);
        };
    }, []);


    useEffect(() => {
        if (relatedProducts.length <= itemsPerView) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);

            setRelatedStart((prev) => {
                const next = prev + 1;

                if (next >= relatedProducts.length * 2) {
                    return relatedProducts.length;
                }

                return next;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [relatedProducts.length, itemsPerView]);


    const updateCart = (items: CartItem[]) => {
        setCartItems(items);
        localStorage.setItem("cartItems", JSON.stringify(items));
        window.dispatchEvent(new Event("cartUpdated"));
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
        <>
            <Navbar />

            <main className="min-h-screen bg-white px-5 py-12 text-black md:px-12">
                <div className="mx-auto max-w-6xl">

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
                                <Link
                                    href="/shop"
                                    className="mt-3 block w-full border border-black py-4 text-center text-black hover:bg-black hover:text-white"
                                >
                                    Continue Shopping
                                </Link>
                            </aside>
                        </div>
                    )}
                </div>
                {/* You Might Also Like */}
                {cartItems.length > 0 && relatedProducts.length > 0 && (
                    <section className="mx-auto mt-24 max-w-7xl border-t border-gray-200 px-6 pt-16">
                        {/* Section Header */}
                        <div className="mb-8">
                            <p className="mb-2 text-xs tracking-[0.25em] text-gray-500">
                                EXPLORE MORE
                            </p>

                            <h2 className="text-2xl font-light tracking-wide md:text-3xl">
                                You Might Also Love
                            </h2>
                        </div>


                        {/* Product Carousel */}
                        <div className="relative overflow-hidden">

                            {/* Previous Button */}
                            {relatedProducts.length > itemsPerView && (
                                <button
                                    onClick={() => {
                                        setIsTransitioning(true);

                                        setRelatedStart((prev) => {
                                            if (prev <= relatedProducts.length) {
                                                return relatedProducts.length * 2 - 1;
                                            }

                                            return prev - 1;
                                        });
                                    }}
                                    className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/80 text-xl shadow-sm backdrop-blur-sm transition hover:bg-black hover:text-white"
                                    aria-label="Previous products"
                                >
                                    ←
                                </button>
                            )}

                            {/* Products */}
                            <div
                                className={`flex -mx-2 ${isTransitioning
                                    ? "transition-transform duration-700 ease-in-out"
                                    : ""
                                    }`}
                                style={{
                                    transform: `translateX(-${relatedStart * (100 / itemsPerView)
                                        }%)`,
                                }}
                            >
                                {[
                                    ...relatedProducts,
                                    ...relatedProducts,
                                    ...relatedProducts,
                                ].map((item, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="w-1/2 flex-none px-2 md:w-1/4"
                                    >
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="group block"
                                        >
                                            {/* Product Image */}
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="mt-4">
                                                <h3 className="text-sm font-medium">
                                                    {item.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    ৳{item.price.toLocaleString("en-BD")}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Next Button */}
                            {relatedProducts.length > itemsPerView && (
                                <button
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setRelatedStart((prev) => prev + 1);
                                    }}
                                    className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/80 text-xl shadow-sm backdrop-blur-sm transition hover:bg-black hover:text-white"
                                    aria-label="Next products"
                                >
                                    →
                                </button>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}