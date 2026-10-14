"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "../../data/products";
import ProductCard from "../../components/product-card";
import SearchBar from "../../components/shop/search-bar";
import { filterProducts, getProductCategories, type ProductSortOption } from "../../lib/product-filters";

type GenderProp = "ALL" | "MEN" | "WOMEN";

const controlClass =
  "mt-1 w-full rounded-sm border border-neutral-200 bg-white px-2.5 py-2 text-xs text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";

function CollectionContent({ gender = "ALL" }: { gender?: GenderProp }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<GenderProp>(gender);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<ProductSortOption>("relevance");
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);

  const isAllShop = gender === "ALL";

  // Dynamic Page Headers & Breadcrumbs
  const title = isAllShop
    ? "Find your everyday."
    : gender === "MEN"
    ? "Men's collection"
    : "Women's collection";

  const description = isAllShop
    ? "Thoughtful essentials, easy layers, and timeless pieces made to fit your everyday style."
    : gender === "MEN"
    ? "Considered menswear, everyday essentials, and timeless layers made for your own rhythm."
    : "Thoughtful womenswear, easy layers, and modern essentials for wherever the day takes you.";

  // Base product catalog (Men/Women page-e fixed, Shop page-e filter onujayi)
  const collectionProducts = useMemo(() => {
    if (gender !== "ALL") {
      return products.filter((product) => product.gender === gender);
    }
    return products;
  }, [gender]);

  const categoryOptions = useMemo(
    () => getProductCategories(collectionProducts),
    [collectionProducts]
  );

  const displayedProducts = useMemo(
    () =>
      filterProducts(collectionProducts, {
        query: searchQuery,
        gender: isAllShop ? selectedGender : gender,
        category,
        minPrice,
        maxPrice,
        discountedOnly: showDiscountedOnly,
        sortBy,
      }),
    [collectionProducts, searchQuery, isAllShop, selectedGender, gender, category, minPrice, maxPrice, sortBy, showDiscountedOnly]
  );

  const resetFilters = () => {
    setSearchQuery("");
    if (isAllShop) setSelectedGender("ALL");
    setCategory("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("relevance");
    setShowDiscountedOnly(false);
  };

  const invalidPriceRange =
    minPrice.trim() !== "" &&
    maxPrice.trim() !== "" &&
    Number.isFinite(Number(minPrice)) &&
    Number.isFinite(Number(maxPrice)) &&
    Number(minPrice) > Number(maxPrice);

  const hasActiveFilters = Boolean(
    searchQuery ||
      (isAllShop && selectedGender !== "ALL") ||
      category !== "ALL" ||
      minPrice ||
      maxPrice ||
      showDiscountedOnly ||
      sortBy !== "relevance"
  );

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="border-b border-neutral-200 bg-[#f7f6f2]">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500">
            <Link href="/" className="transition hover:text-black">
              Home
            </Link>
            <span>/</span>
            {isAllShop ? (
              <span className="text-neutral-900">Shop all</span>
            ) : (
              <>
                <Link href="/shop" className="transition hover:text-black">
                  Shop all
                </Link>
                <span>/</span>
                <span className="text-neutral-900">
                  {gender === "MEN" ? "Men" : "Women"}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                THREAD & FORM · THE COLLECTION
              </p>
              <h1 className="text-4xl font-light tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                {title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
                {description}
              </p>
            </div>
            <div className="flex gap-5 border-t border-neutral-300 pt-4 text-xs uppercase tracking-[0.14em] md:border-l md:border-t-0 md:pl-6 md:pt-0">
              {isAllShop ? (
                <>
                  <Link href="/men" className="transition hover:text-neutral-500">
                    Shop men ↗
                  </Link>
                  <Link href="/women" className="transition hover:text-neutral-500">
                    Shop women ↗
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={gender === "MEN" ? "/women" : "/men"}
                    className="transition hover:text-neutral-500"
                  >
                    Shop {gender === "MEN" ? "women" : "men"} ↗
                  </Link>
                  <Link href="/shop" className="transition hover:text-neutral-500">
                    Shop all ↗
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8">
          <aside className="h-fit lg:sticky lg:top-6">
            <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">
                Filter & refine
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-neutral-500 underline underline-offset-4 hover:text-black"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Extra Department Filter ONLY for Shop page */}
              {isAllShop && (
                <div>
                  <label
                    htmlFor="collection-department"
                    className="text-xs font-medium text-neutral-800"
                  >
                    Department
                  </label>
                  <select
                    id="collection-department"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value as GenderProp)}
                    className={controlClass}
                  >
                    <option value="ALL">All departments</option>
                    <option value="MEN">Men</option>
                    <option value="WOMEN">Women</option>
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor="collection-category"
                  className="text-xs font-medium text-neutral-800"
                >
                  Category
                </label>

                <select
                  id="collection-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={controlClass}
                >
                  <option value="ALL">All categories</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-800">
                  Price range <span className="font-normal text-neutral-500">(৳)</span>
                </p>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="sr-only" htmlFor="collection-min-price">
                    Minimum price
                  </label>
                  <input
                    id="collection-min-price"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full min-w-0 rounded-sm border border-neutral-200 px-2 py-2 text-xs outline-none transition focus:border-neutral-900"
                  />

                  <label className="sr-only" htmlFor="collection-max-price">
                    Maximum price
                  </label>
                  <input
                    id="collection-max-price"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full min-w-0 rounded-sm border border-neutral-200 px-2 py-2 text-xs outline-none transition focus:border-neutral-900"
                  />
                </div>

                {invalidPriceRange && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    Minimum must not exceed maximum.
                  </p>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-5">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={showDiscountedOnly}
                    onChange={(e) => setShowDiscountedOnly(e.target.checked)}
                    className="h-4 w-4 accent-neutral-950"
                  />
                  <span>Sale items only</span>
                </label>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium" aria-live="polite">
                  {displayedProducts.length}{" "}
                  {displayedProducts.length === 1 ? "piece" : "pieces"}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Considered essentials for your wardrobe
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <div className="w-full sm:w-[290px]">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={
                      isAllShop
                        ? "Search the collection"
                        : `Search ${gender === "MEN" ? "men's" : "women's"} collection`
                    }
                  />
                </div>
                <label className="flex items-center gap-3 text-xs text-neutral-500 sm:whitespace-nowrap">
                  <span className="uppercase tracking-[0.12em]">Sort by</span>
                  <select
                    aria-label="Sort products"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as ProductSortOption)}
                    className="min-w-0 flex-1 border-0 bg-transparent py-2 text-xs text-neutral-900 outline-none focus:ring-0 sm:flex-none"
                  >
                    <option value="relevance">Featured</option>
                    <option value="price-low-high">Price: low to high</option>
                    <option value="price-high-low">Price: high to low</option>
                    <option value="name-a-z">Name: A–Z</option>
                    <option value="newest">New arrivals</option>
                    <option value="discount">Biggest discount</option>
                  </select>
                </label>
              </div>
            </div>

            {hasActiveFilters && !invalidPriceRange && (
              <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-neutral-600">
                <span className="mr-1 uppercase tracking-[0.12em] text-neutral-400">
                  Applied
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900"
                  >
                    Search: {searchQuery} ×
                  </button>
                )}
                {isAllShop && selectedGender !== "ALL" && (
                  <button
                    onClick={() => setSelectedGender("ALL")}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900"
                  >
                    {selectedGender === "MEN" ? "Men" : "Women"} ×
                  </button>
                )}
                {category !== "ALL" && (
                  <button
                    onClick={() => setCategory("ALL")}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900"
                  >
                    {category} ×
                  </button>
                )}
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900"
                  >
                    ৳{minPrice || "0"}–৳{maxPrice || "∞"} ×
                  </button>
                )}
                {showDiscountedOnly && (
                  <button
                    onClick={() => setShowDiscountedOnly(false)}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 hover:border-neutral-900"
                  >
                    Sale items ×
                  </button>
                )}
              </div>
            )}

            {invalidPriceRange ? (
              <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-neutral-300 px-6 text-center">
                <h2 className="text-lg font-medium">Check your price range</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Minimum price should be less than or equal to maximum price.
                </p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-neutral-300 px-6 text-center">
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  No matches this time
                </p>
                <h2 className="text-xl font-light">Nothing found.</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                  Try another search or remove a filter to discover more pieces.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 bg-neutral-950 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-700"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 sm:gap-y-12 xl:grid-cols-3 2xl:grid-cols-4">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CollectionPage({ gender = "ALL" }: { gender?: GenderProp }) {
  return (
    <Suspense
      fallback={<main className="min-h-screen bg-white" aria-label="Loading collection" />}
    >
      <CollectionContent gender={gender} />
    </Suspense>
  );
}