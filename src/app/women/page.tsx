"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "../../data/products";
import ProductCard from "../../components/product-card";
import { searchProducts } from "../../lib/search";
import SearchBar from "../../components/shop/search-bar";

export default function WomenPage() {
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get("category");

    const [searchQuery, setSearchQuery] = useState("");

    // Only Women products
    const allWomenProducts = products.filter(
        (product) => product.gender === "WOMEN"
    );

    // Search only within Women products
    const searchedWomenProducts = searchProducts(
        allWomenProducts,
        searchQuery
    );

    // Apply category filter after search
    const womenProducts = (
        searchQuery.trim()
            ? searchedWomenProducts
            : allWomenProducts
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
                    Women
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">
                    Discover our curated womenswear collection, created for effortless
                    and contemporary style.
                </p>

            </section>

            {/* Products */}
            <section className="mx-auto max-w-7xl px-6 pb-24">

                <div className="mb-8 border-b border-black/10 pb-5">

                    {/* Top Bar */}
                    <div className="flex items-center justify-between">

                        <p className="text-sm text-black/60">
                            {womenProducts.length} Products
                        </p>

                        <div className="flex items-center gap-5 text-sm">

                            <Link
                                href="/men"
                                className="underline underline-offset-4 hover:opacity-60"
                            >
                                Men
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
                            placeholder="Search women's products..."
                        />
                    </div>

                </div>

                {/* Product Grid */}
                {womenProducts.length === 0 ? (

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

                        {womenProducts.map((product) => (
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