"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateSubtotal, calculateDiscount, calculateDiscountedSubtotal, getDeliveryCharge, calculateTotal, getItemTotal, getItemSubtotal, } from "../../lib/pricing";
import { useCart } from "../../context/cart-context";

type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  discount: number;
};

export default function CheckoutPage() {


  const {
    cartItems,
    loaded,
    deliveryArea,
    setDeliveryArea,
    clearCart,
  } = useCart();

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



  /* =========================
     PRICE CALCULATIONS
  ========================= */

  const subtotal = calculateSubtotal(cartItems);
  const discountAmount = calculateDiscount(cartItems);

  const discountedSubtotal =
    calculateDiscountedSubtotal(cartItems);

  const deliveryCharge = getDeliveryCharge(
    deliveryArea,
    cartItems.length > 0
  );

  const total = calculateTotal(cartItems, deliveryArea);

  /* =========================
     PLACE ORDER
  ========================= */

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

      if (!loaded) {
        return (
          <div className="p-10 text-center">
            Loading checkout...
          </div>
        );
      }
      return;
    }

    const orderId = `TF-${Date.now().toString().slice(-8)}`;

    const paymentName =
      paymentMethod === "cod"
        ? "Cash on Delivery"
        : paymentMethod === "card"
          ? "Card Payment"
          : "Mobile Banking";

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
        discount: item.discount,
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        image: item.image,
      })),

      subtotal,
      deliveryCharge,
      discount: discountAmount,
      total,

      paymentMethod: paymentName,

      status: "Pending",

      createdAt: new Date().toISOString(),
    };

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

    clearCart();

    window.location.href = "/order-success";
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">

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
          {/* =========================
              LEFT SIDE
          ========================= */}

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
                    Full Name
                    <span className="text-red-500">*</span>
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

                  {/* Phone */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone Number
                      <span className="text-red-500">*</span>
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
                    Detailed Address
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    required
                    rows={2}
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
                      City / District
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      required
                      value={form.cityDistrict}
                      onChange={(e) => {
                        const value = e.target.value;

                        setForm({
                          ...form,
                          cityDistrict: value,
                        });

                        const area: "inside" | "outside" =
                          value === "Dhaka" ? "inside" : "outside";

                        setDeliveryArea(area);
                      }}
                      className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                    >
                      <option value="">
                        Select City / District
                      </option>

                      <option value="Bagerhat">Bagerhat</option>
                      <option value="Bandarban">Bandarban</option>
                      <option value="Barguna">Barguna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Bhola">Bhola</option>
                      <option value="Bogura">Bogura</option>
                      <option value="Brahmanbaria">
                        Brahmanbaria
                      </option>
                      <option value="Chandpur">Chandpur</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Chuadanga">Chuadanga</option>
                      <option value="Cox's Bazar">
                        Cox's Bazar
                      </option>
                      <option value="Cumilla">Cumilla</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Dinajpur">Dinajpur</option>
                      <option value="Faridpur">Faridpur</option>
                      <option value="Feni">Feni</option>
                      <option value="Gaibandha">Gaibandha</option>
                      <option value="Gazipur">Gazipur</option>
                      <option value="Gopalganj">Gopalganj</option>
                      <option value="Habiganj">Habiganj</option>
                      <option value="Jamalpur">Jamalpur</option>
                      <option value="Jashore">Jashore</option>
                      <option value="Jhalokathi">Jhalokathi</option>
                      <option value="Jhenaidah">Jhenaidah</option>
                      <option value="Joypurhat">Joypurhat</option>
                      <option value="Khagrachhari">
                        Khagrachhari
                      </option>
                      <option value="Khulna">Khulna</option>
                      <option value="Kishoreganj">
                        Kishoreganj
                      </option>
                      <option value="Kurigram">Kurigram</option>
                      <option value="Kushtia">Kushtia</option>
                      <option value="Lakshmipur">
                        Lakshmipur
                      </option>
                      <option value="Lalmonirhat">
                        Lalmonirhat
                      </option>
                      <option value="Madaripur">Madaripur</option>
                      <option value="Magura">Magura</option>
                      <option value="Manikganj">Manikganj</option>
                      <option value="Meherpur">Meherpur</option>
                      <option value="Moulvibazar">
                        Moulvibazar
                      </option>
                      <option value="Munshiganj">
                        Munshiganj
                      </option>
                      <option value="Mymensingh">
                        Mymensingh
                      </option>
                      <option value="Naogaon">Naogaon</option>
                      <option value="Narail">Narail</option>
                      <option value="Narayanganj">
                        Narayanganj
                      </option>
                      <option value="Narsingdi">
                        Narsingdi
                      </option>
                      <option value="Natore">Natore</option>
                      <option value="Netrokona">Netrokona</option>
                      <option value="Nilphamari">
                        Nilphamari
                      </option>
                      <option value="Noakhali">Noakhali</option>
                      <option value="Pabna">Pabna</option>
                      <option value="Panchagarh">
                        Panchagarh
                      </option>
                      <option value="Patuakhali">
                        Patuakhali
                      </option>
                      <option value="Pirojpur">Pirojpur</option>
                      <option value="Rajbari">Rajbari</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Rangamati">
                        Rangamati
                      </option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Satkhira">Satkhira</option>
                      <option value="Shariatpur">
                        Shariatpur
                      </option>
                      <option value="Sherpur">Sherpur</option>
                      <option value="Sirajganj">
                        Sirajganj
                      </option>
                      <option value="Sunamganj">
                        Sunamganj
                      </option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Tangail">Tangail</option>
                      <option value="Thakurgaon">
                        Thakurgaon
                      </option>
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
                    rows={2}
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

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <aside className="h-fit space-y-6">

            {/* ORDER SUMMARY */}

            <section className="bg-white p-6 shadow-sm">
              <h2 className="text-xl font-medium">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                {cartItems.length === 0 ? (
                  <div>
                    <p className="text-sm text-neutral-500">
                      Your cart is empty.
                    </p>

                    <Link
                      href="/shop"
                      className="mt-4 inline-block text-sm font-medium underline"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex justify-between gap-4 border-b border-neutral-100 pb-4 text-sm last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
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
                      </div>

                      <div className="whitespace-nowrap text-right">
                        {item.discount > 0 ? (
                          <>
                            <p className="text-xs text-neutral-400 line-through">
                              ৳
                              {getItemSubtotal(item).toLocaleString("en-BD")}
                            </p>

                            <p className="font-medium">
                              ৳
                              {getItemTotal(item).toLocaleString("en-BD")}
                            </p>

                            <p className="mt-1 text-xs text-green-600">
                              {item.discount}% OFF
                            </p>
                          </>
                        ) : (
                          <p>
                            ৳
                            {getItemSubtotal(item).toLocaleString("en-BD")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* PRICE SUMMARY */}

                <div className="border-t pt-4">

                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>

                    <span>
                      ৳{subtotal.toLocaleString("en-BD")}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="mt-3 flex justify-between text-sm text-green-600">
                      <span>Product Discount</span>

                      <span>
                        -৳
                        {discountAmount.toLocaleString(
                          "en-BD"
                        )}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex justify-between text-sm">
                    <span>After Discount</span>

                    <span>
                      ৳
                      {discountedSubtotal.toLocaleString(
                        "en-BD"
                      )}
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
                        onClick={() => {
                          if (!coupon.trim()) {
                            alert("Please enter a coupon code.");
                            return;
                          }

                          alert(
                            "Coupon system is not available yet."
                          );
                        }}
                        className="border border-black px-4 py-3 text-xs font-semibold tracking-wide transition hover:bg-black hover:text-white"
                      >
                        APPLY
                      </button>
                    </div>
                  </div>

                  {/* DELIVERY */}

                  <div className="mt-5">
                    <div className="flex justify-between text-sm">
                      <span>Delivery Charge</span>

                      <span>
                        ৳
                        {deliveryCharge.toLocaleString(
                          "en-BD"
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-neutral-400">
                      {deliveryArea === "inside"
                        ? "Inside Dhaka"
                        : "Outside Dhaka"}
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div className="mt-4 flex justify-between border-t pt-4 text-base font-semibold">
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

                {/* COD */}

                <label className="flex cursor-pointer items-center gap-3 border border-neutral-200 p-4 transition hover:border-black">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="h-4 w-4"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </label>

                {/* CARD */}

                <label className="flex cursor-pointer items-center gap-3 border border-neutral-200 p-4 transition hover:border-black">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="h-4 w-4"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Card Payment
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Visa, Mastercard or other supported cards.
                    </p>
                  </div>
                </label>

                {/* MOBILE BANKING */}

                <label className="flex cursor-pointer items-center gap-3 border border-neutral-200 p-4 transition hover:border-black">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile"
                    checked={paymentMethod === "mobile"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="h-4 w-4"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Mobile Banking
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      bKash, Nagad or other supported methods.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* TERMS */}

            <section className="bg-white p-6 shadow-sm">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) =>
                    setTermsAccepted(e.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />

                <span className="text-xs leading-5 text-neutral-600">
                  I agree to the{" "}
                  <span className="font-medium text-black underline">
                    Terms & Conditions
                  </span>
                  ,{" "}
                  <span className="font-medium text-black underline">
                    Refund Policy
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-black underline">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>
            </section>

            {/* PLACE ORDER */}

            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="w-full bg-black px-6 py-4 text-sm font-semibold tracking-widest text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              PLACE ORDER
            </button>

          </aside>
        </form>
      </div>
    </main>
  );
}