export interface PricingItem {
    price: number;
    quantity: number;
    discount: number;
}

/**
 * Returns the discount amount for one item.
 */
export function getItemDiscount(item: PricingItem): number {
    return (item.price * item.discount) / 100;
}

/**
 * Returns the final unit price after discount.
 */
export function getItemFinalPrice(item: PricingItem): number {
    return item.price - getItemDiscount(item);
}

/**
 * Returns the total price for an item before discount.
 */
export function getItemSubtotal(item: PricingItem): number {
    return item.price * item.quantity;
}

/**
 * Returns the total discount for an item.
 */
export function getItemDiscountTotal(item: PricingItem): number {
    return getItemDiscount(item) * item.quantity;
}

/**
 * Returns the final total for an item after discount.
 */
export function getItemTotal(item: PricingItem): number {
    return getItemFinalPrice(item) * item.quantity;
}

/**
 * Returns cart subtotal before discount.
 */
export function calculateSubtotal(items: PricingItem[]): number {
    return items.reduce(
        (total, item) => total + getItemSubtotal(item),
        0
    );
}

/**
 * Returns total product discount.
 */
export function calculateDiscount(
    items: PricingItem[]
): number {
    return items.reduce(
        (total, item) => total + getItemDiscountTotal(item),
        0
    );
}

/**
 * Returns subtotal after product discounts.
 */
export function calculateDiscountedSubtotal(
    items: PricingItem[]
): number {
    return calculateSubtotal(items) - calculateDiscount(items);
}

/**
 * Returns delivery charge.
 */
export function getDeliveryCharge(
    deliveryArea: "inside" | "outside",
    hasItems: boolean
): number {
    if (!hasItems) {
        return 0;
    }

    return deliveryArea === "inside" ? 80 : 150;
}

/**
 * Returns final order total.
 */
export function calculateTotal(
    items: PricingItem[],
    deliveryArea: "inside" | "outside"
): number {
    const discountedSubtotal =
        calculateDiscountedSubtotal(items);

    const deliveryCharge = getDeliveryCharge(
        deliveryArea,
        items.length > 0
    );

    return discountedSubtotal + deliveryCharge;
}