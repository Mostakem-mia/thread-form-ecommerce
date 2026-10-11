"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { products } from "../../data/products";
import ProductCard from "../../components/product-card";
import { searchProducts } from "../../lib/search";
import SearchBar from "../../components/shop/search-bar";
import { getItemFinalPrice } from "../../lib/pricing";

type SortOption = "relevance" | "price-low-high" | "price-high-low" | "name-a-z" | "newest" | "discount";

const getFinalPrice = (price: number, discount: number) =>
    getItemFinalPrice({ price, discount, quantity: 1 });

const controlClass = "mt-2 w-full rounded-sm border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";

export default function ShopPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [gender, setGender] = useState("ALL");
    const [category, setCategory] = useState("ALL");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("relevance");
    const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);

    const categoryOptions = useMemo(
        () => Array.from(new Set(products.map((product) => product.subcategory))).sort(),
        []
    );

    const displayedProducts = useMemo(() => {
        let result = searchQuery.trim() ? searchProducts(products, searchQuery) : [...products];

        if (gender !== "ALL") result = result.filter((product) => product.gender === gender);
        if (category !== "ALL") {
            result = result.filter((product) => product.subcategory.toLowerCase() === category.toLowerCase());
        }

        const minimum = minPrice.trim() === "" ? null : Number(minPrice);
        const maximum = maxPrice.trim() === "" ? null : Number(maxPrice);
        if (minimum !== null && Number.isFinite(minimum) && minimum >= 0) {
            result = result.filter((product) => getFinalPrice(product.price, product.discount) >= minimum);
        }
        if (maximum !== null && Number.isFinite(maximum) && maximum >= 0) {
            result = result.filter((product) => getFinalPrice(product.price, product.discount) <= maximum);
        }
        if (showDiscountedOnly) result = result.filter((product) => product.discount > 0);

        switch (sortBy) {
            case "price-low-high": result.sort((a, b) => getFinalPrice(a.price, a.discount) - getFinalPrice(b.price, b.discount)); break;
            case "price-high-low": result.sort((a, b) => getFinalPrice(b.price, b.discount) - getFinalPrice(a.price, a.discount)); break;
            case "name-a-z": result.sort((a, b) => a.name.localeCompare(b.name)); break;
            case "newest": result.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
            case "discount": result.sort((a, b) => b.discount - a.discount); break;
            default: break;
        }
        return result;
    }, [searchQuery, gender, category, minPrice, maxPrice, sortBy, showDiscountedOnly]);

    const resetFilters = () => {
        setSearchQuery(""); setGender("ALL"); setCategory("ALL"); setMinPrice(""); setMaxPrice("");
        setSortBy("relevance"); setShowDiscountedOnly(false);
    };

    const invalidPriceRange = minPrice.trim() !== "" && maxPrice.trim() !== "" &&
        Number.isFinite(Number(minPrice)) && Number.isFinite(Number(maxPrice)) && Number(minPrice) > Number(maxPrice);

    const hasActiveFilters = Boolean(searchQuery || gender !== "ALL" || category !== "ALL" || minPrice || maxPrice || showDiscountedOnly || sortBy !== "relevance");

    return (
        <main className="min-h-screen bg-white text-neutral-950">
            <section className="border-b border-neutral-200 bg-[#f7f6f2]">
                <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
                    <div className="mb-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500">
                        <Link href="/" className="transition hover:text-black">Home</Link><span>/</span><span className="text-neutral-900">Shop all</span>
                    </div>
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="max-w-2xl">
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">THREAD & FORM · THE COLLECTION</p>
                            <h1 className="text-4xl font-light tracking-[-0.045em] sm:text-5xl lg:text-7xl">Find your everyday.</h1>
                            <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">Thoughtful essentials, easy layers, and timeless pieces made to fit your everyday style.</p>
                        </div>
                        <div className="flex gap-5 border-t border-neutral-300 pt-4 text-xs uppercase tracking-[0.14em] md:border-l md:border-t-0 md:pl-6 md:pt-0">
                            <Link href="/men" className="transition hover:text-neutral-500">Shop men ↗</Link>
                            <Link href="/women" className="transition hover:text-neutral-500">Shop women ↗</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                    <aside className="h-fit lg:sticky lg:top-6">
                        <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">Filter & refine</h2>
                            {hasActiveFilters && <button onClick={resetFilters} className="text-[11px] text-neutral-500 underline underline-offset-4 hover:text-black">Reset</button>}
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="department" className="text-xs font-medium text-neutral-800">Department</label>
                                <select id="department" value={gender} onChange={(event) => setGender(event.target.value)} className={controlClass}>
                                    <option value="ALL">All departments</option>
                                    <option value="MEN">Men</option>
                                    <option value="WOMEN">Women</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="category" className="text-xs font-medium text-neutral-800">Category</label>
                                <select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className={controlClass}>
                                    <option value="ALL">All categories</option>
                                    {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-800">Price range <span className="font-normal text-neutral-500">(৳)</span></p>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <label className="sr-only" htmlFor="min-price">Minimum price</label>
                                    <input id="min-price" type="number" min="0" inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min" className="w-full min-w-0 rounded-sm border border-neutral-200 px-3 py-3 text-sm outline-none transition focus:border-neutral-900" />
                                    <label className="sr-only" htmlFor="max-price">Maximum price</label>
                                    <input id="max-price" type="number" min="0" inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max" className="w-full min-w-0 rounded-sm border border-neutral-200 px-3 py-3 text-sm outline-none transition focus:border-neutral-900" />
                                </div>
                                {invalidPriceRange && <p role="alert" className="mt-2 text-xs text-red-600">Minimum must not exceed maximum.</p>}
                            </div>
                            <div className="border-t border-neutral-200 pt-5">
                                <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-700">
                                    <input type="checkbox" checked={showDiscountedOnly} onChange={(event) => setShowDiscountedOnly(event.target.checked)} className="h-4 w-4 accent-neutral-950" />
                                    <span>Sale items only</span>
                                </label>
                            </div>
                            <button type="button" onClick={resetFilters} className="w-full border border-neutral-900 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:bg-neutral-900 hover:text-white">Clear all filters</button>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium" aria-live="polite">{displayedProducts.length} {displayedProducts.length === 1 ? "piece" : "pieces"}</p>
                                <p className="mt-1 text-xs text-neutral-500">Considered essentials for your wardrobe</p>
                            </div>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                                <div className="w-full sm:w-[290px]"><SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search the collection" /></div>
                                <label className="flex items-center gap-3 text-xs text-neutral-500 sm:whitespace-nowrap">
                                    <span className="uppercase tracking-[0.12em]">Sort by</span>
                                    <select aria-label="Sort products" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="min-w-0 flex-1 border-0 bg-transparent py-2 text-xs text-neutral-900 outline-none focus:ring-0 sm:flex-none">
                                        <option value="relevance">Featured</option><option value="price-low-high">Price: low to high</option><option value="price-high-low">Price: high to low</option><option value="name-a-z">Name: A–Z</option><option value="newest">New arrivals</option><option value="discount">Biggest discount</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        {hasActiveFilters && !invalidPriceRange && (
                            <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-neutral-600">
                                <span className="mr-1 uppercase tracking-[0.12em] text-neutral-400">Applied</span>
                                {searchQuery && <button onClick={() => setSearchQuery("")} className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900">Search: {searchQuery} ×</button>}
                                {gender !== "ALL" && <button onClick={() => setGender("ALL")} className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900">{gender === "MEN" ? "Men" : "Women"} ×</button>}
                                {category !== "ALL" && <button onClick={() => setCategory("ALL")} className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900">{category} ×</button>}
                                {(minPrice || maxPrice) && <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900">৳{minPrice || "0"}–৳{maxPrice || "∞"} ×</button>}
                                {showDiscountedOnly && <button onClick={() => setShowDiscountedOnly(false)} className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900">Sale items ×</button>}
                            </div>
                        )}

                        {invalidPriceRange ? (
                            <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-neutral-300 px-6 text-center">
                                <h2 className="text-lg font-medium">Check your price range</h2><p className="mt-2 text-sm text-neutral-500">Minimum price should be less than or equal to maximum price.</p>
                            </div>
                        ) : displayedProducts.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-neutral-300 px-6 text-center">
                                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-neutral-400">No matches this time</p><h2 className="text-xl font-light">Nothing found.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">Try another search or remove a filter to discover more pieces.</p>
                                <button type="button" onClick={resetFilters} className="mt-6 bg-neutral-950 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-700">Clear filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 sm:gap-y-12 xl:grid-cols-3 2xl:grid-cols-4">
                                {displayedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
