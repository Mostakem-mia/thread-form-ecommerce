"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [deliveryArea, setDeliveryArea] = useState("inside");

  
  type Product = {
    name: string;
    category: string;
    price: number;
    image: string;
  };

  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const total = subtotal + (cartItems.length > 0
    ? deliveryArea === "inside" ? 80 : 150
    : 0);

  

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const deliveryCharge = deliveryArea === "inside" ? 80 : 150;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(
      `Order information submitted!\n\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}\nDelivery: ${deliveryArea === "inside" ? "Inside Dhaka" : "Outside Dhaka"
      }\nDelivery Charge: ৳${deliveryCharge}`
    );
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-12 text-neutral-900">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-neutral-500 hover:text-black">
          ← Back to Shopping
        </a>

        <h1 className="mt-8 text-3xl font-light md:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Enter your information to place your order.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_350px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="text-xl font-medium">Delivery Information</h2>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                required
                pattern="01[0-9]{9}"
                title="Enter a valid 11-digit Bangladeshi mobile number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="01XXXXXXXXX"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Delivery Area
              </label>
              <select
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
              >
                <option value="inside">Inside Dhaka — ৳80</option>
                <option value="outside">Outside Dhaka — ৳150</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Delivery Address
              </label>
              <textarea
                required
                rows={4}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="House, road, area, district"
                className="w-full resize-none border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>
             {/* payment method */}
            <div>
              <label className="mb-3 block text-sm font-medium">Payment Method</label>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 p-4">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div>
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p className="mt-1 text-xs text-neutral-500">Pay when your order arrives.</p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-neutral-300 p-4">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <p className="text-sm font-medium">Online Payment</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Pay using card or mobile banking.
                    </p>
                  </div>
                </label>
              </div>
            </div>



            <button
              type="submit"
              className="w-full bg-black py-4 text-sm font-semibold tracking-widest text-white transition hover:bg-neutral-700"
            >
              PLACE ORDER
            </button>
          </form>

          <aside className="h-fit bg-white p-6 shadow-sm">
            <h2 className="text-xl font-medium">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span>{item.name}</span>
                  <span>৳{item.price.toLocaleString("en-BD")}</span>
                </div>
              ))}

              <div className="flex justify-between border-t pt-4 text-sm">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString("en-BD")}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery Charge</span>
                <span>
                  ৳{cartItems.length > 0
                    ? deliveryArea === "inside" ? 80 : 150
                    : 0}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Total</span>
                <span>৳{total.toLocaleString("en-BD")}</span>
              </div>
            </div>

            <p className="mt-6 text-xs leading-5 text-neutral-500">
              Your cart total will be included when we connect the checkout
              page to the shopping cart.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}