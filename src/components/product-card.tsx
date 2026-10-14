"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Product } from "@/types/product";
import { useWishlist } from "@/context/wishlist-context";
import { getItemFinalPrice, getItemDiscount } from "@/lib/pricing";

export default function ProductCard({ product }: { product: Product }) {
    const { wishlist, addToWishlist, removeFromWishlist, isWishlistLoaded } = useWishlist();
    const { isAuthenticated, isAuthLoaded } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const isWishlisted = wishlist.some((item) => item.id === product.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthLoaded || !isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(pathname || "/shop")}`);
            return;
        }
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const finalPrice = getItemFinalPrice({
        price: product.price,
        discount: product.discount || 0,
        quantity: 1,
    });

    const savedAmount = getItemDiscount({
        price: product.price,
        discount: product.discount || 0,
        quantity: 1,
    });

    return (
        <div className="group flex flex-col">
            {/* 1. IMAGE CONTAINER */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <Link href={`/product/${product.id}`} className="block h-full w-full">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>

                {/* Discount Badge (Chobir moto pinkish-red color ebong -% format) */}
                {product.discount > 0 && (
                    <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-[#ff2a5f] px-2.5 py-1 text-[11px] font-bold tracking-tight text-white shadow-sm">
                        -{product.discount}%
                    </span>
                )}

                {/* NEW Badge (Top Right) */}
                {product.isNew && (
                    <span className="pointer-events-none absolute right-3 top-3 z-10 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-900 shadow-sm">
                        NEW
                    </span>
                )}

                {/* Wishlist Button (Bottom Right) */}
                <button
                    type="button"
                    onClick={toggleWishlist}
                    aria-label={!isAuthenticated ? "Log in to manage wishlist" : isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    disabled={!isAuthLoaded || (isAuthenticated && !isWishlistLoaded)}
                    title={!isAuthenticated ? "Log in to use your wishlist" : undefined}
                    className={`absolute bottom-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white ${isWishlisted ? "text-red-500" : "text-neutral-700 hover:text-black"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isWishlisted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                </button>
            </div>

            {/* 2. PRODUCT DETAILS */}
            <div className="mt-3 flex flex-1 flex-col">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    {product.category || product.subcategory}
                </p>

                <h3 className="mt-1 text-sm font-normal text-neutral-900">
                    <Link href={`/product/${product.id}`} className="hover:underline">
                        {product.name}
                    </Link>
                </h3>

                {/* Save Badge (Damer thik upore koto taka save hocche) */}
                {product.discount > 0 && savedAmount > 0 && (
                    <div className="mt-2 flex items-center">
                        <span className="inline-flex items-center gap-1 rounded bg-[#008a45] px-2 py-0.5 text-[11px] font-medium text-white shadow-xs">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-3 w-3"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 8.38 3H5.5ZM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Save ৳{savedAmount.toLocaleString("en-BD")}
                        </span>
                    </div>
                )}

                {/* Price Section */}
                <div className="mt-2 flex items-baseline gap-2 text-sm">
                    <span className="font-bold text-neutral-1200 ">
                        ৳{finalPrice.toLocaleString("en-BD")}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-xs text-neutral-400 line-through">
                            ৳{product.price.toLocaleString("en-BD")}
                        </span>
                    )}
                </div>

                <Link
                    href={`/product/${product.id}`}
                    className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-900 underline underline-offset-4 hover:text-neutral-500"
                >
                    VIEW PRODUCT
                </Link>
            </div>
        </div>
    );
}