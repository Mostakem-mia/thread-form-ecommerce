"use client";

import Link from "next/link";
import { products } from "../../data/products";
import Navbar from "../../components/navbar";
import ProductCard from "../../components/product-card";

export default function ShopPage() {
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
                    Shop All
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">
                    Explore our complete collection of timeless essentials,
                    designed for everyday comfort and modern style.
                </p>

            </section>

            {/* Products */}
            <section className="mx-auto max-w-7xl px-6 pb-24">

                <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-5">

                    <p className="text-sm text-black/60">
                        {products.length} Products
                    </p>

                    <div className="flex gap-5 text-sm">
                        <Link
                            href="/men"
                            className="underline underline-offset-4 hover:opacity-60"
                        >
                            Men
                        </Link>

                        <Link
                            href="/women"
                            className="underline underline-offset-4 hover:opacity-60"
                        >
                            Women
                        </Link>
                    </div>

                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}