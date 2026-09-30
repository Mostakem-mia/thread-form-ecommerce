"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const products = [
  {
    id: "1",
    name: "Classic Linen Shirt",
    category: "MEN",
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700",
  },
  {
    id: "2",
    name: "Minimal White Shirt",
    category: "MEN",
    price: 1650,
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=700",
  },
  {
    id: "3",
    name: "Elegant Summer Dress",
    category: "WOMEN",
    price: 2450,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700",
  },
  {
    id: "4",
    name: "Classic Denim",
    category: "MEN",
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700",
  },


  {
    id: "5",
    name: "Classic Linen Shirt 2",
    category: "MEN",
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700",
  },
  {
    id: "6",
    name: "Minimal White Shirt 2",
    category: "MEN",
    price: 1650,
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=700",
  },
  {
    id: "7",
    name: "Elegant Summer Dress 2",
    category: "WOMEN",
    price: 2450,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700",
  },
  {
    id: "8",
    name: "Classic Denim 2",
    category: "MEN",
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700",
  },
];


export default function Home() {
  type CartItem = (typeof products)[number] & {
    size?: string;
    color?: string;
    quantity: number;
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState("inside");

  const cartCount = cartItems.length;

  const addToCart = (product: (typeof products)[number]) => {
    const savedCart = localStorage.getItem("cartItems");
    const currentCart: CartItem[] = savedCart
      ? JSON.parse(savedCart)
      : [];

    const existingIndex = currentCart.findIndex(
      (item) => item.id === product.id && !item.size && !item.color
    );

    if (existingIndex >= 0) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    setCartItems(currentCart);
  };

  const removeFromCart = (index: number) => {
    setCartItems((items) => items.filter((_, i) => i !== index));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCharge =
    cartItems.length === 0
      ? 0
      : deliveryArea === "inside"
        ? 80
        : 150;

  const grandTotal = total + deliveryCharge;

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, cartLoaded]);

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* Announcement Bar */}
      <div className="bg-black px-4 py-2 text-center text-xs tracking-widest text-white">
        FREE DELIVERY ON ORDERS OVER ৳5,000
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button className="text-xl font-bold tracking-[0.2em]">
            THREAD<span className="font-light">&</span>FORM
          </button>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a href="#" className="hover:text-neutral-500">Home</a>
            <a href="#collection" className="hover:text-neutral-500">Shop</a>
            <a href="#featured" className="hover:text-neutral-500">New Arrivals</a>
            <a href="#about" className="hover:text-neutral-500">About</a>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <button aria-label="Search">⌕</button>
            <button aria-label="Account">♙</button>
            <Link href="/cart">Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.05)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800')",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-24 text-white">
          <p className="mb-5 text-xs tracking-[0.4em]">
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

      {/* Features */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-10 text-center sm:grid-cols-3">
        <div>
          <p className="text-2xl">✦</p>
          <h3 className="mt-2 text-sm font-semibold">Premium Quality</h3>
          <p className="mt-1 text-xs text-neutral-500">Carefully selected fabrics</p>
        </div>
        <div>
          <p className="text-2xl">♧</p>
          <h3 className="mt-2 text-sm font-semibold">Free Delivery</h3>
          <p className="mt-1 text-xs text-neutral-500">On orders over ৳3,000</p>
        </div>
        <div>
          <p className="text-2xl">↺</p>
          <h3 className="mt-2 text-sm font-semibold">Easy Returns</h3>
          <p className="mt-1 text-xs text-neutral-500">Simple return process</p>
        </div>
      </section>

      {/* Collections */}
      <section id="collection" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.3em] text-neutral-500">DISCOVER YOUR STYLE</p>
          <h2 className="mt-3 text-3xl font-light md:text-4xl">
            Shop by Collection
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <a href="#featured" className="group relative h-[400px] overflow-hidden bg-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000"
              alt="Women's fashion"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-8">
              <div className="text-white">
                <p className="text-xs tracking-widest">EXPLORE</p>
                <h3 className="mt-2 text-3xl font-semibold">Women</h3>
              </div>
            </div>
          </a>

          <a href="#featured" className="group relative h-[400px] overflow-hidden bg-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000"
              alt="Men's fashion"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-8">
              <div className="text-white">
                <p className="text-xs tracking-widest">EXPLORE</p>
                <h3 className="mt-2 text-3xl font-semibold">Men</h3>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] text-neutral-500">
                OUR SELECTION
              </p>
              <h2 className="mt-3 text-3xl font-light md:text-4xl">
                Featured Products
              </h2>
            </div>
            <a href="#featured" className="text-xs font-semibold tracking-widest underline underline-offset-4">
              VIEW ALL
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <article key={product.name} className="group">
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200 cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute right-3 top-3 bg-white px-3 py-1 text-[10px] tracking-widest">
                      NEW
                    </span>
                    <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] tracking-widest">
                      20%
                    </span>
                  </div>
                </Link>

                <div className="pt-4">
                  <p className="text-[10px] tracking-widest text-neutral-500">
                    {product.category}
                  </p>

                  <Link href={`/product/${product.id}`}>
                    <h3 className="mt-1 cursor-pointer text-sm font-medium hover:underline">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mt-2 text-sm">
                    ৳{product.price.toLocaleString("en-BD")}
                  </p>

                  <Link
                    href={`/product/${product.id}`}
                    className="mt-3 block w-full border border-black py-2 text-center text-xs font-semibold tracking-widest hover:bg-black hover:text-white"
                  >
                    ADD TO BAG
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Cart */}
      <section id="cart" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-neutral-500">
            YOUR SELECTION
          </p>
          <h2 className="mt-3 text-3xl font-light md:text-4xl">
            Shopping Bag ({cartCount})
          </h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="border border-neutral-200 py-16 text-center">
            <p className="text-neutral-500">Your shopping bag is empty.</p>
            <a
              href="#featured"
              className="mt-5 inline-block bg-black px-8 py-3 text-xs tracking-widest text-white"
            >
              CONTINUE SHOPPING
            </a>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex gap-5 border-b border-neutral-200 pb-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-32 w-28 object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">
                        {item.category}
                      </p>
                      <h3 className="mt-1 font-medium">{item.name}</h3>

                      <p className="mt-2 text-sm text-neutral-600">
                        Size: {item.size || "Not selected"}
                      </p>

                      <p className="text-sm text-neutral-600">
                        Color: {item.color || "Not selected"}
                      </p>

                      <p className="mt-2 text-sm">
                        ৳{item.price.toLocaleString("en-BD")} × {item.quantity}
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        Subtotal: ৳{(item.price * item.quantity).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="w-fit text-xs text-red-600 underline"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit border border-neutral-200 p-6">
              <h3 className="text-lg font-medium">Order Summary</h3>
              <div className="mt-6">
                <label htmlFor="deliveryArea" className="mb-2 block text-sm font-medium">
                  Delivery Area
                </label>

                <select
                  id="deliveryArea"
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  className="w-full border border-neutral-300 bg-white p-3 text-sm"
                >
                  <option value="inside">Inside Dhaka — ৳80</option>
                  <option value="outside">Outside Dhaka — ৳150</option>
                </select>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{total.toLocaleString("en-BD")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>৳{deliveryCharge}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm">
                <span>Total</span>
                <span className="font-semibold">
                  ৳{grandTotal.toLocaleString("en-BD")}
                </span>
              </div>

              <a
                href="/checkout"
                className="mt-7 block w-full bg-black py-4 text-center text-xs font-semibold tracking-widest text-white hover:bg-neutral-700">
                PROCEED TO CHECKOUT
              </a>

              <p className="mt-4 text-center text-xs text-neutral-500">
                Delivery charges calculated at checkout.
              </p>
            </div>
          </div>
        )}
      </section>
      {/* About */}
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

      {/* Newsletter */}
      <section className="bg-neutral-100 px-6 py-16 text-center">
        <h2 className="text-2xl font-light md:text-3xl">Stay in the loop</h2>
        <p className="mt-3 text-sm text-neutral-600">
          Get updates on new collections and special offers.
        </p>
        <form className="mx-auto mt-7 flex max-w-md">
          <input
            type="email"
            placeholder="Your email address"
            className="min-w-0 flex-1 border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
          />
          <button
            type="button"
            className="bg-black px-6 text-xs font-semibold tracking-widest text-white hover:bg-neutral-700"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-black px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
          <div>
            <h2 className="text-xl font-bold tracking-[0.2em]">
              THREAD<span className="font-light">&</span>FORM
            </h2>
            <p className="mt-3 text-xs text-neutral-400">
              Timeless style. Everyday comfort.
            </p>
          </div>

          <div className="flex gap-12 text-xs text-neutral-300">
            <div className="space-y-3">
              <h3 className="font-semibold text-white">HELP</h3>
              <p>Contact Us</p>
              <p>Shipping</p>
              <p>Returns</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-white">FOLLOW US</h3>
              <p>Instagram</p>
              <p>Facebook</p>
              <p>TikTok</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-neutral-800 pt-5 text-xs text-neutral-500">
          © 2026 THREAD & FORM. All rights reserved.
        </div>
      </footer>
    </main>
  );
}