"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

// Product data
const products = [
    {
        id: "1",
        name: "Classic Linen Shirt",
        category: "MEN",
        price: 1850,
        image:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000",
        description:
            "A timeless linen shirt designed for everyday comfort and effortless style.",
        colors: ["White", "Black", "Beige"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "2",
        name: "Minimal White Shirt",
        category: "MEN",
        price: 1650,
        image:
            "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=1000",
        description:
            "A clean and minimal white shirt for a modern, versatile wardrobe.",
        colors: ["White", "Black"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "3",
        name: "Elegant Summer Dress",
        category: "WOMEN",
        price: 2450,
        image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000",
        description:
            "An elegant summer dress with a comfortable fit and a beautiful silhouette.",
        colors: ["Beige", "Black", "Pink"],
        sizes: ["S", "M", "L"],
    },
    {
        id: "4",
        name: "Classic Denim",
        category: "MEN",
        price: 2100,
        image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000",
        description:
            "Classic denim made for everyday wear, comfort, and timeless style.",
        colors: ["Blue", "Black"],
        sizes: ["30", "32", "34", "36"],
    },
    {
        id: "5",
        name: "Classic Linen Shirt 2",
        category: "MEN",
        price: 1850,
        image:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000",
        description:
            "A timeless linen shirt designed for everyday comfort and effortless style.",
        colors: ["White", "Black", "Beige"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "6",
        name: "Minimal White Shirt 2",
        category: "MEN",
        price: 1650,
        image:
            "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=1000",
        description:
            "A clean and minimal white shirt for a modern, versatile wardrobe.",
        colors: ["White", "Black"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "7",
        name: "Elegant Summer Dress 2",
        category: "WOMEN",
        price: 2450,
        image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000",
        description:
            "An elegant summer dress with a comfortable fit and a beautiful silhouette.",
        colors: ["Beige", "Black", "Pink"],
        sizes: ["S", "M", "L"],
    },
    {
        id: "8",
        name: "Classic Denim 2",
        category: "MEN",
        price: 2100,
        image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000",
        description:
            "Classic denim made for everyday wear, comfort, and timeless style.",
        colors: ["Blue", "Black"],
        sizes: ["30", "32", "34", "36"],
    },
];

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
            <div className="mx-auto max-w-7xl px-6 py-12">
                <Link
                    href="/"
                    className="mb-8 inline-block text-sm text-gray-500 hover:text-black"
                >
                    ← Back to Shop
                </Link>

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
        </main>
    );
}