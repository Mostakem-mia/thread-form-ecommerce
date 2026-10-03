"use client";

import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) return;

        // Newsletter functionality will be connected later
        console.log("Subscribed:", email);

        setEmail("");
    };

    return (
        <footer className="bg-black px-6 py-14 text-white">
            <div className="mx-auto max-w-7xl">

                {/* Main Footer */}
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

                    {/* Brand */}
                    <div>
                        <h2 className="text-xl font-bold tracking-[0.2em]">
                            THREAD<span className="font-light">&</span>FORM
                        </h2>

                        <p className="mt-3 max-w-xs text-xs leading-5 text-neutral-400">
                            Timeless style. Everyday comfort.
                        </p>

                    </div>


                    {/* HELP */}
                    <div className="space-y-3 text-xs text-neutral-300">
                        <h3 className="font-semibold text-white">
                            HELP
                        </h3>

                        <a
                            href="https://gentlepark.com/terms-and-conditions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition hover:text-white"
                        >
                            Terms & Conditions
                        </a>

                        <a
                            href="https://gentlepark.com/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition hover:text-white"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="https://gentlepark.com/return-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition hover:text-white"
                        >
                            Shipping & Returns
                        </a>

                        <a
                            href="https://gentlepark.com/help-center"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition hover:text-white"
                        >
                            Help Center
                        </a>

                        <button
                            type="button"
                            className="block transition hover:text-white"
                        >
                            Cookie settings
                        </button>
                    </div>

                    {/* FOLLOW US */}
                    <div className="space-y-3 text-xs text-neutral-300">
                        <h3 className="font-semibold text-white">
                            FOLLOW US
                        </h3>

                        {/* Connect Instagram later */}
                        <a
                            href="#"
                            className="block transition hover:text-white"
                        >
                            Instagram
                        </a>

                        {/* Connect Facebook later */}
                        <a
                            href="#"
                            className="block transition hover:text-white"
                        >
                            Facebook
                        </a>

                        {/* Connect TikTok later */}
                        <a
                            href="#"
                            className="block transition hover:text-white"
                        >
                            TikTok
                        </a>
                    </div>

                    {/* MY ACCOUNT */}
                    <div className="space-y-3 text-xs text-neutral-300">
                        <h3 className="font-semibold text-white">
                            MY ACCOUNT
                        </h3>

                        {/* Connect to Sign In / Register later */}
                        <a
                            href="#"
                            className="block transition hover:text-white"
                        >
                            Sign In / Register
                        </a>

                        {/* Connect to My Orders later */}
                        <a
                            href="#"
                            className="block transition hover:text-white"
                        >
                            My Orders
                        </a>

                        {/* Connect to Wishlist later */}
                        <a
                            href="#"
                            className="block transition hover:text-white"
                        >
                            Wishlist
                        </a>
                    </div>

                    {/* ADDRESS + SUBSCRIBE */}
                    <div className="space-y-8 text-xs text-neutral-300">

                        {/* ADDRESS */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-white">
                                ADDRESS
                            </h3>

                            <p className="max-w-[200px] leading-5">
                                House 12, Road 5,
                                <br />
                                Dhanmondi, Dhaka 1205,
                                <br />
                                Bangladesh
                            </p>

                            <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1">
                                <a
                                    href="mailto:hello@threadandform.com"
                                    className="hover:text-white"
                                >
                                    hello@threadandform.com
                                </a>

                                <a
                                    href="tel:+8801700000000"
                                    className="hover:text-white"
                                >
                                    +880 1700-000000
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 border-t border-neutral-800 pt-5">
                    <p className="text-xs text-neutral-500">
                        © 2026 THREAD & FORM. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}