"use client";

import { useCallback, useEffect, useMemo, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { CATEGORIES } from "../categories";

const PAGE_SIZE = 9;

const TAGS = [
  "Bestseller",
  "New",
  "Sale",
  "Limited Edition",
  "Award Winning",
  "Eco Friendly",
];

const TAG_EMOJIS = {
  Bestseller: "🏆",
  New: "✨",
  Sale: "🔥",
  "Limited Edition": "💎",
  "Award Winning": "🥇",
  "Eco Friendly": "🌿",
};

const GENDERS = ["Boy", "Girl", "Unisex"];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Uploaded" },
  { value: "oldest", label: "Oldest Uploaded" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

const defaultFilters = {
  category: "",
  gender: "",
  age: "",
  tags: [],
  brand: "",
  title: "",
  minPrice: "",
  maxPrice: "",
  latestUploaded: true,
  sortBy: "latest",
};

function ShopPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(defaultFilters);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    titles: [],
    brands: [],
    ages: [],
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFirstSyncComplete, setIsFirstSyncComplete] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const buildSearchParams = useCallback((nextFilters, nextPage = 1) => {
    const params = new URLSearchParams();

    params.set("page", String(nextPage));

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (key === "latestUploaded") {
          params.set(key, String(value));
        }
      } else if (Array.isArray(value) && value.length) {
        params.set(key, value.join(","));
      } else if (typeof value === "string" && value.trim()) {
        params.set(key, value.trim());
      }
    });

    return params.toString();
  }, []);

  // Sync filters from URL directly
  useEffect(() => {
    const sortBy = searchParams.get("sortBy") || defaultFilters.sortBy;
    const latestUploadedParam = searchParams.get("latestUploaded");
    const pageFromUrl = Number(searchParams.get("page") || "1");

    setFilters({
      ...defaultFilters,
      category: searchParams.get("category") || "",
      gender: searchParams.get("gender") || "",
      age: searchParams.get("age") || "",
      tags: searchParams.get("tags") ? searchParams.get("tags").split(",") : [],
      brand: searchParams.get("brand") || "",
      title: searchParams.get("title") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortBy,
      latestUploaded:
        latestUploadedParam !== null
          ? latestUploadedParam === "true"
          : sortBy !== "oldest",
    });
    setPagination((prev) => ({
      ...prev,
      currentPage: Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl,
    }));
    setIsFirstSyncComplete(true);
  }, [searchParams]);

  const urlQueryString = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("limit", String(PAGE_SIZE));

    if (!params.get("page")) {
      params.set("page", "1");
    }

    if (!params.get("sortBy")) {
      params.set("sortBy", defaultFilters.sortBy);
    }

    if (!params.get("latestUploaded")) {
      params.set(
        "latestUploaded",
        params.get("sortBy") === "oldest" ? "false" : "true",
      );
    }

    return params.toString();
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/toys?${urlQueryString}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch toys");
      }

      setProducts(data.toys || []);
      setPagination((prev) => ({
        ...prev,
        ...(data.pagination || {}),
      }));
    } catch (fetchError) {
      setError(fetchError.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [urlQueryString]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(
          "/api/toys?page=1&limit=500&latestUploaded=false",
        );
        const data = await response.json();
        if (!response.ok) return;

        const allToys = data.toys || [];
        const uniqueTitles = [
          ...new Set(allToys.map((toy) => toy.title).filter(Boolean)),
        ].sort();
        const uniqueBrands = [
          ...new Set(allToys.map((toy) => toy.brand).filter(Boolean)),
        ].sort();
        const uniqueAges = [
          ...new Set(allToys.map((toy) => toy.age).filter(Boolean)),
        ].sort();

        setFilterOptions({
          titles: uniqueTitles,
          brands: uniqueBrands,
          ages: uniqueAges,
        });
      } catch (_error) {
        // ignore optional filter fetch errors
      }
    };

    fetchFilterOptions();
  }, []);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    const isSelection = type === "radio" || event.target.tagName === "SELECT";

    const next = { ...filters, [name]: value };

    if (name === "sortBy") {
      if (value === "latest") next.latestUploaded = true;
      if (value === "oldest") next.latestUploaded = false;
    }

    setFilters(next);

    if (isSelection) {
      setPagination((p) => ({ ...p, currentPage: 1 }));
      router.push(`${pathname}?${buildSearchParams(next)}`, { scroll: false });
    }
  };

  const handleTagToggle = (tag) => {
    setFilters((prev) => {
      const isSelected = prev.tags.includes(tag);
      const tags = isSelected
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag];
      const next = { ...prev, tags };

      setPagination((p) => ({ ...p, currentPage: 1 }));
      router.push(`${pathname}?${buildSearchParams(next)}`, { scroll: false });

      return next;
    });
  };

  // Debounced effect for text filters
  useEffect(() => {
    if (!isFirstSyncComplete) return;

    const timer = setTimeout(() => {
      const currentParams = buildSearchParams(filters);
      const urlParams = searchParams.toString();

      // Only push if the state-based params are different from URL params
      if (currentParams !== urlParams) {
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        router.push(`${pathname}?${currentParams}`, { scroll: false });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isFirstSyncComplete, filters.title, filters.minPrice, filters.maxPrice]);

  const handleApplyFilters = (event) => {
    if (event) event.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setIsMobileFilterOpen(false); // Close mobile drawer on apply
    router.push(`${pathname}?${buildSearchParams(filters)}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    router.push(pathname, { scroll: false });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: nextPage }));
    router.push(`${pathname}?${buildSearchParams(filters, nextPage)}`, {
      scroll: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const redirectToWhatsapp = (product) => {
    if (!whatsappNumber) {
      alert("Please set NEXT_PUBLIC_WHATSAPP_NUMBER in your env file.");
      return;
    }

    const message = `Hi, I want to buy this toy: ${product.title}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-[1400px]">
        {/* Header matching the picture */}
        {/* <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-[2.5rem] sm:text-5xl font-black text-gray-900 tracking-tight">
            Shop <span className="text-[#f74872]">Grid</span>
          </h1>
        </div> */}

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start relative">
          {/* Main Products Area - Left Side */}
          <div className="flex-1 w-full order-2 lg:order-1">
            {/* Top Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 font-medium gap-4">
              <p>
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {products.length}
                </span>{" "}
                of {pagination.totalItems} products
              </p>
              <div className="flex flex-wrap flex-1 items-center justify-end gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-gray-400">
                    Sort By:
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleChange}
                    className="appearance-none border-none bg-transparent focus:outline-none text-gray-900 font-bold cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error ? (
              <div className="mb-8 rounded-xl border-l-4 border-red-500 bg-red-50 p-6">
                <p className="font-medium text-red-800">{error}</p>
              </div>
            ) : null}

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f74872]/20 border-t-[#f74872]"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                <span className="text-5xl mb-4">🧸</span>
                <h3 className="text-2xl font-bold text-gray-800">
                  No toys found
                </h3>
                <p className="text-gray-500 mt-2 max-w-sm mb-6">
                  We couldn&apos;t find any items matching your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#f74872] text-white rounded-full font-semibold shadow-sm hover:bg-[#d8355b] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product._id}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative"
                  >
                    <Link
                      href={`/shop/${product._id}`}
                      className="block relative aspect-[4/3] bg-gray-100 overflow-hidden shrink-0"
                    >
                      <Image
                        src={
                          product.images?.[0] ||
                          "https://placehold.co/600x400/edf2f7/4a5568?text=No+Preview"
                        }
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {product.tags?.[0] && (
                        <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-gray-900 shadow-sm flex items-center gap-1.5 backdrop-blur-md bg-white/90">
                          {TAG_EMOJIS[product.tags[0]]} {product.tags[0]}
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-col p-6 flex-1">
                      {/* Meta matching the image's meta structure */}
                      <div className="flex flex-wrap items-center text-[13px] font-medium text-gray-500 mb-3 gap-0">
                        {product.brand && (
                          <>
                            <span className="hover:text-[#f74872] transition-colors">
                              {product.brand}
                            </span>
                            <span className="mx-3 w-4 h-[1px] bg-gray-300 rounded-full"></span>
                          </>
                        )}
                        <span className="hover:text-[#f74872] transition-colors">
                          By {product.category || "General"}
                        </span>
                      </div>

                      <Link
                        href={`/shop/${product._id}`}
                        className="block flex-1"
                      >
                        <h3 className="text-xl font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#f74872] transition-colors">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="mt-5 flex items-end justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                            Price
                          </p>
                          <span className="text-2xl font-black text-[#f74872]">
                            ₹
                            {product.price !== undefined
                              ? parseFloat(product.price).toFixed(2)
                              : "0.00"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            redirectToWhatsapp(product);
                          }}
                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 text-white transition-all bg-[#25D366] hover:bg-[#00ff5e] hover:text-white hover:border-[#00ff5e] group/btn"
                          title="Buy via WhatsApp"
                        >
                          <FaWhatsapp />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#f74872] hover:border-[#f74872] disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  &larr;
                </button>
                <div className="flex h-12 px-6 items-center justify-center rounded-full bg-[#f74872] text-white font-bold shadow-md shadow-[#f74872]/20">
                  {pagination.currentPage} / {pagination.totalPages}
                </div>
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#f74872] hover:border-[#f74872] disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6 flex justify-between items-center w-full bg-white p-5 rounded-2xl border border-dashed border-gray-200 order-1 shadow-sm">
            <span className="font-bold text-gray-900 text-lg">
              Filters & Search
            </span>
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="text-white p-2.5 bg-[#f74872] rounded-xl shadow-md shadow-[#f74872]/20"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </button>
          </div>

          {/* Filtering Sidebar - Right Side */}
          <aside
            className={`w-full lg:w-[320px] xl:w-[320px] shrink-0 order-1 lg:order-2 ${isMobileFilterOpen ? "block" : "hidden"} lg:block lg:sticky lg:top-24 lg:z-10`}
          >
            <div className="bg-white border border-gray-200 border-dashed rounded-[10px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              {/* Image styling: Search Products */}
              <div className="relative flex items-center border border-gray-200 bg-white rounded-full px-2 py-2 mb-8 shadow-sm focus-within:border-[#f74872] transition-colors">
                <input
                  type="text"
                  placeholder="Search Products"
                  className="flex-1 bg-transparent px-4 py-1 text-[15px] focus:outline-none text-gray-700 w-full placeholder:text-gray-400"
                  name="title"
                  value={filters.title}
                  onChange={handleChange}
                />
                <button
                  onClick={handleApplyFilters}
                  className="h-10 w-10 shrink-0 rounded-full bg-[#f74872] flex items-center justify-center text-white transition-opacity hover:opacity-90 shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Categories Section - Exactly matching image style */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-5">
                  Categories
                </h3>
                <div className="space-y-3.5">
                  {/* All Categories */}
                  <label className="flex items-center gap-3.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.category === ""}
                      onChange={() => {
                        const next = { ...filters, category: "" };
                        setFilters(next);
                        setPagination((p) => ({ ...p, currentPage: 1 }));
                        router.push(`${pathname}?${buildSearchParams(next)}`, { scroll: false });
                      }}
                      className="peer sr-only"
                    />
                    <div className={`w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center transition-all
                      ${filters.category === ""
                        ? "bg-[#f74872] border-[#f74872]"
                        : "border-gray-200 bg-gray-50 group-hover:border-gray-400"}`}
                    >
                      {filters.category === "" && (
                        <svg className="w-[10px] h-[10px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[15px] leading-none transition-colors ${filters.category === "" ? "text-[#f74872]" : "text-gray-500"}`}>
                      All Categories
                    </span>
                  </label>

                  {/* Individual Categories - multi-select */}
                  {CATEGORIES.map((cat) => {
                    const selected = filters.category
                      .split(",")
                      .filter(Boolean)
                      .includes(cat);

                    const handleCatToggle = () => {
                      const current = filters.category.split(",").filter(Boolean);
                      const updated = selected
                        ? current.filter((c) => c !== cat)
                        : [...current, cat];
                      const next = { ...filters, category: updated.join(",") };
                      setFilters(next);
                      setPagination((p) => ({ ...p, currentPage: 1 }));
                      router.push(`${pathname}?${buildSearchParams(next)}`, { scroll: false });
                    };

                    return (
                      <label key={cat} className="flex items-center gap-3.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={handleCatToggle}
                          className="peer sr-only"
                        />
                        <div className={`w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center transition-all
                          ${selected
                            ? "bg-[#f74872] border-[#f74872]"
                            : "border-gray-200 bg-gray-50 group-hover:border-gray-400"}`}
                        >
                          {selected && (
                            <svg className="w-[10px] h-[10px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-[15px] leading-none transition-colors ${selected ? "text-[#f74872]" : "text-gray-500"}`}>
                          {cat}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Specs Filter Boxed */}
              <div className="mb-10 pt-8 border-t border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-5">
                  Filter by Specs
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">
                      Gender Focus
                    </label>
                    <select
                      name="gender"
                      value={filters.gender}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f74872] text-gray-600 appearance-none cursor-pointer"
                    >
                      <option value="">All Genders</option>
                      {GENDERS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">
                      Age Group
                    </label>
                    <select
                      name="age"
                      value={filters.age}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f74872] text-gray-600 appearance-none cursor-pointer"
                    >
                      <option value="">All Ages</option>
                      {filterOptions.ages.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Filter Boxed */}
              <div className="mb-10 pt-8 border-t border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-5">
                  By Price Range
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleChange}
                      placeholder="Min"
                      min="0"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#f74872] text-black"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleChange}
                      placeholder="Max"
                      min="0"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#f74872] text-black"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="w-full py-3 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f74872]/20 border-t-[#f74872]"></div>
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}