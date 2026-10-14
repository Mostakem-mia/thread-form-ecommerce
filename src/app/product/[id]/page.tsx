"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { products } from "../../../data/products";
import { useCart } from "../../../context/cart-context";
import { getItemFinalPrice } from "../../../lib/pricing";
import ProductCard from "../../../components/product-card";

export default function ProductDetails() {
    const params = useParams();
    const id = params?.id as string;
    const product = products.find((item) => String(item.id) === String(id));

    if (!product) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] text-neutral-900">
                <div className="text-center">
                    <h1 className="text-2xl font-light">Product not found</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        The piece you are looking for does not exist.
                    </p>
                    <Link
                        href="/shop"
                        className="mt-6 inline-block bg-black px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
                    >
                        Return to Shop
                    </Link>
                </div>
            </main>
        );
    }

    return <ProductDetailsContent product={product} />;
}

function ProductDetailsContent({ product }: { product: (typeof products)[number] }) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const relatedProducts = products.filter(
        (item) => item.category === product.category && item.id !== product.id
    );

    const [relatedStart, setRelatedStart] = useState(relatedProducts.length);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Responsive items count
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

    // Carousel Auto Slide
    useEffect(() => {
        if (relatedProducts.length <= itemsPerView) return;

        const interval = setInterval(() => {
            setRelatedStart((prev) => prev + 1);
            setIsTransitioning(true);
        }, 2000);

        return () => clearInterval(interval);
    }, [relatedProducts.length, itemsPerView]);

    // Carousel Infinite Loop Boundary Handling
    useEffect(() => {
        if (relatedProducts.length === 0) return;

        const total = relatedProducts.length;

        if (relatedStart >= total * 2) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setRelatedStart(total);
            }, 700);
            return () => clearTimeout(timeout);
        }

        if (relatedStart < total) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setRelatedStart(total * 2 - 1);
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [relatedStart, relatedProducts.length]);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert("Please select a size and color.");
            return;
        }

        addToCart(product, selectedSize, selectedColor, quantity);
        setAdded(true);
    };

    const finalPrice = getItemFinalPrice({
        price: product.price,
        discount: product.discount || 0,
        quantity: 1,
    });

    return (
        <main className="min-h-screen bg-[#faf9f6] text-neutral-900">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    {/* Product Image */}
                    <div className="relative bg-gray-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-[500px] w-full object-cover md:h-[650px]"
                        />

                        {product.isNew && (
                            <span className="absolute right-4 top-4 bg-white px-4 py-2 text-[10px] tracking-[0.2em] shadow-sm">
                                NEW
                            </span>
                        )}

                        {product.discount > 0 && (
                            <span className="absolute left-4 top-4 rounded-md bg-[#ff2a5f] px-3 py-1.5 text-xs font-bold tracking-tight text-white shadow-sm">
                                -{product.discount}%
                            </span>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-col justify-center">
                        <p className="mb-4 text-sm tracking-[0.3em] text-gray-500">
                            {product.category}
                        </p>

                        <h1 className="mb-4 text-3xl font-light tracking-tight md:text-4xl">
                            {product.name}
                        </h1>

                        {/* Product Price (Centralized) */}
                        <div className="mb-6 flex items-center gap-3">
                            {product.discount > 0 ? (
                                <>
                                    <span className="text-xl font-medium">
                                        ৳{finalPrice.toLocaleString("en-BD")}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                        ৳{product.price.toLocaleString("en-BD")}
                                    </span>
                                    <span className="rounded-md bg-[#ff2a5f] px-2 py-0.5 text-xs font-bold text-white">
                                        -{product.discount}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-medium">
                                    ৳{product.price.toLocaleString("en-BD")}
                                </span>
                            )}
                        </div>

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
                                        type="button"
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setAdded(false);
                                        }}
                                        className={`border px-5 py-2 text-sm transition ${selectedColor === color
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
                                        type="button"
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setAdded(false);
                                        }}
                                        className={`h-12 w-12 border text-sm font-medium transition ${selectedSize === size
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
                            <div className="flex w-fit items-center border border-gray-300 bg-white">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-lg hover:bg-neutral-100"
                                >
                                    −
                                </button>
                                <span className="px-4 text-sm font-medium">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 text-lg hover:bg-neutral-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="w-full bg-black py-4 text-sm tracking-widest text-white transition hover:bg-neutral-800"
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

            {/* You Might Also Like (Carousel with Centralized ProductCard) */}
            {relatedProducts.length > 0 && (
                <section className="mx-auto mt-24 max-w-7xl border-t border-gray-200 px-6 pt-16 pb-24">
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

                    <div className="relative overflow-hidden">
                        {relatedProducts.length > 4 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsTransitioning(true);
                                    setRelatedStart((prev) => prev - 1);
                                }}
                                className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/80 text-xl shadow-sm backdrop-blur-sm transition hover:bg-black hover:text-white"
                                aria-label="Previous products"
                            >
                                ←
                            </button>
                        )}

                        <div
                            className={`-mx-2 flex ${isTransitioning
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
                                    <ProductCard product={item} />
                                </div>
                            ))}
                        </div>

                        {relatedProducts.length > 4 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsTransitioning(true);
                                    setRelatedStart((prev) => prev + 1);
                                }}
                                className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/80 text-xl shadow-sm backdrop-blur-sm transition hover:bg-black hover:text-white"
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