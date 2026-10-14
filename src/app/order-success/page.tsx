"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "../../types/order";

export default function OrderSuccessPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedOrder = localStorage.getItem("lastOrder");

            if (savedOrder) {
                const parsed = JSON.parse(savedOrder);
                // Safe validation: ensuring it's a valid order object with items and customer info
                if (
                    parsed &&
                    typeof parsed === "object" &&
                    parsed.orderId &&
                    parsed.customer &&
                    Array.isArray(parsed.items)
                ) {
                    setOrder(parsed);
                } else {
                    setOrder(null);
                }
            } else {
                setOrder(null);
            }
        } catch (error) {
            console.error("Failed to parse lastOrder from localStorage:", error);
            localStorage.removeItem("lastOrder");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#faf9f6] text-neutral-900">
                <div className="mx-auto max-w-3xl px-5 py-20 text-center">
                    <p className="text-sm text-neutral-500">Loading order details...</p>
                </div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="min-h-screen bg-[#faf9f6] text-neutral-900">
                <div className="mx-auto max-w-3xl px-5 py-20 text-center">
                    <h1 className="text-2xl font-medium">
                        No Order Found
                    </h1>

                    <p className="mt-3 text-sm text-neutral-500">
                        We could not find your recent order.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-8 inline-block bg-black px-8 py-4 text-sm font-semibold tracking-widest text-white hover:bg-neutral-700"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#faf9f6] text-neutral-900">
            <div className="mx-auto max-w-4xl px-5 py-16">

                {/* SUCCESS MESSAGE */}
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black text-2xl">
                        ✓
                    </div>
                    <h1 className="mt-6 text-3xl font-light md:text-4xl">
                        Order Confirmed
                    </h1>
                    <p className="mt-3 text-sm text-neutral-500">
                        Thank you for your order, {order.customer.name}.
                    </p>

                    <p className="mt-2 text-sm">
                        Order ID:{" "}
                        <span className="font-semibold">
                            #{order.orderId}
                        </span>
                    </p>
                </div>

                {/* ORDER DETAILS */}
                <div className="mt-12 grid gap-6 md:grid-cols-2">

                    {/* CUSTOMER */}
                    <section className="bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-medium">
                            Delivery Information
                        </h2>

                        <div className="mt-5 space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-neutral-500">
                                    Name
                                </p>

                                <p className="mt-1">
                                    {order.customer.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-neutral-500">
                                    Phone
                                </p>

                                <p className="mt-1">
                                    {order.customer.phone}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-neutral-500">
                                    Delivery Area
                                </p>

                                <p className="mt-1">
                                    {order.shipping.area}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-neutral-500">
                                    Address
                                </p>

                                <p className="mt-1">
                                    {order.shipping.address}
                                </p>
                            </div>

                            {order.shipping.note && (
                                <div>
                                    <p className="text-xs text-neutral-500">
                                        Delivery Note
                                    </p>

                                    <p className="mt-1">
                                        {order.shipping.note}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* PAYMENT */}
                    <section className="bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-medium">
                            Payment Information
                        </h2>

                        <div className="mt-5 space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">
                                    Payment Method
                                </span>

                                <span>
                                    {order.paymentMethod}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-neutral-500">
                                    Status
                                </span>

                                <span>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex justify-between border-t pt-4 font-semibold">
                                <span>Total</span>

                                <span>
                                    ৳{order.total.toLocaleString("en-BD")}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ORDER ITEMS */}
                <section className="mt-6 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-medium">
                        Ordered Items
                    </h2>

                    <div className="mt-5 space-y-4">
                        {order.items.map((item) => {
                            const calculatedSubtotal = item.price * item.quantity;
                            const calculatedDiscountedTotal =
                                item.discount > 0
                                    ? (item.price - (item.price * item.discount) / 100) * item.quantity
                                    : calculatedSubtotal;

                            const itemLineTotal =
                                typeof (item as any).lineTotal === "number"
                                    ? (item as any).lineTotal
                                    : calculatedDiscountedTotal;

                            return (
                                <div
                                    key={`${item.id}-${item.size}-${item.color}`}
                                    className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-16 w-16 object-cover"
                                        />

                                        <div>
                                            <p className="text-sm font-medium">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-xs text-neutral-500">
                                                Qty: {item.quantity}
                                            </p>

                                            {(item.size || item.color) && (
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    {item.size && `Size: ${item.size}`}
                                                    {item.size && item.color && " · "}
                                                    {item.color && `Color: ${item.color}`}
                                                </p>
                                            )}

                                            {item.discount > 0 && (
                                                <p className="mt-1 text-xs text-green-600">
                                                    {item.discount}% OFF
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="whitespace-nowrap text-right">
                                        {item.discount > 0 ? (
                                            <>
                                                <p className="text-xs text-neutral-400 line-through">
                                                    ৳{calculatedSubtotal.toLocaleString("en-BD")}
                                                </p>

                                                <p className="text-sm font-medium">
                                                    ৳{itemLineTotal.toLocaleString("en-BD")}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm">
                                                ৳{itemLineTotal.toLocaleString("en-BD")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* PRICE SUMMARY */}
                <section className="mt-6 bg-white p-6 shadow-sm">
                    <div className="space-y-3 text-sm">

                        {/* SUBTOTAL */}
                        <div className="flex justify-between">
                            <span>Subtotal</span>

                            <span>
                                ৳{order.subtotal.toLocaleString("en-BD")}
                            </span>
                        </div>

                        {/* PRODUCT DISCOUNT */}
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Product Discount</span>

                                <span>
                                    -৳{order.discount.toLocaleString("en-BD")}
                                </span>
                            </div>
                        )}

                        {/* COUPON DISCOUNT (IF APPLIED) */}
                        {(order as any).couponDiscount && (order as any).couponDiscount > 0 ? (
                            <div className="flex justify-between text-green-600">
                                <span>Coupon ({(order as any).couponCode})</span>

                                <span>
                                    -৳{((order as any).couponDiscount).toLocaleString("en-BD")}
                                </span>
                            </div>
                        ) : null}

                        {/* AFTER DISCOUNT */}
                        <div className="flex justify-between">
                            <span>After Discount</span>

                            <span>
                                ৳
                                {(
                                    order.subtotal -
                                    order.discount -
                                    ((order as any).couponDiscount || 0)
                                ).toLocaleString("en-BD")}
                            </span>
                        </div>

                        {/* DELIVERY */}
                        <div className="flex justify-between">
                            <span>Delivery Charge</span>

                            <span>
                                ৳{order.deliveryCharge.toLocaleString("en-BD")}
                            </span>
                        </div>

                        {/* TOTAL */}
                        <div className="flex justify-between border-t pt-4 text-base font-semibold">
                            <span>Total</span>

                            <span>
                                ৳{order.total.toLocaleString("en-BD")}
                            </span>
                        </div>
                    </div>
                </section>

                {/* BUTTON */}
                <div className="mt-10 text-center">
                    <Link
                        href="/shop"
                        className="inline-block bg-black px-10 py-4 text-sm font-semibold tracking-widest text-white transition hover:bg-neutral-700"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </div>
        </main>
    );
}