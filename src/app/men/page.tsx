"use client";

import Link from "next/link";
import { products } from "../../data/products";
import Navbar from "../../components/navbar";

const menProducts = products.filter(
    (product) => product.category === "MEN"
);

export default function MenPage() {
    return (
        <main className="min-h-screen bg-white text-black">
            {/* Navbar */}
            <Navbar />

            {/* Header */}
            <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">
                <p className="mb-3 text-xs tracking-[0.25em] text-black/50">
                    THREAD&FORM
                </p>

                <h1 className="text-4xl font-light tracking-tight md:text-6xl">
                    Men
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">
                    Explore our collection of timeless menswear designed with a clean,
                    modern aesthetic.
                </p>
            </section>

            {/* Products */}
            <section className="mx-auto max-w-7xl px-6 pb-24">
                <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-5">
                    <p className="text-sm text-black/60">
                    {menProducts.length} Products
                    </p>

                    <div className="flex gap-5 text-sm">
                        <Link href="/women" className="text-sm underline underline-offset-4 hover:opacity-60">Women</Link>
                        <Link href="/shop" className="text-sm underline underline-offset-4 hover:opacity-60">All</Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {menProducts.map((product) => (
                        <div key={product.id} className="group">
                            {/* Product Image */}
                            <Link href={`/product/${product.id}`}>
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </Link>

                            {/* Product Info */}
                            <div className="pt-4">
                                <p className="mb-1 text-[10px] tracking-[0.2em] text-black/40">
                                    {product.category}
                                </p>

                                <Link href={`/product/${product.id}`}>
                                    <h2 className="text-sm font-medium hover:opacity-60">
                                        {product.name}
                                    </h2>
                                </Link>

                                <p className="mt-2 text-sm">
                                    ৳{product.price.toLocaleString()}
                                </p>

                                <Link
                                    href={`/product/${product.id}`}
                                    className="mt-4 inline-block text-xs font-medium tracking-[0.15em] underline underline-offset-4 hover:opacity-60"
                                >
                                    VIEW PRODUCT
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            
        </main>
    );
}