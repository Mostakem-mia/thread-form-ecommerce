import Link from "next/link";

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    isNew: boolean;
    discount: number;
};

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const discountedPrice =
        product.discount > 0
            ? product.price - (product.price * product.discount) / 100
            : product.price;

    return (
        <div className="group">
            {/* Product Image */}
            <Link href={`/product/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Product Badges */}
                    <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
                        {product.isNew ? (
                            <span className="bg-white px-3 py-1 text-[10px] tracking-widest">
                                NEW
                            </span>
                        ) : (
                            <span></span>
                        )}

                        {product.discount > 0 && (
                            <span className="bg-black px-3 py-1 text-[10px] tracking-widest text-white">
                                {product.discount}% OFF
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="pt-4">
                <p className="mb-1 text-[10px] tracking-[0.2em] text-black/40">
                    {product.category}
                </p>

                <Link href={`/product/${product.id}`}>
                    <h2 className="text-sm font-medium hover:opacity-60">
                        {product.name}
                    </h2>
                </Link>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                    {product.discount > 0 ? (
                        <>
                            <span className="text-sm text-neutral-400 line-through">
                                ৳{product.price.toLocaleString("en-BD")}
                            </span>

                            <span className="text-sm font-medium">
                                ৳{discountedPrice.toLocaleString("en-BD")}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm">
                            ৳{product.price.toLocaleString("en-BD")}
                        </span>
                    )}
                </div>

                {/* View Product */}
                <Link
                    href={`/product/${product.id}`}
                    className="mt-4 inline-block text-xs font-medium tracking-[0.15em] underline underline-offset-4 hover:opacity-60"
                >
                    VIEW PRODUCT
                </Link>
            </div>
        </div>
    );
}