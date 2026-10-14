export interface OrderItem {
    id: string;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
}

export interface Order {
    orderId: string;
    /** Email used to associate the order with the signed-in account. */
    userEmail?: string;
    customer: {
        name: string;
        phone: string;
        email: string;
    };
    shipping: {
        area: string;
        address: string;
        alternativePhone: string;
        note: string;
    };
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    couponCode?: string | null;
    couponDiscount?: number;
    total: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
}
