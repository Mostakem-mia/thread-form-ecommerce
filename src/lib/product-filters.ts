import type { Product } from "../types/product";
import { getItemFinalPrice } from "./pricing";
import { searchProducts } from "./search";

export type ProductSortOption =
  | "relevance"
  | "price-low-high"
  | "price-high-low"
  | "name-a-z"
  | "newest"
  | "discount";

export type ProductFilterOptions = {
  query?: string;
  gender?: "ALL" | Product["gender"];
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  discountedOnly?: boolean;
  sortBy?: ProductSortOption;
};

/** The single filtering/sorting implementation shared by Shop, Men and Women. */
export function filterProducts(
  sourceProducts: Product[],
  options: ProductFilterOptions = {}
): Product[] {
  const {
    query = "",
    gender = "ALL",
    category = "ALL",
    minPrice = "",
    maxPrice = "",
    discountedOnly = false,
    sortBy = "relevance",
  } = options;

  let result = query.trim()
    ? searchProducts(sourceProducts, query)
    : [...sourceProducts];

  if (gender !== "ALL") {
    result = result.filter((product) => product.gender === gender);
  }

  if (category !== "ALL") {
    const normalizedCategory = category.trim().toLowerCase();
    result = result.filter(
      (product) => product.subcategory.trim().toLowerCase() === normalizedCategory
    );
  }

  const minimum = minPrice.trim() === "" ? null : Number(minPrice);
  const maximum = maxPrice.trim() === "" ? null : Number(maxPrice);
  const finalPrice = (product: Product) =>
    getItemFinalPrice({ price: product.price, discount: product.discount, quantity: 1 });

  if (minimum !== null && Number.isFinite(minimum) && minimum >= 0) {
    result = result.filter((product) => finalPrice(product) >= minimum);
  }
  if (maximum !== null && Number.isFinite(maximum) && maximum >= 0) {
    result = result.filter((product) => finalPrice(product) <= maximum);
  }
  if (discountedOnly) {
    result = result.filter((product) => product.discount > 0);
  }

  // Sort a fresh array so the source catalog and search ranking are not mutated.
  switch (sortBy) {
    case "price-low-high":
      result.sort((a, b) => finalPrice(a) - finalPrice(b));
      break;
    case "price-high-low":
      result.sort((a, b) => finalPrice(b) - finalPrice(a));
      break;
    case "name-a-z":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "discount":
      result.sort((a, b) => b.discount - a.discount);
      break;
    case "relevance":
    default:
      // Keep the relevance order returned by searchProducts when searching.
      break;
  }

  return result;
}

export function getProductCategories(sourceProducts: Product[]): string[] {
  return Array.from(new Set(sourceProducts.map((product) => product.subcategory))).sort(
    (a, b) => a.localeCompare(b)
  );
}
