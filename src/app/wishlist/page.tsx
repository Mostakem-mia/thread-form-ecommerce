"use client";

import { useWishlist } from "@/context/wishlist-context";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
    const { wishlist, isWishlistLoaded } = useWishlist();
    const { isAuthenticated, isAuthLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthLoaded && !isAuthenticated) router.replace(`/login?redirect=${encodeURIComponent("/wishlist")}`);
    }, [isAuthLoaded, isAuthenticated, router]);

    if (!isAuthLoaded || !isAuthenticated || !isWishlistLoaded) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4" role="status" aria-live="polite">
                <p className="text-gray-500">Loading your wishlist...</p>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mt-2">Explore our collection and add your favorite items!</p>
                <Link
                    href="/shop"
                    className="mt-6 rounded-md bg-black px-6 py-2.5 text-white hover:bg-gray-800 transition"
                >
                    Explore Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}