"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const TAG_BADGE_COLORS = {
  Bestseller: "bg-[#ff5d73]",
  Sale: "bg-[#ff5d73]",
  New: "bg-[#72c33a]",
  "Limited Edition": "bg-[#72c33a]",
  "Award Winning": "bg-[#72c33a]",
  "Eco Friendly": "bg-[#72c33a]",
};

const TAG_LABELS = {
  Bestseller: "Best Seller",
  New: "New Launch",
};

const normalizeTag = (tag) =>
  tag
    ? tag
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

const formatTagLabel = (tag) => TAG_LABELS[normalizeTag(tag)] || tag;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

export function ProductTagBadge({ tag }) {
  if (!tag) return null;

  const normalizedTag = normalizeTag(tag);
  const label = formatTagLabel(normalizedTag);

  return (
    <div
      className={`absolute left-0 top-0 z-10 max-w-[85%] truncate px-2.5 py-1.5 text-[11px] font-extrabold uppercase leading-none tracking-[0.01em] text-white shadow-sm rounded-br-[2px] ${
        TAG_BADGE_COLORS[normalizedTag] || "bg-[#ff5d73]"
      }`}
      title={label}
    >
      {label}
    </div>
  );
}

export function PopularPicksArrowButton({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all duration-200 md:h-11 md:w-11 ${
        direction === "left" ? "left-2 md:-left-5" : "right-2 md:-right-5"
      } ${
        disabled
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer hover:scale-110 hover:border-[#E84393] hover:bg-[#E84393] hover:text-white"
      }`}
      aria-label={direction === "left" ? "Previous products" : "Next products"}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="h-4 w-4"
      >
        {direction === "left" ? (
          <path
            d="M15 18l-6-6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M9 18l6-6-6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

export function PopularProductCard({ product, onAddToCart }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/shop/${product._id}`)}
      className="group bg-white overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gray-100">
        <Image
          width={600}
          height={600}
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <ProductTagBadge tag={product.tags?.[0]} />
      </div>

      <div className="p-4 flex flex-col justify-center items-center">
        <h3 className="text-center font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#f74872] transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        <div className="mt-auto">
          {product.price !== undefined && (
            <div className="text-center gap-1 mb-3">
              <span className="text-2xl font-bold text-[#E84393]">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full rounded-full border border-dashed border-[#E84393] py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#E84393] transition-all duration-300 hover:shadow-lg hover:shadow-[#f74872]/30 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#f74872] focus:ring-offset-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCarouselSection({
  titlePrefix,
  titleHighlight,
  items: propsItems,
  loading: propsLoading,
  currentIndex: propsCurrentIndex,
  setCurrentIndex: propsSetCurrentIndex,
  visibleCount: propsVisibleCount,
  apiFilter,
  onAddToCart,
}) {
  // ─── INTERNAL STATES ───────────────────────────────────────────────────────
  const [localItems, setLocalItems] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [internalCurrentIndex, setInternalCurrentIndex] = useState(0);
  const [internalVisibleCount, setInternalVisibleCount] = useState(5);

  // Determine which values to use (props or internal state)
  const items = propsItems || localItems;
  const loading = propsLoading !== undefined ? propsLoading : localLoading;
  const currentIndex = propsCurrentIndex !== undefined ? propsCurrentIndex : internalCurrentIndex;
  const setCurrentIndex = propsSetCurrentIndex || setInternalCurrentIndex;
  const visibleCount = propsVisibleCount || internalVisibleCount;

  const maxIndex = Math.max(0, items.length - visibleCount);

  // ─── DATA FETCHING ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!apiFilter) return;

    async function fetchData() {
      try {
        setLocalLoading(true);
        const res = await fetch(`/api/toys?${apiFilter}&limit=12`);
        const data = await res.json();
        if (data && data.toys) {
          const mapped = data.toys.map((t) => ({
            _id: t._id,
            name: t.title,
            category: t.category,
            image: t.images?.[0] || "https://placehold.co/600x600?text=No+Image",
            price: `₹${parseFloat(t.price || 0).toFixed(2)}`,
            stock: t.stock,
            tags: t.tags || [],
          }));
          setLocalItems(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch products for section", err);
      } finally {
        setLocalLoading(false);
      }
    }
    fetchData();
  }, [apiFilter]);

  // ─── RESPONSIVE HANDLING ───────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setInternalVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setInternalVisibleCount(2);
      } else {
        setInternalVisibleCount(5);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ─── INDEX ADJUSTMENT ──────────────────────────────────────────────────────
  useEffect(() => {
    if (currentIndex > maxIndex && maxIndex >= 0) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex, setCurrentIndex]);

  return (loading || items.length > 0) && (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-14">
      <div className="absolute top-20 hidden md:block">
        <Image
          src="/home page/shape-20.png"
          alt="Toy for kids"
          width={180}
          height={180}
          priority
          className="h-[180px] w-[180px] object-contain animate-floatLeftRight"
        />
      </div>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {titlePrefix} <span className="text-[#f75781]">{titleHighlight}</span>
        </h2>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-0 sm:px-6">
        <PopularPicksArrowButton
          direction="left"
          onClick={() => setCurrentIndex((c) => Math.max(0, c - 1))}
          disabled={currentIndex === 0}
        />

        <div className="overflow-hidden">
          <div
            className={`flex transition-transform duration-500 ease-in-out ${loading ? "py-2" : ""}`}
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {loading
              ? Array.from({ length: visibleCount }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 px-2"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div className="bg-white/60 animate-pulse rounded-2xl h-90 w-full border border-gray-100/50 shadow-sm flex flex-col p-4">
                      <div className="h-48 bg-gray-200/60 rounded-xl w-full mb-4"></div>
                      <div className="h-5 bg-gray-200/60 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200/60 rounded w-1/2 mt-auto mb-3"></div>
                      <div className="h-10 bg-gray-200/60 rounded-full w-full"></div>
                    </div>
                  </div>
                ))
              : items.map((product) => (
                  <div
                    key={product._id}
                    className="shrink-0 px-2 py-2"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div className="h-full shadow-xl shadow-gray-200 rounded-xl overflow-hidden">
                      <PopularProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <PopularPicksArrowButton
          direction="right"
          onClick={() => setCurrentIndex((c) => Math.min(maxIndex, c + 1))}
          disabled={currentIndex === maxIndex}
        />
      </div>
    </section>
  );
}
