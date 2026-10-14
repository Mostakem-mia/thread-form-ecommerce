"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "../data/products";
import { useCart } from "../context/cart-context";
import { getItemSubtotal, getItemTotal } from "../lib/pricing";
import ProductCard from "../components/product-card";

export default function Home() {
  const { cartItems, cartCount, removeItem } = useCart();

  // 1. New Arrivals Data & Pagination (8 items = 2 rows on desktop)
  const newArrivals = products.filter((product) => product.isNew);
  const allArrivals = newArrivals.length > 0 ? newArrivals : products;
  const itemsPerPageArrivals = 4;
  const [currentPageArrivals, setCurrentPageArrivals] = useState(1);
  const [showAllArrivals, setShowAllArrivals] = useState(false);

  const totalPagesArrivals = Math.ceil(allArrivals.length / itemsPerPageArrivals);
  const displayedArrivals = showAllArrivals
    ? allArrivals
    : allArrivals.slice(
        (currentPageArrivals - 1) * itemsPerPageArrivals,
        currentPageArrivals * itemsPerPageArrivals
      );

  // 2. Shop All Data & Pagination (8 items = 2 rows on desktop)
  const itemsPerPageShopAll = 8;
  const [currentPageShopAll, setCurrentPageShopAll] = useState(1);
  const [showAllShopAll, setShowAllShopAll] = useState(false);

  const totalPagesShopAll = Math.ceil(products.length / itemsPerPageShopAll);
  const displayedShopAll = showAllShopAll
    ? products
    : products.slice(
        (currentPageShopAll - 1) * itemsPerPageShopAll,
        currentPageShopAll * itemsPerPageShopAll
      );

  return (
    <main className="min-h-screen bg-[#faf9f6] text-neutral-900">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[600px] items-center bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.05)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800')",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-24 text-white">
          <p className="mb-5 text-xs tracking-[0.4em] text-neutral-300">
            THE NEW COLLECTION — 2026
          </p>

          <h1 className="max-w-2xl text-5xl font-light leading-tight md:text-7xl">
            Style that speaks.
            <br />
            <span className="font-semibold">Quality that lasts.</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-neutral-200">
            Discover timeless essentials designed for everyday confidence.
            A perfect balance of comfort, quality and modern style.
          </p>

          <a
            href="#collection"
            className="mt-9 inline-block bg-white px-9 py-4 text-xs font-semibold tracking-widest text-black transition hover:bg-neutral-200"
          >
            EXPLORE COLLECTION →
          </a>
        </div>
      </section>

      {/* 2. Features */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-12 text-center sm:grid-cols-3">
        <div className="border border-neutral-100 bg-white p-6 shadow-xs">
          <p className="text-2xl">✦</p>
          <h3 className="mt-2 text-sm font-semibold">Premium Quality</h3>
          <p className="mt-1 text-xs text-neutral-500">Carefully selected fabrics</p>
        </div>
        <div className="border border-neutral-100 bg-white p-6 shadow-xs">
          <p className="text-2xl">♧</p>
          <h3 className="mt-2 text-sm font-semibold">Fast Delivery</h3>
          <p className="mt-1 text-xs text-neutral-500">Reliable nationwide shipping</p>
        </div>
        <div className="border border-neutral-100 bg-white p-6 shadow-xs">
          <p className="text-2xl">↺</p>
          <h3 className="mt-2 text-sm font-semibold">Easy Returns</h3>
          <p className="mt-1 text-xs text-neutral-500">Simple 7-day return process</p>
        </div>
      </section>

      {/* 3. Shop by Collection */}
      <section id="collection" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.3em] text-neutral-500">DISCOVER YOUR STYLE</p>
          <h2 className="mt-3 text-3xl font-light md:text-4xl">
            Shop by Collection
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
        <Link href="/men" className="group relative h-[420px] overflow-hidden bg-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000"
              alt="Men's fashion"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8">
              <div className="text-white">
                <p className="text-xs tracking-widest text-neutral-300">EXPLORE</p>
                <h3 className="mt-1 text-3xl font-semibold">Men</h3>
              </div>
            </div>
          </Link>

          <Link href="/women" className="group relative h-[420px] overflow-hidden bg-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000"
              alt="Women's fashion"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8">
              <div className="text-white">
                <p className="text-xs tracking-widest text-neutral-300">EXPLORE</p>
                <h3 className="mt-1 text-3xl font-semibold">Women</h3>
              </div>
            </div>
          </Link>

          
        </div>
      </section>

      {/* 4. New Arrivals (2 Rows + Pagination & Show All Button) */}
      <section id="featured" className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs tracking-[0.3em] text-neutral-500">
                OUR SELECTION
              </p>
              <h2 className="mt-2 text-3xl font-light md:text-4xl">
                New Arrivals
              </h2>
            </div>

            {allArrivals.length > itemsPerPageArrivals && (
              <button
                type="button"
                onClick={() => {
                  setShowAllArrivals(!showAllArrivals);
                  setCurrentPageArrivals(1);
                }}
                className="border border-black bg-white px-5 py-2 text-xs font-semibold tracking-widest text-black transition hover:bg-black hover:text-white"
              >
                {showAllArrivals ? "PAGED VIEW" : "SHOW ALL"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {displayedArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!showAllArrivals && totalPagesArrivals > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPageArrivals((p) => Math.max(1, p - 1))}
                disabled={currentPageArrivals === 1}
                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPagesArrivals }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPageArrivals(page)}
                  className={`h-8 w-8 text-xs font-medium transition ${
                    currentPageArrivals === page
                      ? "bg-black text-white"
                      : "border border-neutral-200 bg-white text-neutral-800 hover:border-black"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPageArrivals((p) => Math.min(totalPagesArrivals, p + 1))}
                disabled={currentPageArrivals === totalPagesArrivals}
                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Shop All Products (New Arrivals-এর মতো একই 2-Row + Pagination সিস্টেম) */}
      <section id="shop-all" className="bg-[#faf9f6] py-20 border-t border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs tracking-[0.3em] text-neutral-500">
                COMPLETE CATALOG
              </p>
              <h2 className="mt-2 text-3xl font-light md:text-4xl">
                Shop All Products
              </h2>
            </div>

            {products.length > itemsPerPageShopAll && (
              <button
                type="button"
                onClick={() => {
                  setShowAllShopAll(!showAllShopAll);
                  setCurrentPageShopAll(1);
                }}
                className="border border-black bg-white px-5 py-2 text-xs font-semibold tracking-widest text-black transition hover:bg-black hover:text-white"
              >
                {showAllShopAll ? "PAGED VIEW" : "SHOW ALL"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {displayedShopAll.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!showAllShopAll && totalPagesShopAll > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPageShopAll((p) => Math.max(1, p - 1))}
                disabled={currentPageShopAll === 1}
                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPagesShopAll }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPageShopAll(page)}
                  className={`h-8 w-8 text-xs font-medium transition ${
                    currentPageShopAll === page
                      ? "bg-black text-white"
                      : "border border-neutral-200 bg-white text-neutral-800 hover:border-black"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPageShopAll((p) => Math.min(totalPagesShopAll, p + 1))}
                disabled={currentPageShopAll === totalPagesShopAll}
                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Shopping Bag Section (Side by Side Horizontally, No Order Summary) */}
      {cartItems.length > 0 && (
        <section id="cart" className="mx-auto max-w-7xl border-t border-neutral-200 px-6 py-20">
          <div className="mb-10 text-center">
            <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
              Your Selection
            </p>
            <h2 className="mt-2 text-3xl font-light md:text-4xl">
              Shopping Bag ({cartCount})
            </h2>
          </div>

          {/* Side by Side (Horizontal Row with Smooth Scroll) */}
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id || item.name}-${item.size}-${item.color}-${index}`}
                className="flex w-64 flex-none flex-col justify-between border border-neutral-200 bg-white p-4 shadow-xs"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    {item.discount > 0 && (
                      <span className="absolute left-2.5 top-2.5 rounded-md bg-[#ff2a5f] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        -{item.discount}%
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                      {item.category}
                    </p>
                    <h3 className="mt-1 text-sm font-medium text-neutral-900 line-clamp-1">
                      {item.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-1 text-xs text-neutral-500">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span>·</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>

                    <div className="mt-2 text-xs">
                      {item.discount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900">
                            ৳{getItemTotal(item).toLocaleString("en-BD")}
                          </span>
                          <span className="text-neutral-400 line-through">
                            ৳{getItemSubtotal(item).toLocaleString("en-BD")}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-neutral-900">
                          ৳{getItemTotal(item).toLocaleString("en-BD")}
                        </span>
                      )}
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remove Option (Choto ebong left-aligned) */}
                <div className="mt-3 border-t border-neutral-100 pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-[9px] font-normal tracking-tight text-red-500 underline underline-offset-2 hover:text-red-700 transition"
                  >
                    remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/cart"
              className="inline-block bg-black px-12 py-4 text-xs font-semibold tracking-widest text-white transition hover:bg-neutral-800 shadow-sm"
            >
              VIEW BAG
            </Link>
          </div>
        </section>
      )}

      {/* 7. Philosophy / About */}
      <section id="about" className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-xs tracking-[0.3em] text-neutral-500">OUR PHILOSOPHY</p>
        <h2 className="mt-4 text-3xl font-light leading-snug md:text-5xl">
          Less, but better. <br />
          Made for everyday living.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-neutral-600">
          We believe great style begins with simplicity. Our collections
          combine thoughtful design, comfortable fabrics and timeless details.
        </p>
      </section>

      {/* 8. Newsletter */}
      <section className="bg-neutral-100 px-6 py-16 text-center">
        <h2 className="text-2xl font-light md:text-3xl">Stay in the loop</h2>
        <p className="mt-3 text-sm text-neutral-600">
          Get updates on new collections and special offers.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for subscribing!");
          }}
          className="mx-auto mt-7 flex max-w-md"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            className="min-w-0 flex-1 border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-black px-6 text-xs font-semibold tracking-widest text-white transition hover:bg-neutral-800"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>
    </main>
  );
}