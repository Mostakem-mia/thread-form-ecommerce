export interface PricingItem {
    price: number;
    quantity: number;
    discount: number;
}

export interface Coupon {
    code: string;
    type: "percentage" | "fixed";
    value: number; // percentage (e.g., 10 for 10%) or fixed taka (e.g., 200)
    minSpend?: number;
}

// Available Valid Coupons
export const AVAILABLE_COUPONS: Coupon[] = [
    { code: "SAVE10", type: "percentage", value: 10, minSpend: 1000 },
    { code: "TF200", type: "fixed", value: 200, minSpend: 1500 },
    { code: "WELCOME", type: "fixed", value: 100, minSpend: 500 },
];

/**
 * Rounds a monetary value to 2 decimal places.
 */
export function roundPrice(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getItemDiscount(item: PricingItem): number {
    return roundPrice((item.price * (item.discount || 0)) / 100);
}

export function getItemFinalPrice(item: PricingItem): number {
    return roundPrice(item.price - getItemDiscount(item));
}

export function getItemSubtotal(item: PricingItem): number {
    return roundPrice(item.price * item.quantity);
}

export function getItemDiscountTotal(item: PricingItem): number {
    return roundPrice(getItemDiscount(item) * item.quantity);
}

export function getItemTotal(item: PricingItem): number {
    return roundPrice(getItemFinalPrice(item) * item.quantity);
}

export function calculateSubtotal(items: PricingItem[]): number {
    const sum = items.reduce((total, item) => total + getItemSubtotal(item), 0);
    return roundPrice(sum);
}

export function calculateDiscount(items: PricingItem[]): number {
    const sum = items.reduce((total, item) => total + getItemDiscountTotal(item), 0);
    return roundPrice(sum);
}

export function calculateDiscountedSubtotal(items: PricingItem[]): number {
    return roundPrice(calculateSubtotal(items) - calculateDiscount(items));
}

/**
 * Validates and calculates coupon discount amount based on discounted subtotal.
 */
export function calculateCouponDiscount(
    discountedSubtotal: number,
    couponCode: string
): { isValid: boolean; discount: number; message: string; coupon?: Coupon } {
    if (!couponCode || !couponCode.trim()) {
        return { isValid: false, discount: 0, message: "" };
    }

    const cleanCode = couponCode.trim().toUpperCase();
    const matchedCoupon = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!matchedCoupon) {
        return { isValid: false, discount: 0, message: "Invalid coupon code." };
    }

    if (matchedCoupon.minSpend && discountedSubtotal < matchedCoupon.minSpend) {
        return {
            isValid: false,
            discount: 0,
            message: `Minimum spend of ৳${matchedCoupon.minSpend} required for this coupon.`,
        };
    }

    let discount = 0;
    if (matchedCoupon.type === "percentage") {
        discount = (discountedSubtotal * matchedCoupon.value) / 100;
    } else {
        discount = matchedCoupon.value;
    }

    // Discount subtotal-er cheye beshi hote parbe na
    discount = Math.min(discount, discountedSubtotal);

    return {
        isValid: true,
        discount: roundPrice(discount),
        message: `Coupon "${matchedCoupon.code}" applied successfully!`,
        coupon: matchedCoupon,
    };
}

export function getDeliveryCharge(
    deliveryArea: "inside" | "outside",
    hasItems: boolean
): number {
    if (!hasItems) return 0;
    return deliveryArea === "inside" ? 80 : 150;
}

/**
 * Returns final order total taking coupon discount into account.
 */
export function calculateTotal(
    items: PricingItem[],
    deliveryArea: "inside" | "outside",
    couponDiscount: number = 0
): number {
    const discountedSubtotal = calculateDiscountedSubtotal(items);
    const deliveryCharge = getDeliveryCharge(deliveryArea, items.length > 0);
    const finalSubtotalAfterCoupon = Math.max(0, discountedSubtotal - couponDiscount);

    return roundPrice(finalSubtotalAfterCoupon + deliveryCharge);
}