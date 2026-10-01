"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const [hash, setHash] = useState("");
    const [cartCount, setCartCount] = useState(0);

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
                        <button aria-label="Search">⌕</button>

                        <button aria-label="Account">♙</button>

                        <Link href="/cart">
                            Cart ({cartCount})
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
}