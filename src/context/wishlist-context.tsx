"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useAuth } from "@/context/auth-context";

interface WishlistContextType {
  wishlist: Product[];
  isWishlistLoaded: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const LEGACY_WISHLIST_KEY = "app_wishlist";

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isAuthLoaded } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const storageKey = isAuthenticated && user?.email
    ? `app_wishlist_${user.email.trim().toLowerCase()}`
    : null;

  useEffect(() => {
    if (!isAuthLoaded) return;
    setLoadedKey(null);

    if (!storageKey) {
      // Keep account data in storage, but never expose it while logged out.
      setWishlist([]);
      setLoadedKey("guest");
      return;
    }

    try {
      let raw = localStorage.getItem(storageKey);
      // Migrate the old shared wishlist only once, into the first signed-in account.
      if (raw === null) {
        const legacy = localStorage.getItem(LEGACY_WISHLIST_KEY);
        if (legacy !== null) {
          raw = legacy;
          localStorage.setItem(storageKey, legacy);
          localStorage.removeItem(LEGACY_WISHLIST_KEY);
        }
      }
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const validProducts = Array.isArray(parsed) ? parsed.filter(
        (item): item is Product => item !== null && typeof item === "object" &&
          (typeof (item as Product).id === "string" || typeof (item as Product).id === "number") &&
          typeof (item as Product).name === "string"
      ) : [];
      setWishlist(validProducts);
    } catch (error) {
      console.error("Failed to load account wishlist:", error);
      setWishlist([]);
    } finally {
      setLoadedKey(storageKey);
    }
  }, [isAuthLoaded, storageKey]);

  useEffect(() => {
    if (!isAuthLoaded || !storageKey || loadedKey !== storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save account wishlist:", error);
    }
  }, [wishlist, storageKey, loadedKey, isAuthLoaded]);

  const addToWishlist = (product: Product) => {
    if (!isAuthLoaded || !isAuthenticated || !storageKey || loadedKey !== storageKey) return;
    setWishlist((prev) => prev.some((item) => item.id === product.id) ? prev : [...prev, product]);
  };

  const removeFromWishlist = (id: string | number) => {
    if (!isAuthLoaded || !isAuthenticated || !storageKey || loadedKey !== storageKey) return;
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string | number) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlistLoaded: isAuthLoaded && (loadedKey === (storageKey ?? "guest")), addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
