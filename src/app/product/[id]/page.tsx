"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { products } from "../../../data/products";
import Navbar from "../../../components/navbar";


export default function ProductDetails() {
    const params = useParams();
    const id = params.id as string;

    const product = products.find((item) => item.id === id);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    if (!product) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <h1 className="text-2xl font-semibold">Product not found</h1>
            </main>
        );
    }

    const relatedProducts = products.filter(
        (item) =>
            item.category === product.category &&
            item.id !== product.id
    );

    const [relatedStart, setRelatedStart] = useState(
        relatedProducts.length
    );

    const [itemsPerView, setItemsPerView] = useState(4);
    const [isTransitioning, setIsTransitioning] = useState(true);

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
            setRelatedStart((prev) => prev + 1);
            setIsTransitioning(true);
        }, 2000);

        return () => clearInterval(interval);
    }, [relatedProducts.length, itemsPerView]);

    useEffect(() => {
        if (relatedProducts.length === 0) return;

        const total = relatedProducts.length;

        if (relatedStart >= total * 2) {
            setTimeout(() => {
                setIsTransitioning(false);
                setRelatedStart(total);
            }, 700);
        }

        if (relatedStart < total) {
            setTimeout(() => {
                setIsTransitioning(false);
                setRelatedStart(total * 2 - 1);
            }, 700);
        }
    }, [relatedStart, relatedProducts.length]);


    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert("Please select a size and color.");
            return;
        }

        const savedCart = localStorage.getItem("cartItems");
        const cartItems = savedCart ? JSON.parse(savedCart) : [];

        const existingIndex = cartItems.findIndex(
            (item: {
                id: string;
                size?: string;
                color?: string;
            }) =>
                item.id === product.id &&
                item.size === selectedSize &&
                item.color === selectedColor
        );

        if (existingIndex >= 0) {
            cartItems[existingIndex].quantity += quantity;
        } else {
            cartItems.push({
                ...product,
                size: selectedSize,
                color: selectedColor,
                quantity,
            });
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        setAdded(true);
    };

    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    {/* Product Image */}
                    <div className="bg-gray-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-[500px] w-full object-cover md:h-[650px]"
                        />
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-col justify-center">
                        <p className="mb-4 text-sm tracking-[0.3em] text-gray-500">
                            {product.category}
                        </p>

                        <h1 className="mb-4 text-3xl font-light md:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mb-6 text-xl font-medium">
                            ৳{product.price.toLocaleString("en-BD")}
                        </p>

                        <p className="mb-8 leading-7 text-gray-600">
                            {product.description}
                        </p>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <h2 className="mb-3 font-medium">Color: {selectedColor}</h2>

                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setAdded(false);
                                        }}
                                        className={`border px-5 py-2 text-sm ${selectedColor === color
                                            ? "border-black bg-black text-white"
                                            : "border-gray-300 hover:border-black"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <h2 className="mb-3 font-medium">Size: {selectedSize}</h2>

                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setAdded(false);
                                        }}
                                        className={`h-12 w-12 border text-sm ${selectedSize === size
                                            ? "border-black bg-black text-white"
                                            : "border-gray-300 hover:border-black"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <h2 className="mb-3 font-medium">Quantity</h2>

                            <div className="flex w-fit items-center border border-gray-300">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-lg"
                                >
                                    −
                                </button>

                                <span className="px-4">{quantity}</span>

                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 text-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-black py-4 text-sm tracking-widest text-white transition hover:bg-gray-800"
                        >
                            {added ? "ADDED TO BAG ✓" : "ADD TO BAG"}
                        </button>

                        {added && (
                            <Link
                                href="/cart"
                                className="mt-4 block text-center text-sm underline"
                            >
                                View Shopping Bag
                            </Link>
                        )}

                        <p className="mt-5 text-sm text-gray-500">
                            Free returns on eligible orders.
                        </p>
                    </div>
                </div>
            </div>
            {/* You Might Also Like */}
            {relatedProducts.length > 0 && (
                <section className="mx-auto mt-24 max-w-7xl border-t border-gray-200 px-6 pt-16">
                    {/* Section Header */}
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <p className="mb-2 text-xs tracking-[0.25em] text-gray-500">
                                EXPLORE MORE
                            </p>

                            <h2 className="text-2xl font-light tracking-wide md:text-3xl">
                                You Might Also Love
                            </h2>
                        </div>
                    </div>

                    {/* Product Carousel */}
                    <div className="relative overflow-hidden">
                        {/* Previous Button */}
                        {relatedProducts.length > 4 && (
                            <button
                                onClick={() => {
                                    setIsTransitioning(true);
                                    setRelatedStart((prev) => prev - 1);
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
                                        {/* Image */}
                                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
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
                        {relatedProducts.length > 4 && (
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
    );
}