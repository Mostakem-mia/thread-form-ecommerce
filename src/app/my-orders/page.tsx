"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { clearOrdersForEmail, getOrdersForEmail } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function MyOrdersPage() {
    const router = useRouter();
    const { user, isAuthenticated, isAuthLoaded } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // লগআউট থাকলে অর্ডার পেজ দেখতে পারবে না, সোজা লগইন এ যাবে
        if (!isAuthLoaded) return;
        if (!isAuthenticated) {
            router.replace("/login?redirect=/my-orders");
            return;
        }

        try {
            setOrders(user?.email ? getOrdersForEmail(user.email) : []);
        } catch (error) {
            console.error("Failed to load orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthLoaded, isAuthenticated, user, router]);

    // টেস্টিংয়ের জন্য এই ইউজারের অর্ডার ইতিহাস ক্লিয়ার করার বাটন ফাংশন
    const handleClearMyOrders = () => {
        if (!confirm("Are you sure you want to clear your order history?")) return;

        try {
            if (user?.email) clearOrdersForEmail(user.email);
            setOrders([]);
        } catch (error) {
            console.error("Failed to clear order history:", error);
            alert("Could not clear order history. Please try again.");
        }
    };

    if (!isAuthLoaded || loading || !isAuthenticated) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6]">
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                    Loading orders...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#faf9f6] px-6 py-16 text-neutral-900">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-light">My Orders</h1>
                        <p className="text-xs text-neutral-500">
                            Orders for: <span className="font-medium text-neutral-800">{user?.email}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {orders.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClearMyOrders}
                                className="text-[11px] font-medium text-red-500 underline hover:text-red-700"
                            >
                                Clear History
                            </button>
                        )}
                        <Link
                            href="/profile"
                            className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black"
                        >
                            ← Profile
                        </Link>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="border border-neutral-200 bg-white p-12 text-center shadow-xs">
                        <p className="text-sm text-neutral-500">No orders found for this account.</p>
                        <Link
                            href="/shop"
                            className="mt-5 inline-block bg-black px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <div
                                key={order.orderId}
                                className="border border-neutral-200 bg-white p-6 shadow-xs"
                            >
                                {/* Order Top Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4 text-xs">
                                    <div>
                                        <span className="font-semibold text-neutral-900">
                                            Order #{order.orderId}
                                        </span>
                                        <span className="ml-3 text-neutral-400">
                                            {new Date(order.createdAt).toLocaleDateString("en-BD", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase text-neutral-700">
                                            {order.status || "Processing"}
                                        </span>
                                        <span className="font-semibold text-neutral-900">
                                            ৳{order.total?.toLocaleString("en-BD")}
                                        </span>
                                    </div>
                                </div>

                                {/* Items in this Order */}
                                <div className="divide-y divide-neutral-100 pt-2">
                                    {order.items?.map((item, idx) => (
                                        <div
                                            key={`${item.id}-${idx}`}
                                            className="flex items-center justify-between py-3 text-xs"
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-12 w-10 object-cover bg-neutral-100 rounded-xs"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-neutral-800">{item.name}</p>
                                                    <p className="text-[11px] text-neutral-500">
                                                        {item.size && `Size: ${item.size} `}
                                                        {item.color && `· Color: ${item.color}`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-medium text-neutral-900">
                                                    ৳{(item.price * (1 - (item.discount || 0) / 100) * item.quantity).toLocaleString("en-BD")}
                                                </p>
                                                <p className="text-[11px] text-neutral-400">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}