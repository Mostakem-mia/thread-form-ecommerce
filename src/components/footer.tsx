"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function Footer() {
    const { isAuthenticated } = useAuth();
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim()) return;

        // Newsletter subscription log
        console.log("Subscribed:", email);
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 4000);
    };

    return (
        <footer className="bg-black px-6 py-14 text-white">
            <div className="mx-auto max-w-7xl">
                {/* Main Footer Grid */}
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* 1. Brand Section */}
                    <div className="space-y-3">
                        <Link href="/" className="inline-block text-xl font-bold tracking-[0.2em]">
                            THREAD<span className="font-light text-neutral-400">&</span>FORM
                        </Link>
                        <p className="max-w-xs text-xs leading-5 text-neutral-400">
                            Timeless style. Everyday comfort. High quality modern layers made for everyday living.
                        </p>
                    </div>

                    {/* 2. HELP / POLICIES */}
                    <div className="space-y-3 text-xs text-neutral-300">
                        <h3 className="font-semibold tracking-wider text-white uppercase">
                            HELP
                        </h3>
                        <Link href="/terms" className="block transition hover:text-white">
                            Terms & Conditions
                        </Link>
                        <Link href="/privacy" className="block transition hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link href="/shipping" className="block transition hover:text-white">
                            Shipping & Returns
                        </Link>
                        <Link href="/help-center" className="block transition hover:text-white">
                            Help Center
                        </Link>
                    </div>

                    {/* 3. FOLLOW US (Social Media) */}
                    <div className="space-y-3 text-xs text-neutral-300">
                        <h3 className="font-semibold tracking-wider text-white uppercase">
                            FOLLOW US
                        </h3>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition hover:text-white"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition hover:text-white"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition hover:text-white"
                        >
                            TikTok
                        </a>
                    </div>

                    {/* 4. MY ACCOUNT (Dynamic Auth Links) */}
                    <div className="space-y-3 text-xs text-neutral-300">
                        <h3 className="font-semibold tracking-wider text-white uppercase">
                            MY ACCOUNT
                        </h3>
                        <Link
                            href={isAuthenticated ? "/profile" : "/login"}
                            className="block transition hover:text-white"
                        >
                            {isAuthenticated ? "My Profile" : "Sign In / Register"}
                        </Link>
                        <Link href="/my-orders" className="block transition hover:text-white">
                            My Orders
                        </Link>
                        <Link href="/wishlist" className="block transition hover:text-white">
                            My Wishlist
                        </Link>
                        <Link href="/cart" className="block transition hover:text-white">
                            Shopping Bag
                        </Link>
                    </div>

                    {/* 5. ADDRESS & NEWSLETTER */}
                    <div className="space-y-6 text-xs text-neutral-300">
                        {/* Address */}
                        <div className="space-y-2">
                            <h3 className="font-semibold tracking-wider text-white uppercase">
                                ADDRESS
                            </h3>
                            <p className="leading-5 text-neutral-400">
                                House 12, Road 5,
                                <br />
                                Dhanmondi, Dhaka 1205,
                                <br />
                                Bangladesh
                            </p>
                            <div className="pt-1 space-y-1">
                                <a
                                    href="mailto:hello@threadandform.com"
                                    className="block text-neutral-300 transition hover:text-white"
                                >
                                    hello@threadandform.com
                                </a>
                                <a
                                    href="tel:+8801700000000"
                                    className="block text-neutral-300 transition hover:text-white"
                                >
                                    +880 1700-000000
                                </a>
                            </div>
                        </div>

                        {/* Newsletter Input */}
                        <div className="space-y-2">
                            <h3 className="font-semibold tracking-wider text-white uppercase">
                                NEWSLETTER
                            </h3>
                            <form onSubmit={handleSubscribe} className="flex">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-white"
                                />
                                <button
                                    type="submit"
                                    className="bg-white px-3 py-2 text-xs font-semibold uppercase text-black hover:bg-neutral-200 transition"
                                >
                                    →
                                </button>
                            </form>
                            {subscribed && (
                                <p className="text-[10px] text-emerald-400">
                                    Thank you for subscribing!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Payment Badges */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-6 sm:flex-row">
                    <p className="text-xs text-neutral-500">
                        © 2026 THREAD & FORM. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium tracking-wider uppercase text-neutral-400">
                        <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-1">
                            bKash
                        </span>
                        <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-1">
                            Nagad
                        </span>
                        <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-1">
                            Visa
                        </span>
                        <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-1">
                            Mastercard
                        </span>
                        <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-1">
                            Cash on Delivery
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}