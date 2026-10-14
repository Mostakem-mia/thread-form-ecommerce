"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getOrdersForEmail } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isAuthLoaded, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent("/profile")}`);
      return;
    }
    setLoading(false);
  }, [isAuthLoaded, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      setOrders([]);
      return;
    }
    try {
      setOrders(getOrdersForEmail(user.email));
    } catch (error) {
      console.error("Failed to load profile order history:", error);
      setOrders([]);
    }
  }, [isAuthenticated, user]);

  if (!isAuthLoaded || loading || !isAuthenticated || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6]">
        <p className="text-xs tracking-widest text-neutral-400 uppercase">
          Loading profile...
        </p>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-16 text-neutral-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border border-neutral-200 bg-white p-8 shadow-xs">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                User Profile
              </p>
              <h1 className="mt-1 text-2xl font-light">{user.name}</h1>
              <p className="mt-1 text-xs text-neutral-500">{user.email}</p>
              {user.phone && (
                <p className="text-xs text-neutral-500">{user.phone}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-fit border border-neutral-300 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-neutral-800 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="border border-neutral-200 bg-white p-6 shadow-xs md:col-span-2">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-neutral-800">
                Order History
              </h2>
              <span className="text-xs text-neutral-400">{orders.length} Total Orders</span>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-neutral-500">You haven't placed any orders yet.</p>
                <Link href="/shop" className="mt-4 inline-block bg-black px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.orderId} className="flex items-center justify-between gap-4 py-4 text-xs">
                    <div>
                      <p className="font-medium text-neutral-800">Order #{order.orderId}</p>
                      <p className="mt-1 text-neutral-500">{new Date(order.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{order.total.toLocaleString("en-BD")}</p>
                      <p className="mt-1 text-neutral-500">{order.status}</p>
                    </div>
                  </div>
                ))}
                <Link href="/my-orders" className="inline-block py-4 text-xs font-semibold underline underline-offset-4">View all orders →</Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="border border-neutral-200 bg-white p-6 shadow-xs">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-800">
                Quick Links
              </h3>
              <div className="mt-4 flex flex-col space-y-2 text-xs">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between border-b border-neutral-100 py-2.5 text-neutral-600 transition hover:text-black"
                >
                  <span>My Wishlist</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center justify-between border-b border-neutral-100 py-2.5 text-neutral-600 transition hover:text-black"
                >
                  <span>Shopping Bag</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/shop"
                  className="flex items-center justify-between py-2.5 text-neutral-600 transition hover:text-black"
                >
                  <span>Explore Shop</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}