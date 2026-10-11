import { Product } from "../types/product";

export function searchProducts(
    products: Product[],
    query: string
): Product[] {
    const normalizedQuery = query
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

    if (!normalizedQuery) {
        return [];
    }

    const searchTerms = normalizedQuery.split(" ");

    return products
        .map((product) => {
            const name = product.name.toLowerCase();
            const gender = product.gender.toLowerCase();
            const category = product.category.toLowerCase();
            const subcategory = product.subcategory.toLowerCase();
            const description = product.description.toLowerCase();
            const colors = product.colors
                .join(" ")
                .toLowerCase();
            const sizes = product.sizes
                .join(" ")
                .toLowerCase();

            const searchableText = [
                name,
                gender,
                category,
                subcategory,
                description,
                colors,
                sizes,
            ].join(" ");

            // Search-এর সব শব্দ product-এর মধ্যে থাকতে হবে
            const allTermsMatch = searchTerms.every((term) =>
                searchableText.includes(term)
            );

            if (!allTermsMatch) {
                return null;
            }

            let score = 0;

            // Exact gender search
            if (gender === normalizedQuery) {
                score += 100;
            }

            // Exact product name
            if (name === normalizedQuery) {
                score += 100;
            }

            // Product name
            if (name.startsWith(normalizedQuery)) {
                score += 60;
            }

            if (name.includes(normalizedQuery)) {
                score += 40;
            }

            // Category
            if (category === normalizedQuery) {
                score += 30;
            }

            if (category.includes(normalizedQuery)) {
                score += 20;
            }

            // Subcategory
            if (subcategory === normalizedQuery) {
                score += 30;
            }

            if (subcategory.includes(normalizedQuery)) {
                score += 20;
            }

            // Gender
            if (gender.includes(normalizedQuery)) {
                score += 20;
            }

            // Description
            if (description.includes(normalizedQuery)) {
                score += 10;
            }

            // Colors
            if (colors.includes(normalizedQuery)) {
                score += 10;
            }

            // Sizes
            if (sizes.includes(normalizedQuery)) {
                score += 5;
            }

            return {
                product,
                score,
            };
        })
        .filter(
            (
                result
            ): result is {
                product: Product;
                score: number;
            } => result !== null
        )
        .sort((a, b) => b.score - a.score)
        .map((result) => result.product);
}