"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);
    setIsSubmitting(true);

    const res = login(identifier, password, rememberMe);

    if (res.success) {
      setToast({ type: "success", message: "Logged in successfully! Redirecting..." });
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    } else {
      setToast({ type: "error", message: res.message || "Invalid credentials." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md border border-neutral-200 bg-white p-8 shadow-xs">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
          Welcome Back
        </p>
        <h1 className="mt-1 text-2xl font-light">Log in to Thread & Form</h1>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`mt-5 rounded-sm p-3 text-xs transition ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
        {/* Identifier (Email or Phone) */}
        <div>
          <label className="mb-1.5 block font-medium uppercase tracking-wider text-neutral-600">
            Email or Phone Number *
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or 017XXXXXXXX"
            className="w-full border border-neutral-300 p-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* Password with Show/Hide Toggle */}
        <div>
          <label className="mb-1.5 block font-medium uppercase tracking-wider text-neutral-600">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-neutral-300 p-3 pr-10 text-sm outline-none transition focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-neutral-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-black h-3.5 w-3.5 cursor-pointer"
            />
            <span>Remember me (30 days)</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-black py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-500">
        Don't have an account?{" "}
        <Link
          href={`/register${redirectUrl !== "/profile" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
          className="font-semibold text-black underline"
        >
          Register Here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-20 text-neutral-900">
      <Suspense fallback={<div className="text-center text-xs text-neutral-400">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}