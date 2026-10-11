"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "../../data/products";
import ProductCard from "../../components/product-card";
import { searchProducts } from "../../lib/search";
import SearchBar from "../../components/shop/search-bar";

export default function MenPage() {
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get("category");

    const [searchQuery, setSearchQuery] = useState("");

    // Only Men products
    const allMenProducts = products.filter(
        (product) => product.gender === "MEN"
    );

    // Search only within Men products
    const searchedMenProducts = searchProducts(
        allMenProducts,
        searchQuery
    );

    // Apply category filter after search
    const menProducts = (
        searchQuery.trim()
            ? searchedMenProducts
            : allMenProducts
    ).filter((product) => {
        if (!selectedCategory) return true;

        return product.subcategory === selectedCategory;
    });

    return (
        <main className="min-h-screen bg-white text-black">

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

                <div className="mb-8 border-b border-black/10 pb-5">

                    {/* Top Bar */}
                    <div className="flex items-center justify-between">

                        <p className="text-sm text-black/60">
                            {menProducts.length} Products
                        </p>

                        <div className="flex items-center gap-5 text-sm">

                            <Link
                                href="/women"
                                className="underline underline-offset-4 hover:opacity-60"
                            >
                                Women
                            </Link>

                            <Link
                                href="/shop"
                                className="underline underline-offset-4 hover:opacity-60"
                            >
                                All
                            </Link>

                        </div>

                    </div>

                    {/* Search */}
                    <div className="mt-6">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search men's products..."
                        />
                    </div>

                </div>

                {/* Product Grid */}
                {menProducts.length === 0 ? (

                    <div className="py-20 text-center">

                        <h2 className="text-xl font-medium">
                            No products found
                        </h2>

                        <p className="mt-2 text-sm text-black/50">
                            Try searching with a different keyword.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">

                        {menProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}