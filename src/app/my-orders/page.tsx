"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/navbar";

type OrderItem = {
    id: string;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
};

type Order = {
    orderId: string;

    customer: {
        name: string;
        phone: string;
        email: string;
    };

    shipping: {
        area: string;
        address: string;
        alternativePhone: string;
        note: string;
    };

    items: OrderItem[];

    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;

    paymentMethod: string;
    status: string;
    createdAt: string;
};

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const savedOrders = localStorage.getItem("orders");

        if (savedOrders) {
            setOrders(JSON.parse(savedOrders).reverse());
        }
    }, []);

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-900">
            <Navbar />

            <div className="mx-auto max-w-5xl px-5 py-12">
                <h1 className="text-3xl font-light md:text-4xl">
                    My Orders
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    View your recent orders and order details.
                </p>

                {orders.length === 0 ? (
                    <div className="mt-12 bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-medium">
                            No Orders Yet
                        </h2>

                        <p className="mt-2 text-sm text-neutral-500">
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            href="/shop"
                            className="mt-6 inline-block bg-black px-8 py-4 text-sm font-semibold tracking-widest text-white transition hover:bg-neutral-700"
                        >
                            START SHOPPING
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 space-y-6">
                        {orders.map((order) => (
                            <section
                                key={order.orderId}
                                className="bg-white p-6 shadow-sm md:p-8"
                            >
                                {/* ORDER HEADER */}
                                <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="text-xs text-neutral-500">
                                            Order ID
                                        </p>

                                        <p className="mt-1 font-medium">
                                            #{order.orderId}
                                        </p>

                                        <p className="mt-1 text-xs text-neutral-500">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-BD", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-xs text-neutral-500">
                                            Order Status
                                        </p>

                                        <span className="mt-1 inline-block border border-neutral-300 px-3 py-1 text-xs font-medium">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* ORDER ITEMS */}
                                <div className="mt-6 space-y-5">
                                    {order.items.map((item) => (
                                        <div
                                            key={`${order.orderId}-${item.id}-${item.size}-${item.color}`}
                                            className="flex gap-4"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-20 w-20 object-cover"
                                            />

                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {item.name}
                                                </p>

                                                <p className="mt-1 text-xs text-neutral-500">
                                                    Qty: {item.quantity}
                                                </p>

                                                {(item.size || item.color) && (
                                                    <p className="mt-1 text-xs text-neutral-500">
                                                        {item.size &&
                                                            `Size: ${item.size}`}
                                                        {item.size &&
                                                            item.color &&
                                                            " · "}
                                                        {item.color &&
                                                            `Color: ${item.color}`}
                                                    </p>
                                                )}

                                                {item.discount > 0 && (
                                                    <p className="mt-1 text-xs text-green-600">
                                                        {item.discount}% OFF
                                                    </p>
                                                )}
                                            </div>

                                            <div className="whitespace-nowrap text-right">
                                                {item.discount > 0 ? (
                                                    <>
                                                        <p className="text-xs text-neutral-400 line-through">
                                                            ৳
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toLocaleString(
                                                                "en-BD"
                                                            )}
                                                        </p>

                                                        <p className="text-sm font-medium">
                                                            ৳
                                                            {(
                                                                (item.price -
                                                                    (item.price *
                                                                        item.discount) /
                                                                        100) *
                                                                item.quantity
                                                            ).toLocaleString(
                                                                "en-BD"
                                                            )}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm">
                                                        ৳
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString(
                                                            "en-BD"
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ORDER TOTAL */}
                                <div className="mt-6 border-t border-neutral-200 pt-5">
                                    {/* PAYMENT METHOD */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">
                                            Payment Method
                                        </span>

                                        <span>
                                            {order.paymentMethod}
                                        </span>
                                    </div>

                                    {/* SUBTOTAL */}
                                    <div className="mt-3 flex justify-between text-sm">
                                        <span className="text-neutral-500">
                                            Subtotal
                                        </span>

                                        <span>
                                            ৳
                                            {order.subtotal.toLocaleString(
                                                "en-BD"
                                            )}
                                        </span>
                                    </div>

                                    {/* DISCOUNT */}
                                    {order.discount > 0 && (
                                        <div className="mt-3 flex justify-between text-sm text-green-600">
                                            <span>
                                                Product Discount
                                            </span>

                                            <span>
                                                -৳
                                                {order.discount.toLocaleString(
                                                    "en-BD"
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* AFTER DISCOUNT */}
                                    <div className="mt-3 flex justify-between text-sm">
                                        <span className="text-neutral-500">
                                            After Discount
                                        </span>

                                        <span>
                                            ৳
                                            {(
                                                order.subtotal -
                                                order.discount
                                            ).toLocaleString("en-BD")}
                                        </span>
                                    </div>

                                    {/* DELIVERY */}
                                    <div className="mt-3 flex justify-between text-sm">
                                        <span className="text-neutral-500">
                                            Delivery Charge
                                        </span>

                                        <span>
                                            ৳
                                            {order.deliveryCharge.toLocaleString(
                                                "en-BD"
                                            )}
                                        </span>
                                    </div>

                                    {/* TOTAL */}
                                    <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                                        <span>Total</span>

                                        <span>
                                            ৳
                                            {order.total.toLocaleString(
                                                "en-BD"
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* CUSTOMER INFORMATION */}
                                <div className="mt-6 border-t border-neutral-200 pt-5">
                                    <p className="text-sm font-semibold">
                                        Customer Information
                                    </p>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {/* CUSTOMER NAME */}
                                        <div>
                                            <p className="text-xs text-neutral-500">
                                                Customer Name
                                            </p>

                                            <p className="mt-1 text-sm">
                                                {order.customer.name}
                                            </p>
                                        </div>

                                        {/* PHONE NUMBER */}
                                        <div>
                                            <p className="text-xs text-neutral-500">
                                                Phone Number
                                            </p>

                                            <p className="mt-1 text-sm">
                                                {order.customer.phone}
                                            </p>
                                        </div>

                                        {/* EMAIL */}
                                        <div>
                                            <p className="text-xs text-neutral-500">
                                                Email
                                            </p>

                                            <p className="mt-1 text-sm">
                                                {order.customer.email}
                                            </p>
                                        </div>

                                        {/* ALTERNATIVE PHONE */}
                                        <div>
                                            <p className="text-xs text-neutral-500">
                                                Alternative Phone
                                            </p>

                                            <p className="mt-1 text-sm">
                                                {order.shipping
                                                    .alternativePhone || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* DELIVERY INFORMATION */}
                                <div className="mt-6 border-t border-neutral-200 pt-5">
                                    <p className="text-sm font-semibold">
                                        Delivery Information
                                    </p>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {/* FULL ADDRESS */}
                                        <div>
                                            <p className="text-xs text-neutral-500">
                                                Full Address
                                            </p>

                                            <p className="mt-1 text-sm">
                                                {order.shipping.address}
                                            </p>
                                        </div>

                                        {/* DISTRICT */}
                                        <div>
                                            <p className="text-xs text-neutral-500">
                                                District
                                            </p>

                                            <p className="mt-1 text-sm">
                                                {order.shipping.area}
                                            </p>
                                        </div>

                                        {/* DELIVERY NOTE */}
                                        <div className="sm:col-span-2">
                                            <p className="text-xs text-neutral-500">
                                                Delivery Note
                                            </p>

                                            <p className="mt-1 text-sm">
                                                {order.shipping.note || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}