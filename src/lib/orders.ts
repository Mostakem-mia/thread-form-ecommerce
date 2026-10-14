import type { Order } from "../types/order";

const ORDERS_KEY = "orders";
const LEGACY_ORDERS_KEY = "app_all_orders";

function safeParseArray(value: string | null): unknown[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeOrder(value: unknown): Order | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, any>;

  // Current checkout format.
  if (typeof raw.orderId === "string" && raw.customer && Array.isArray(raw.items)) {
    return {
      ...raw,
      userEmail: String(raw.userEmail || raw.customer.email || "").trim().toLowerCase(),
      customer: {
        name: String(raw.customer.name || ""),
        phone: String(raw.customer.phone || ""),
        email: String(raw.customer.email || raw.userEmail || "").trim().toLowerCase(),
      },
      items: raw.items.map((item: Record<string, any>) => ({
        id: String(item.id || ""),
        name: String(item.name || ""),
        price: Number(item.price) || 0,
        discount: Number(item.discount) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        size: String(item.size || ""),
        color: String(item.color || ""),
        image: String(item.image || ""),
      })),
      subtotal: Number(raw.subtotal) || 0,
      deliveryCharge: Number(raw.deliveryCharge) || 0,
      discount: Number(raw.discount) || 0,
      couponDiscount: Number(raw.couponDiscount) || 0,
      total: Number(raw.total) || 0,
      paymentMethod: String(raw.paymentMethod || ""),
      status: String(raw.status || "Pending"),
      createdAt: String(raw.createdAt || raw.date || new Date().toISOString()),
      shipping: {
        area: String(raw.shipping?.area || raw.deliveryArea || ""),
        address: String(raw.shipping?.address || ""),
        alternativePhone: String(raw.shipping?.alternativePhone || ""),
        note: String(raw.shipping?.note || ""),
      },
    } as Order;
  }

  // Legacy app_all_orders format.
  if (typeof raw.id === "string" && Array.isArray(raw.items)) {
    const email = String(raw.userEmail || raw.customer?.email || "").trim().toLowerCase();
    return {
      orderId: raw.id,
      userEmail: email,
      customer: {
        name: String(raw.customer?.name || ""),
        phone: String(raw.customer?.phone || ""),
        email,
      },
      shipping: {
        area: String(raw.deliveryArea || raw.shipping?.area || ""),
        address: String(raw.shipping?.address || ""),
        alternativePhone: String(raw.shipping?.alternativePhone || ""),
        note: String(raw.shipping?.note || ""),
      },
      items: raw.items.map((item: Record<string, any>) => ({
        id: String(item.id || ""),
        name: String(item.name || ""),
        price: Number(item.price) || 0,
        discount: Number(item.discount) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        size: String(item.size || ""),
        color: String(item.color || ""),
        image: String(item.image || ""),
      })),
      subtotal: Number(raw.subtotal) || Number(raw.total) || 0,
      deliveryCharge: Number(raw.deliveryCharge) || 0,
      discount: Number(raw.discount) || 0,
      couponCode: raw.couponCode || null,
      couponDiscount: Number(raw.couponDiscount) || 0,
      total: Number(raw.total) || 0,
      paymentMethod: String(raw.paymentMethod || ""),
      status: String(raw.status || "Pending"),
      createdAt: String(raw.date || raw.createdAt || new Date().toISOString()),
    } as Order;
  }

  return null;
}

export function getAllOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const current = safeParseArray(localStorage.getItem(ORDERS_KEY));
  const legacy = safeParseArray(localStorage.getItem(LEGACY_ORDERS_KEY));
  const normalized = [...current, ...legacy]
    .map(normalizeOrder)
    .filter((order): order is Order => order !== null);

  // De-duplicate orders found in both storage keys.
  const seen = new Set<string>();
  return normalized.filter((order) => {
    const key = order.orderId;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function saveOrder(order: Order): void {
  const existing = getAllOrders();
  const updated = [order, ...existing.filter((item) => item.orderId !== order.orderId)];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  localStorage.setItem("lastOrder", JSON.stringify(order));
}

export function getOrdersForEmail(email: string): Order[] {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return [];
  return getAllOrders()
    .filter((order) => (order.userEmail || order.customer.email).trim().toLowerCase() === normalizedEmail)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function clearOrdersForEmail(email: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  const remaining = getAllOrders().filter(
    (order) => (order.userEmail || order.customer.email).trim().toLowerCase() !== normalizedEmail
  );
  localStorage.setItem(ORDERS_KEY, JSON.stringify(remaining));
  localStorage.removeItem(LEGACY_ORDERS_KEY);
}
