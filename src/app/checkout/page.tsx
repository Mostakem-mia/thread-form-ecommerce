"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/navbar";

type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [deliveryArea, setDeliveryArea] = useState("inside");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    cityDistrict: "",
    alternativePhone: "",
    deliveryNote: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryCharge =
    cartItems.length === 0
      ? 0
      : deliveryArea === "inside"
        ? 80
        : 150;

  const total = subtotal + deliveryCharge;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!termsAccepted) {
      alert(
        "Please agree to the Terms & Conditions, Refund Policy and Privacy Policy."
      );
      return;
    }

    // Generate unique order ID
    const orderId = `TF-${Date.now().toString().slice(-8)}`;

    const paymentName =
      paymentMethod === "cod"
        ? "Cash on Delivery"
        : paymentMethod === "card"
          ? "Card Payment"
          : "Mobile Banking";

    // Create order object
    const order = {
      orderId,

      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
    },

      shipping: {
        area: form.cityDistrict,
        address: form.address,
        alternativePhone: form.alternativePhone,
        note: form.deliveryNote,
    },

      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        image: item.image,
      })),

      subtotal,
      deliveryCharge,
      discount: 0,
      total,

      paymentMethod: paymentName,

      status: "Pending",

      createdAt: new Date().toISOString(),
    };

    //savedOrders
    const savedOrders = localStorage.getItem("orders");

    const existingOrders = savedOrders
      ? JSON.parse(savedOrders)
      : [];

    existingOrders.push(order);

    localStorage.setItem(
      "orders",
      JSON.stringify(existingOrders)
    );

    localStorage.setItem(
      "lastOrder",
      JSON.stringify(order)
    );

    // Clear cart after successful order
    localStorage.removeItem("cartItems");
    setCartItems([]);

    // Update Navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));

    // Go to order success page
    window.location.href = "/order-success";
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navbar />

      <div className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="text-3xl font-light md:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Complete your information to place your order.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]"
        >
          {/* LEFT SIDE */}
          <div className="space-y-8">

            {/* CONTACT INFORMATION */}
            <section className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-medium">
                Contact Information
              </h2>

              <div className="mt-6 space-y-5">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter your full name"
                    className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Phone Number */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone Number<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="tel"
                      required
                      pattern="01[0-9]{9}"
                      title="Enter a valid 11-digit Bangladeshi mobile number"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                      placeholder="01XXXXXXXXX"
                      className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email address"
                      className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SHIPPING ADDRESS */}
            <section className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-medium">
                Shipping Address
              </h2>

              <div className="mt-6 space-y-5">
                {/* Detailed Address */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Detailed Address<span className="text-red-500">*</span>
                  </label>

                  <textarea
                    required
                    rows={1}
                    value={form.address}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: e.target.value,
                      })
                    }
                    placeholder="House number, road, area"
                    className="w-full resize-none border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* City / District + Alternative Phone */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* City / District */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      City / District<span className="text-red-500">*</span>
                    </label>

                    <select
                      required
                      value={form.cityDistrict}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          cityDistrict: e.target.value,
                        })
                      }
                      className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                    >
                      <option value="">
                        Select City / District
                      </option>

                      <option value="Dhaka">Dhaka</option>
                      <option value="Faridpur">Faridpur</option>
                      <option value="Gazipur">Gazipur</option>
                      <option value="Gopalganj">Gopalganj</option>
                      <option value="Kishoreganj">Kishoreganj</option>
                      <option value="Madaripur">Madaripur</option>
                      <option value="Manikganj">Manikganj</option>
                      <option value="Munshiganj">Munshiganj</option>
                      <option value="Narayanganj">Narayanganj</option>
                      <option value="Narsingdi">Narsingdi</option>
                      <option value="Rajbari">Rajbari</option>
                      <option value="Shariatpur">Shariatpur</option>
                      <option value="Tangail">Tangail</option>

                      <option value="Brahmanbaria">Brahmanbaria</option>
                      <option value="Comilla">Cumilla</option>
                      <option value="Chandpur">Chandpur</option>
                      <option value="Lakshmipur">Lakshmipur</option>
                      <option value="Noakhali">Noakhali</option>
                      <option value="Feni">Feni</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Cox's Bazar">Cox's Bazar</option>
                      <option value="Khagrachhari">Khagrachhari</option>
                      <option value="Rangamati">Rangamati</option>
                      <option value="Bandarban">Bandarban</option>

                      <option value="Bagerhat">Bagerhat</option>
                      <option value="Chuadanga">Chuadanga</option>
                      <option value="Jashore">Jashore</option>
                      <option value="Jhenaidah">Jhenaidah</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Kushtia">Kushtia</option>
                      <option value="Magura">Magura</option>
                      <option value="Meherpur">Meherpur</option>
                      <option value="Narail">Narail</option>
                      <option value="Satkhira">Satkhira</option>

                      <option value="Bogura">Bogura</option>
                      <option value="Joypurhat">Joypurhat</option>
                      <option value="Naogaon">Naogaon</option>
                      <option value="Natore">Natore</option>
                      <option value="Chapainawabganj">Chapainawabganj</option>
                      <option value="Pabna">Pabna</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Sirajganj">Sirajganj</option>

                      <option value="Dinajpur">Dinajpur</option>
                      <option value="Gaibandha">Gaibandha</option>
                      <option value="Kurigram">Kurigram</option>
                      <option value="Lalmonirhat">Lalmonirhat</option>
                      <option value="Nilphamari">Nilphamari</option>
                      <option value="Panchagarh">Panchagarh</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Thakurgaon">Thakurgaon</option>

                      <option value="Habiganj">Habiganj</option>
                      <option value="Moulvibazar">Moulvibazar</option>
                      <option value="Sunamganj">Sunamganj</option>
                      <option value="Sylhet">Sylhet</option>

                      <option value="Barguna">Barguna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Bhola">Bhola</option>
                      <option value="Jhalokathi">Jhalokathi</option>
                      <option value="Patuakhali">Patuakhali</option>
                      <option value="Pirojpur">Pirojpur</option>

                      <option value="Jamalpur">Jamalpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                      <option value="Netrokona">Netrokona</option>
                      <option value="Sherpur">Sherpur</option>
                    </select>
                  </div>

                  {/* Alternative Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Alternative Phone Number
                      <span className="ml-2 text-xs font-normal text-neutral-400">
                        (Optional)
                      </span>
                    </label>

                    <input
                      type="tel"
                      pattern="01[0-9]{9}"
                      title="Enter a valid 11-digit Bangladeshi mobile number"
                      value={form.alternativePhone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          alternativePhone: e.target.value,
                        })
                      }
                      placeholder="01XXXXXXXXX"
                      className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Delivery Note */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Note for Delivery
                    <span className="ml-2 text-xs font-normal text-neutral-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    rows={1}
                    value={form.deliveryNote}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        deliveryNote: e.target.value,
                      })
                    }
                    placeholder="Example: Please call before delivery."
                    className="w-full resize-none border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <aside className="h-fit space-y-6">

            {/* ORDER SUMMARY */}
            <section className="bg-white p-6 shadow-sm">
              <h2 className="text-xl font-medium">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                {cartItems.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    Your cart is empty.
                  </p>
                ) : (
                  cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div>
                        <p>{item.name}</p>

                        <p className="mt-1 text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <span className="whitespace-nowrap">
                        ৳
                        {(
                          item.price * item.quantity
                        ).toLocaleString("en-BD")}
                      </span>
                    </div>
                  ))
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>

                    <span>
                      ৳{subtotal.toLocaleString("en-BD")}
                    </span>
                  </div>

                  {/* COUPON */}
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium">
                      Coupon Code
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) =>
                          setCoupon(e.target.value)
                        }
                        placeholder="Enter coupon code"
                        className="min-w-0 flex-1 border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-black"
                      />

                      <button
                        type="button"
                        className="border border-black px-4 py-3 text-xs font-semibold tracking-wide transition hover:bg-black hover:text-white"
                      >
                        APPLY
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-between text-sm">
                    <span>Discount</span>
                    <span>৳0</span>
                  </div>

                  <div className="mt-3 flex justify-between text-sm">
                    <span>Delivery Charge</span>

                    <span>
                      ৳{deliveryCharge.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                    <span>Total</span>

                    <span>
                      ৳{total.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* PAYMENT METHOD */}
            <section className="bg-white p-6 shadow-sm">
              <h2 className="text-xl font-medium">
                Payment Method
              </h2>

              <div className="mt-5 space-y-3">

                {/* CASH ON DELIVERY */}
                <label
                  className={`flex cursor-pointer items-center gap-3 border p-4 ${paymentMethod === "cod"
                    ? "border-black"
                    : "border-neutral-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                {/* CARD PAYMENT */}
                <label
                  className={`flex cursor-pointer items-center gap-3 border p-4 ${paymentMethod === "card"
                    ? "border-black"
                    : "border-neutral-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Card Payment
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Pay securely using your debit or credit card.
                    </p>
                  </div>
                </label>

                {/* MOBILE BANKING */}
                <label
                  className={`flex cursor-pointer items-center gap-3 border p-4 ${paymentMethod === "mobile"
                    ? "border-black"
                    : "border-neutral-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="mobile"
                    checked={paymentMethod === "mobile"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Mobile Banking
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Pay using bKash, Nagad or other mobile banking services.
                    </p>
                  </div>
                </label>

              </div>
            </section>

            {/* TERMS */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) =>
                  setTermsAccepted(e.target.checked)
                }
                className="mt-1 h-4 w-4 cursor-pointer"
              />

              <label
                htmlFor="terms"
                className="text-xs leading-5 text-neutral-600"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  target="_blank"
                  className="underline hover:text-black"
                >
                  Terms & Conditions
                </Link>
                ,{" "}
                <Link
                  href="#"
                  target="_blank"
                  className="underline hover:text-black"
                >
                  Refund Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  target="_blank"
                  className="underline hover:text-black"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* PLACE ORDER */}
            <button
              type="submit"
              className="w-full bg-black py-4 text-sm font-semibold tracking-widest text-white transition hover:bg-neutral-700"
            >
              PLACE ORDER
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}