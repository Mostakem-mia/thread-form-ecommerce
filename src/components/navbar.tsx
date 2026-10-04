"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { products } from "../data/products";
import { menCategories, womenCategories } from "../data/categories";


export default function Navbar() {
    const pathname = usePathname();
    const [hash, setHash] = useState("");
    const [cartCount, setCartCount] = useState<number | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [menMenuOpen, setMenMenuOpen] = useState(false);
    const [womenMenuOpen, setWomenMenuOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);


    const menNewArrivals = products.filter(
        (product) =>
            product.gender === "MEN" &&
            product.featured
    );

    const womenNewArrivals = products.filter(
        (product) =>
            product.gender === "WOMEN" &&
            product.featured
    );

    const searchResults = products.filter((product) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return [];
        return (
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    });



    useEffect(() => {
        const updateHash = () => {
            setHash(window.location.hash);
        };

        updateHash();

        window.addEventListener("hashchange", updateHash);

        return () => {
            window.removeEventListener("hashchange", updateHash);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setSearchOpen(false);
                setSearchQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem("cartItems");

            if (savedCart) {
                const cart = JSON.parse(savedCart);

                const count = cart.reduce(
                    (total: number, item: { quantity: number }) =>
                        total + item.quantity,
                    0
                );

                setCartCount(count);
            } else {
                setCartCount(0);
            }
        };

        updateCartCount();

        window.addEventListener("storage", updateCartCount);
        window.addEventListener("cartUpdated", updateCartCount);

        return () => {
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-black px-4 py-2 text-center text-xs tracking-widest text-white">
                FREE DELIVERY ON ORDERS OVER ৳5,000
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-[0.2em]"
                    >
                        THREAD<span className="font-light">&</span>FORM
                    </Link>

                    {/* Navigation */}
                    <div className="hidden items-center gap-8 text-sm md:flex">
                        <a
                            href="/"
                            className={pathname === "/" && hash === "" ? "font-medium underline underline-offset-4" : "hover:text-neutral-500"}>Home
                        </a>

                        <Link
                            href="/shop"
                            className={
                                pathname === "/shop"
                                    ? "font-medium underline underline-offset-4"
                                    : "hover:text-neutral-500"
                            }
                        >
                            Shop
                        </Link>

                        <div className="relative" onMouseEnter={() => setMenMenuOpen(true)} onMouseLeave={() => setMenMenuOpen(false)}>
                            <Link
                                href="/men"
                                className={
                                    pathname === "/men"
                                        ? "font-medium underline underline-offset-4"
                                        : "hover:text-neutral-500"
                                }
                            >
                                Men
                            </Link>

                            <div
                                className={`absolute left-1/2 top-full z-50 w-[1050px] -translate-x-1/2 border-t border-neutral-200 bg-white shadow-lg transition-all duration-200 ${menMenuOpen
                                    ? "visible opacity-100"
                                    : "invisible opacity-0"
                                    }`} >
                                <div className="grid grid-cols-4 gap-0 px-8 py-7">

                                    {/* TOPWEAR */}
                                    <div>
                                        <p className="mb-4 text-xs font-medium text-red-500 tracking-[0.2em] text-black/80">
                                            TOPWEAR
                                        </p>

                                        <div className="space-y-3">
                                            {menCategories.TOPWEAR.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/men?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setMenMenuOpen(false)}
                                                    className="block text-sm hover:text-black/50">
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* BOTTOMWEAR */}
                                    <div>
                                        <p className="mb-4 text-xs font-medium text-red-500 tracking-[0.2em] text-black/80">
                                            BOTTOMWEAR
                                        </p>

                                        <div className="space-y-3">
                                            {menCategories.BOTTOMWEAR.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/men?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setMenMenuOpen(false)}
                                                    className="block text-sm hover:text-black/50"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ACCESSORIES */}
                                    <div>
                                        <p className="mb-4 text-xs font-medium text-red-500 tracking-[0.2em] text-black/80">
                                            ACCESSORIES
                                        </p>

                                        <div className="space-y-3">
                                            {menCategories.ACCESSORIES.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/men?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setMenMenuOpen(false)}
                                                    className="block text-sm hover:text-black/50"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* NEW ARRIVALS */}
                                    <div className="border-l border-neutral-200 pl-7">
                                        <p className="mb-4 text-xs font-medium text-red-500 tracking-[0.2em] text-black/80">
                                            NEW ARRIVALS
                                        </p>

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                            {menNewArrivals.slice(0, 4).map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.id}`}
                                                    onClick={() => setMenMenuOpen(false)}
                                                    className="group/product">
                                                    <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover transition duration-500 group-hover/product:scale-105"
                                                        />
                                                    </div>

                                                    <p className="mt-2 truncate text-xs text-black/80">
                                                        {product.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-black/50">
                                                        ৳{product.price.toLocaleString()}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-t border-neutral-200 px-8 py-5">
                                        <Link
                                            href="/men"
                                            onClick={() => setMenMenuOpen(false)}
                                            className="text-xs font-medium text-red-500 hover:opacity-60">
                                            View All Men →
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div
                            className="relative"
                            onMouseEnter={() => setWomenMenuOpen(true)}
                            onMouseLeave={() => setWomenMenuOpen(false)}
                        >
                            <Link
                                href="/women"
                                className={
                                    pathname === "/women"
                                        ? "font-medium underline underline-offset-4"
                                        : "hover:text-neutral-500"
                                }
                            >
                                Women
                            </Link>

                            {/* Women Mega Menu */}
                            <div
                                className={`absolute left-1/2 top-full z-50 w-[1050px] -translate-x-1/2 border-t border-neutral-200 bg-white shadow-lg transition-all duration-200 ${womenMenuOpen
                                    ? "visible opacity-100"
                                    : "invisible opacity-0"
                                    }`}
                            >
                                {/* Main Content */}
                                <div className="grid grid-cols-[190px_1fr] gap-0 px-8 py-7">

                                    {/* WESTERN & ETHNIC */}
                                    <div>
                                        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-red-500">
                                            WESTERN & ETHNIC
                                        </p>

                                        <div className="space-y-3">
                                            {womenCategories["WESTERN & ETHNIC"].map(
                                                (category) => (
                                                    <Link
                                                        key={category}
                                                        href={`/women?category=${encodeURIComponent(category)}`}
                                                        onClick={() =>
                                                            setWomenMenuOpen(false)
                                                        }
                                                        className="block text-sm hover:text-black/50"
                                                    >
                                                        {category}
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* NEW ARRIVALS */}
                                    <div className="border-l border-neutral-200 pl-7">
                                        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-red-500">
                                            NEW ARRIVALS
                                        </p>

                                        <div className="grid grid-cols-3 gap-x-5 gap-y-5">
                                            {womenNewArrivals.slice(0, 6).map(
                                                (product) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/product/${product.id}`}
                                                        onClick={() =>
                                                            setWomenMenuOpen(false)
                                                        }
                                                        className="group/product"
                                                    >
                                                        <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover transition duration-500 group-hover/product:scale-105"
                                                            />
                                                        </div>

                                                        <p className="mt-2 truncate text-xs text-black/80">
                                                            {product.name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-black/50">
                                                            ৳{product.price.toLocaleString()}
                                                        </p>
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* View All Women */}
                                <div className="border-t border-neutral-200 px-8 py-5">
                                    <Link
                                        href="/women"
                                        onClick={() => setWomenMenuOpen(false)}
                                        className="text-xs font-medium text-red-500 hover:opacity-60"
                                    >
                                        View All Women →
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <a
                            href="/#featured"
                            className={
                                pathname === "/" && hash === "#featured"
                                    ? "font-medium underline underline-offset-4"
                                    : "hover:text-neutral-500"
                            }
                        >
                            New Arrivals
                        </a>


                        <a
                            href="/#about"
                            className={
                                pathname === "/" && hash === "#about"
                                    ? "font-medium underline underline-offset-4"
                                    : "hover:text-neutral-500"
                            }
                        >
                            About
                        </a>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-5 text-sm">
                        {/* Search */}
                        <div ref={searchRef} className="relative">
                            <button
                                aria-label="Search"
                                onClick={() => {
                                    setSearchOpen((prev) => !prev);
                                    setSearchQuery("");
                                }}
                            >
                                ⌕
                            </button>

                            {searchOpen && (
                                <div className="absolute right-0 top-10 z-50 w-80 border border-neutral-200 bg-white p-4 shadow-lg">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full border-b border-neutral-300 pb-2 text-sm outline-none"
                                    />

                                    {searchQuery.trim() && (
                                        <div className="mt-3 max-h-80 overflow-y-auto">
                                            {searchResults.length > 0 ? (
                                                searchResults.map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/product/${product.id}`}
                                                        onClick={() => {
                                                            setSearchOpen(false);
                                                            setSearchQuery("");
                                                        }}
                                                        className="flex items-center justify-between gap-4 border-b border-neutral-100 py-3 hover:bg-neutral-50"
                                                    >
                                                        {/* Product Info */}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm">
                                                                {product.name}
                                                            </p>

                                                            <p className="mt-1 text-xs text-neutral-500">
                                                                {product.category} · ৳
                                                                {product.price.toLocaleString()}
                                                            </p>
                                                        </div>

                                                        {/* Product Image */}
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-16 w-14 shrink-0 object-cover"
                                                        />
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="py-4 text-sm text-neutral-500">
                                                    No products found.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Account */}
                        <button aria-label="Account">♙</button>

                        {/* Cart */}
                        <Link href="/cart">
                            Bag {cartCount !== null ? `(${cartCount})` : ""}
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
}