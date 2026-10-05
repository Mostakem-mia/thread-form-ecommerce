"use client";


import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "../../data/products";
import Navbar from "../../components/navbar";
import ProductCard from "../../components/product-card";




export default function MenPage() {
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get("category");

    const menProducts = products.filter((product) => {
        if (product.gender !== "MEN") return false;

        if (!selectedCategory) return true;

        return product.subcategory === selectedCategory;
    });

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

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                    {menProducts.map((product) => (
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