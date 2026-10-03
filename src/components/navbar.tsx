"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { products } from "../data/products";


export default function Navbar() {
    const pathname = usePathname();
    const [hash, setHash] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);

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

        return () => {
            window.removeEventListener("storage", updateCartCount);
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
                            Cart ({cartCount})
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
}