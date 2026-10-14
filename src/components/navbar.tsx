"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { searchProducts } from "../lib/search";
import { useCart } from "../context/cart-context";
import { useWishlist } from "../context/wishlist-context";
import { useAuth } from "../context/auth-context";

export default function Navbar() {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { wishlist, isWishlistLoaded } = useWishlist();
    const { isAuthenticated } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [menMenuOpen, setMenMenuOpen] = useState(false);
    const [womenMenuOpen, setWomenMenuOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    const menNewArrivals = products.filter(
        (product) => product.gender === "MEN" && product.isNew
    );

    const womenNewArrivals = products.filter(
        (product) => product.gender === "WOMEN" && product.isNew
    );

    const searchResults = searchProducts(products, searchQuery);

    // Close search dropdown on clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setSearchFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Top Announcement Bar */}
            <div className="bg-black px-4 py-2 text-center text-xs tracking-widest text-white">
                FREE DELIVERY ON ORDERS OVER ৳5,000
            </div>

            {/* Main Navbar */}
            <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
                    {/* 1. Brand Logo (Click korle Home-e jabe) */}
                    <Link
                        href="/"
                        className="flex items-center text-xl font-bold tracking-[0.2em] text-neutral-900"
                    >
                        THREAD<span className="font-light text-neutral-500">&</span>FORM
                    </Link>

                    {/* 2. Primary Navigation Links (Shop, Men, Women with Mega Menus) */}
                    <div className="hidden items-center gap-7 text-xs font-semibold tracking-wider text-neutral-800 md:flex">
                        <Link
                            href="/shop"
                            className={`transition hover:text-black ${pathname === "/shop"
                                    ? "border-b-2 border-black pb-1 text-black"
                                    : ""
                                }`}
                        >
                            SHOP
                        </Link>

                        {/* Men Menu with Mega Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => setMenMenuOpen(true)}
                            onMouseLeave={() => setMenMenuOpen(false)}
                        >
                            <Link
                                href="/men"
                                className={`transition hover:text-black ${pathname === "/men"
                                        ? "border-b-2 border-black pb-1 text-black"
                                        : ""
                                    }`}
                            >
                                MEN
                            </Link>

                            <div
                                className={`absolute left-0 top-full z-50 w-[850px] border-t border-neutral-200 bg-white shadow-xl transition-all duration-200 ${menMenuOpen
                                        ? "visible opacity-100"
                                        : "invisible opacity-0"
                                    }`}
                            >
                                <div className="grid grid-cols-4 gap-6 px-8 py-7">
                                    {/* TOPWEAR */}
                                    <div>
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            TOPWEAR
                                        </p>
                                        <div className="space-y-2.5">
                                            {categories.MEN.TOPWEAR.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/men?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setMenMenuOpen(false)}
                                                    className="block text-xs font-normal text-neutral-600 transition hover:text-black"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* BOTTOMWEAR */}
                                    <div>
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            BOTTOMWEAR
                                        </p>
                                        <div className="space-y-2.5">
                                            {categories.MEN.BOTTOMWEAR.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/men?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setMenMenuOpen(false)}
                                                    className="block text-xs font-normal text-neutral-600 transition hover:text-black"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ACCESSORIES */}
                                    <div>
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            ACCESSORIES
                                        </p>
                                        <div className="space-y-2.5">
                                            {categories.MEN.ACCESSORIES.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/men?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setMenMenuOpen(false)}
                                                    className="block text-xs font-normal text-neutral-600 transition hover:text-black"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* NEW ARRIVALS PREVIEW */}
                                    <div className="border-l border-neutral-100 pl-6">
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            NEW ARRIVALS
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {menNewArrivals.slice(0, 2).map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.id}`}
                                                    onClick={() => setMenMenuOpen(false)}
                                                    className="group block"
                                                >
                                                    <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <p className="mt-1.5 truncate text-[10px] font-medium text-neutral-800">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500">
                                                        ৳{product.price.toLocaleString("en-BD")}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-neutral-100 bg-neutral-50 px-8 py-3">
                                    <Link
                                        href="/men"
                                        onClick={() => setMenMenuOpen(false)}
                                        className="text-xs font-semibold text-neutral-900 hover:underline"
                                    >
                                        View All Men's Collection →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Women Menu with Mega Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => setWomenMenuOpen(true)}
                            onMouseLeave={() => setWomenMenuOpen(false)}
                        >
                            <Link
                                href="/women"
                                className={`transition hover:text-black ${pathname === "/women"
                                        ? "border-b-2 border-black pb-1 text-black"
                                        : ""
                                    }`}
                            >
                                WOMEN
                            </Link>

                            <div
                                className={`absolute left-0 top-full z-50 w-[920px] border-t border-neutral-200 bg-white shadow-xl transition-all duration-200 ${womenMenuOpen
                                        ? "visible opacity-100"
                                        : "invisible opacity-0"
                                    }`}
                            >
                                <div className="grid grid-cols-5 gap-6 px-8 py-7">
                                    {/* TOPWEAR */}
                                    <div>
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            TOPWEAR
                                        </p>
                                        <div className="space-y-2.5">
                                            {categories.WOMEN.TOPWEAR.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/women?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setWomenMenuOpen(false)}
                                                    className="block text-xs font-normal text-neutral-600 transition hover:text-black"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* BOTTOMWEAR */}
                                    <div>
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            BOTTOMWEAR
                                        </p>
                                        <div className="space-y-2.5">
                                            {categories.WOMEN.BOTTOMWEAR.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/women?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setWomenMenuOpen(false)}
                                                    className="block text-xs font-normal text-neutral-600 transition hover:text-black"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ETHNIC */}
                                    <div>
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            ETHNIC
                                        </p>
                                        <div className="space-y-2.5">
                                            {categories.WOMEN.ETHNIC.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/women?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setWomenMenuOpen(false)}
                                                    className="block text-xs font-normal text-neutral-600 transition hover:text-black"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SETS */}
                                    <div>
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            SETS
                                        </p>
                                        <div className="space-y-2.5">
                                            {categories.WOMEN.SETS.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/women?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setWomenMenuOpen(false)}
                                                    className="block text-xs font-normal text-neutral-600 transition hover:text-black"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* NEW ARRIVALS PREVIEW */}
                                    <div className="border-l border-neutral-100 pl-6">
                                        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-neutral-400">
                                            NEW ARRIVALS
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {womenNewArrivals.slice(0, 2).map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.id}`}
                                                    onClick={() => setWomenMenuOpen(false)}
                                                    className="group block"
                                                >
                                                    <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <p className="mt-1.5 truncate text-[10px] font-medium text-neutral-800">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500">
                                                        ৳{product.price.toLocaleString("en-BD")}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-neutral-100 bg-neutral-50 px-8 py-3">
                                    <Link
                                        href="/women"
                                        onClick={() => setWomenMenuOpen(false)}
                                        className="text-xs font-semibold text-neutral-900 hover:underline"
                                    >
                                        View All Women's Collection →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Center Search Input Bar (Fabrilife Style) */}
                    <div ref={searchRef} className="relative hidden max-w-sm flex-1 lg:block">
                        <div className="flex items-center rounded-md border border-neutral-300 bg-neutral-50/70 px-3.5 py-2 transition focus-within:border-black focus-within:bg-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="mr-2.5 h-4 w-4 text-neutral-400"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                                    clipRule="evenodd"
                                />
                            </svg>

                            <input
                                type="text"
                                value={searchQuery}
                                onFocus={() => setSearchFocused(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSearchFocused(true);
                                }}
                                placeholder="Search..."
                                className="w-full bg-transparent text-xs text-neutral-900 outline-none placeholder:text-neutral-400"
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="text-xs text-neutral-400 hover:text-black"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Live Search Results Dropdown */}
                        {searchFocused && searchQuery.trim() && (
                            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-md border border-neutral-200 bg-white p-3 shadow-2xl">
                                {searchResults.length > 0 ? (
                                    searchResults.slice(0, 6).map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            onClick={() => {
                                                setSearchFocused(false);
                                                setSearchQuery("");
                                            }}
                                            className="flex items-center gap-3 border-b border-neutral-100 p-2 transition last:border-0 hover:bg-neutral-50"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-12 w-10 shrink-0 object-cover rounded-xs"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium text-neutral-900">
                                                    {product.name}
                                                </p>
                                                <p className="text-[10px] text-neutral-500">
                                                    {product.category} · ৳{product.price.toLocaleString("en-BD")}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="p-3 text-center text-xs text-neutral-500">
                                        No products found for "{searchQuery}".
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 4. Action Items (Profile, Wishlist, Bag with Labels) */}
                    <div className="flex items-center gap-5 text-neutral-800">
                        {/* Profile / Login */}
                        <Link
                            href={isAuthenticated ? "/profile" : `/login?redirect=${encodeURIComponent(pathname || "/")}`}
                            className="flex flex-col items-center gap-0.5 hover:text-black transition group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.6"
                                stroke="currentColor"
                                className="h-5 w-5 transition group-hover:scale-105"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                />
                            </svg>
                            <span className="text-[10px] font-medium tracking-wide">
                                {isAuthenticated ? "Profile" : "Login"}
                            </span>
                        </Link>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="relative flex flex-col items-center gap-0.5 hover:text-black transition group"
                        >
                            <div className="relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.6"
                                    stroke="currentColor"
                                    className="h-5 w-5 transition group-hover:scale-105"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                </svg>
                                {isWishlistLoaded && wishlist.length > 0 && (
                                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-xs">
                                        {wishlist.length}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">
                                Wishlist
                            </span>
                        </Link>

                        {/* Bag / Cart */}
                        <Link
                            href="/cart"
                            className="relative flex flex-col items-center gap-0.5 hover:text-black transition group"
                        >
                            <div className="relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.6"
                                    stroke="currentColor"
                                    className="h-5 w-5 transition group-hover:scale-105"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white shadow-xs">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">
                                Bag
                            </span>
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
}