"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Grid } from "swiper/modules";
import Testimonials from "./testimonials";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── DATA ────────────────────────────────────────────────────────────────────

const categories = [
  {
    label: "Indoor Games",
    color: "#2ecc71",
    stroke: "#00b894",
    bg: "#e8f8f0",
    image: "/home page/category-1.png",
  },
  {
    label: "Puzzle Games",
    color: "#f39c12",
    stroke: "#e67e22",
    bg: "#fef9e7",
    image: "/home page/category-2.png",
  },
  {
    label: "Kids Books",
    color: "#9b59b6",
    stroke: "#8e44ad",
    bg: "#f5eef8",
    image: "/home page/category-3.png",
  },
  {
    label: "Balloons Cards",
    color: "#e74c3c",
    stroke: "#c0392b",
    bg: "#fdecea",
    image: "/home page/category-4.png",
  },
  {
    label: "Water Toys",
    color: "#ff69b4",
    stroke: "#e91e8c",
    bg: "#fde7f3",
    image: "/home page/category-5.png",
  },
  {
    label: "Kids Toys",
    color: "#3498db",
    stroke: "#2980b9",
    bg: "#eaf4fc",
    image: "/home page/category-6.png",
  },
  {
    label: "Puzzle Games",
    color: "#f39c12",
    stroke: "#e67e22",
    bg: "#fef9e7",
    image: "/home page/category-2.png",
  },
];

const featuredBanners = [
  {
    tag: "FEATURED",
    label: "Baby Toy's",
    price: "₹0.99",
    bg: "bg-[#F4A261]",
    image: "/home page/feature-1.webp",
  },
  {
    tag: "HOT DEAL",
    label: "Gaming",
    price: "₹34.00",
    bg: "bg-[#2EC4B6]",
    image: "/home page/feature-2.webp",
  },
  {
    tag: "LATEST",
    label: "Accessories",
    price: "₹35.99",
    bg: "bg-[#E76F51]",
    image: "/home page/feature-3.webp",
  },
];

const dealOfDay = [
  {
    name: "3d Cartoon – Toy action Figures of Captain America",
    image: "/home page/deals-1.webp",
  },
  {
    name: "3d Cartoon – Cartoon Hulk with green action",
    image: "/home page/deals-2.webp",
  },
];

const promoTags = [
  "Puzzles ✦",
  "Cubes ✦",
  "Toy Car ✦",
  "Girls Doll ✦",
  "Balloons ✦",
  "Or Plate ✦",
  "Puzzles ✦",
  "Cubes ✦",
  "Toy Car ✦",
  "Girls Doll ✦",
  "Balloons ✦",
  "Or Plate ✦",
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const heroStars = [
  { size: "text-xl", top: "top-10", left: "left-[8%]", delay: "0s" },
  { size: "text-3xl", top: "top-20", left: "left-[42%]", delay: "1.2s" },
  { size: "text-2xl", top: "top-14", right: "right-[12%]", delay: "2.1s" },
  { size: "text-lg", top: "top-[52%]", left: "left-[6%]", delay: "0.8s" },
  { size: "text-4xl", top: "top-[60%]", right: "right-[8%]", delay: "1.7s" },
  { size: "text-xl", top: "bottom-12", left: "left-[34%]", delay: "2.6s" },
];

const Stars = ({ count = 5 }) => (
  <span className="text-[#FFB800] text-xs">
    {"★".repeat(count)}
    {"☆".repeat(5 - count)}
  </span>
);

function ProductRatingStars({ rating }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rating);
        const half = !filled && i - 0.5 <= rating;

        return (
          <svg key={i} viewBox="0 0 20 20" className="h-3 w-3">
            {half && (
              <defs>
                <linearGradient id={`popular-picks-half-${i}`}>
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
            )}
            <path
              fill={
                filled
                  ? "#f59e0b"
                  : half
                    ? `url(#popular-picks-half-${i})`
                    : "#e5e7eb"
              }
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.644 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function KiteSVG() {
  return (
    <svg
      viewBox="0 0 72 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-20 w-16"
    >
      <polygon
        points="36,4 68,38 36,72 4,38"
        fill="#F59E0B"
        stroke="#E88A00"
        strokeWidth="1"
      />
      <polygon points="36,4 68,38 36,38" fill="#EF4444" opacity="0.7" />
      <polygon points="4,38 36,38 36,72" fill="#22C55E" opacity="0.7" />
      <line
        x1="36"
        y1="72"
        x2="28"
        y2="90"
        stroke="#E84393"
        strokeWidth="1.5"
        strokeDasharray="3,3"
      />
      <circle cx="24" cy="88" r="3" fill="#E84393" />
      <circle cx="32" cy="93" r="2" fill="#E84393" />
    </svg>
  );
}

function PopularPicksArrowButton({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all duration-200 ${
        direction === "left" ? "-left-5" : "-right-5"
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

function PopularProductCard({ product, onAddToCart }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/shop/${product._id}`)}
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col cursor-pointer"
    >
      {/* Image Container with overlay effect */}
      <div className="relative overflow-hidden bg-gray-100">
        <Image
          width={300}
          height={300}
          src={product.image}
          alt={product.name}
          className="rounded-t-2xl h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Optional: Category badge on image */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {product.category}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#f74872] transition-colors">
          {product.name}
        </h3>

        {/* Description (optional - if you have product description) */}
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Price and CTA Section */}
        <div className="mt-auto pt-3">
          {product.price !== undefined && (
            <div className="flex items-baseline gap-1 mb-3">
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
            className="w-full rounded-full bg-gradient-to-r from-[#f74872] to-[#E84393] py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#f74872]/30 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#f74872] focus:ring-offset-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  // Touch swipe (removed carousel variables)

  const [activeTab, setActiveTab] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [dealTimer, setDealTimer] = useState({ h: 11, m: 47, s: 22 });
  const [popularProductsList, setPopularProductsList] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [bestsellingProducts, setBestsellingProducts] = useState([]);
  const [bestsellingLoading, setBestsellingLoading] = useState(true);
  const [activeGender, setActiveGender] = useState("Boy");
  const [genderProducts, setGenderProducts] = useState([]);
  const [genderLoading, setGenderLoading] = useState(true);
  const [dealTag, setDealTag] = useState("limited edition");
  const [dealProducts, setDealProducts] = useState([]);
  const [dealLoading, setDealLoading] = useState(true);
  const [popularCurrent, setPopularCurrent] = useState(0);
  const [popularVisible, setPopularVisible] = useState(4);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPopularVisible(1);
      } else if (window.innerWidth < 1024) {
        setPopularVisible(2);
      } else {
        setPopularVisible(4);
      }
    };
    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const popularMaxIndex = Math.max(
    0,
    popularProductsList.length - popularVisible,
  );

  useEffect(() => {
    if (popularCurrent > popularMaxIndex && popularMaxIndex >= 0) {
      setPopularCurrent(popularMaxIndex);
    }
  }, [popularMaxIndex, popularCurrent]);

  useEffect(() => {
    async function fetchPopular() {
      try {
        setPopularLoading(true);
        const res = await fetch("/api/toys?sortBy=latest&limit=12");
        const data = await res.json();
        if (data && data.toys) {
          const mapped = data.toys.map((t) => ({
            _id: t._id,
            name: t.title,
            category: t.category,
            image:
              t.images?.[0] || "https://placehold.co/200x200?text=No+Image",
            price: `₹${parseFloat(t.price || 0).toFixed(2)}`,
            stock: t.stock,
          }));
          setPopularProductsList(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch popular products", err);
      } finally {
        setPopularLoading(false);
      }
    }
    fetchPopular();
  }, []);

  useEffect(() => {
    async function fetchBestselling() {
      try {
        setBestsellingLoading(true);
        const res = await fetch("/api/toys?tags=bestseller&limit=8");
        const data = await res.json();
        if (data && data.toys) {
          const mapped = data.toys.map((t) => ({
            _id: t._id,
            id: t._id,
            name: t.title,
            category: t.category,
            img: t.images?.[0] || "https://placehold.co/200x200?text=No+Image",
            price: `₹${parseFloat(t.price || 0).toFixed(2)}`,
            old: null,
            stock: t.stock,
          }));
          setBestsellingProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch bestselling products", err);
      } finally {
        setBestsellingLoading(false);
      }
    }
    fetchBestselling();
  }, []);

  useEffect(() => {
    async function fetchDealProducts() {
      try {
        setDealLoading(true);
        const res = await fetch(`/api/toys?tags=${encodeURIComponent(dealTag)}&limit=4`);
        const data = await res.json();
        if (data && data.toys) {
          setDealProducts(
            data.toys.map((t) => ({
              _id: t._id,
              name: t.title,
              image: t.images?.[0] || "https://placehold.co/240x240?text=No+Image",
              price: `\u20b9${parseFloat(t.price || 0).toFixed(2)}`,
              stock: t.stock,
            }))
          );
        } else {
          setDealProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch deal products", err);
        setDealProducts([]);
      } finally {
        setDealLoading(false);
      }
    }
    fetchDealProducts();
  }, [dealTag]);

  useEffect(() => {
    async function fetchCollectionProducts() {
      try {
        setGenderLoading(true);
        const res = await fetch(`/api/toys?gender=${encodeURIComponent(activeGender)}&limit=8`);
        const data = await res.json();
        if (data && data.toys) {
          const mapped = data.toys.map((t) => ({
            _id: t._id,
            name: t.title,
            category: t.category,
            image: t.images?.[0] || "https://placehold.co/200x200?text=No+Image",
            price: `₹${parseFloat(t.price || 0).toFixed(2)}`,
            stock: t.stock,
          }));
          setGenderProducts(mapped);
        } else {
          setGenderProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch collection products", err);
        setGenderProducts([]);
      } finally {
        setGenderLoading(false);
      }
    }
    fetchCollectionProducts();
  }, [activeGender]);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const t = setInterval(() => {
      setDealTimer((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const addToCart = (product) => {
    if (!product || !product._id) {
      setCartCount((c) => c + 1);
      return;
    }
    try {
      const stock = Number(product.stock) || 0;
      if (stock <= 0) {
        showToast("This product is out of stock.");
        return;
      }
      const existingRaw = localStorage.getItem("cart_items");
      let existingItems = [];
      if (existingRaw) {
        const parsed = JSON.parse(existingRaw);
        existingItems = Array.isArray(parsed) ? parsed : [];
      }
      const existingIndex = existingItems.findIndex(
        (item) => item.id === product._id,
      );
      if (existingIndex >= 0) {
        const currentQty = Number(existingItems[existingIndex].quantity) || 0;
        existingItems[existingIndex].quantity = Math.min(currentQty + 1, stock);
      } else {
        existingItems.push({ id: product._id, quantity: 1 });
      }
      localStorage.setItem("cart_items", JSON.stringify(existingItems));
      setCartCount((c) => c + 1);
      showToast("Added to cart successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-w-[320px] bg-white text-slate-800 font-sans selection:bg-[#E84393] selection:text-white">
      {/* ── HERO ── */}
      <section className="m-0 p-0 leading-none">
        <Image
          src="/home page/hero-border-2.png"
          alt="Decorative shape divider"
          width={1920}
          height={180}
          priority
          className="block h-auto w-full scale-y-[-1] bg-[#ffcf7d]"
        />
      </section>
      <section className="relative overflow-hidden bg-[#ffcf7d] py-16 px-5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-24 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-[#ff8fc7]/25 blur-3xl" />
          {heroStars.map((star, index) => (
            <span
              key={index}
              className={`absolute ${star.size} ${star.top} ${star.left || ""} ${star.right || ""} text-white/90 drop-shadow-[0_0_18px_rgba(255,255,255,0.75)] animate-hero-star`}
              style={{ animationDelay: star.delay }}
            >
              ✦
            </span>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div
            className={`relative z-10 flex-1 transition-all duration-1000 transform ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="inline-block bg-[#FFE0EE] text-[#E84393] text-[11px] font-black px-4 py-1 rounded-full mb-6 uppercase tracking-widest">
              🎁 Free Delivery on ₹50+
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              The Best Kids
              <br />
              <span className="text-[#E84393]">Toy Store</span>
              <br />
              in the City
            </h1>

            <Link
              href="/shop"
              className="bg-gradient-to-r from-[#E84393] to-[#FF6B6B] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-pink-200 hover:scale-105 active:scale-95 transition-all"
            >
              🛍️ View Shop
            </Link>
          </div>
          <div
            className={`relative z-10 w-100 h-100 md:w-[400px] md:h-[400px] bg-white/95 rounded-full flex items-center justify-center text-[180px] shadow-2xl ring-8 ring-white/40 transition-all duration-1000 delay-200 animate-bounce-slow transform ${heroVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          >
            <span className="absolute left-8 top-12 text-2xl text-[#FFB800] animate-hero-star">
              ★
            </span>
            <span
              className="absolute bottom-16 right-10 text-xl text-[#E84393] animate-hero-star"
              style={{ animationDelay: "1s" }}
            >
              ✦
            </span>
            <Image
              src="/home page/hero-girl.png"
              alt="Hero Toy"
              width={400}
              height={400}
              priority
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="m-0 p-0 leading-none">
        <Image
          src="/home page/hero-border-2.png"
          alt="Decorative shape divider"
          width={1920}
          height={180}
          className="block h-auto w-full bg-[#ffcf7d]"
        />
      </section>

      {/* ── CATEGORIES ── */}
      <section className="relative py-10 px-4 rounded-2xl">
        {/* Decorative elements */}
        <span className="absolute text-2xl" style={{ top: 10, left: 30 }}>
          ⭐
        </span>
        <span className="absolute text-base" style={{ top: 24, left: 52 }}>
          ⭐
        </span>
        <span className="absolute text-xl" style={{ bottom: 12, right: 40 }}>
          🦋
        </span>

        {/* Categories List */}
        <div className="pb-4">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={6}
            loop={true}
            autoplay={{ delay: 2800, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              500: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 6, spaceBetween: 20 },
            }}
            className="px-4 md:px-8"
          >
            {categories.map((c, i) => (
              <SwiperSlide key={`${c.label}-${i}`}>
                <div
                  className="flex flex-col items-center group mx-auto"
                  style={{ width: 140 }}
                >
                  <div className="relative w-50 h-50 p-2">
                    {/* Brushstroke ring SVG */}
                    <svg
                      viewBox="0 0 130 130"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0 w-full h-full"
                    >
                      <circle
                        cx="65"
                        cy="65"
                        r="55"
                        fill="none"
                        stroke={c.color}
                        strokeWidth="14"
                        strokeDasharray="220 120"
                        strokeLinecap="round"
                        opacity="0.9"
                        transform="rotate(-60 65 65)"
                      />
                      <circle
                        cx="65"
                        cy="65"
                        r="55"
                        fill="none"
                        stroke={c.stroke}
                        strokeWidth="8"
                        strokeDasharray="80 260"
                        strokeLinecap="round"
                        opacity="0.6"
                        transform="rotate(100 65 65)"
                      />
                    </svg>

                    {/* image / Image placeholder */}
                    <Image
                      src={c.image}
                      alt={c.label}
                      width={100}
                      height={100}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-30 h-30 rounded-full flex items-center justify-center text-4xl transition-transform duration-200 group-hover:scale-110"
                      style={{ background: c.bg }}
                    />
                  </div>

                  <span className="mt-3 text-xs font-black text-gray-700 uppercase tracking-tight text-center">
                    {c.label}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── FEATURED BANNERS ── */}
      <section className="px-5 pb-16 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredBanners.map((b) => (
          <div
            key={b.label}
            className={`${b.bg} h-auto sm:h-80 rounded-3xl p-4 sm:p-3 flex flex-col sm:flex-row items-center justify-between text-white group hover:-translate-y-2 transition-transform cursor-pointer shadow-xl overflow-hidden gap-4 sm:gap-0`}
          >
            <div className="flex flex-col gap-3 p-2 sm:p-5 items-center text-center sm:items-start sm:text-left w-full sm:w-auto z-10 pt-6 sm:pt-5">
              <span className="inline-block bg-white/30 text-xs font-black px-4 py-1.5 rounded-full w-fit">
                {b.tag}
              </span>
              <h3 className="text-2xl font-black leading-tight">{b.label}</h3>
              <Link
                href="/shop"
                className="text-center bg-white text-slate-800 px-4 py-3 rounded-full text-sm font-black shadow-lg w-fit mt-1 sm:mt-0"
              >
                Shop Now
              </Link>
            </div>

            <div className="h-[200px] sm:h-full w-full sm:w-[220px] shrink-0 flex items-end justify-center group-hover:scale-105 transition-transform duration-500">
              <Image
                src={b.image}
                alt={b.label}
                width={220}
                height={320}
                className="w-full h-full object-cover sm:object-cover sm:object-top"
              />
            </div>
          </div>
        ))}
      </section>

      {/* ── POPULAR PICKS ── */}
      <section
        className="relative overflow-hidden px-6 py-14"
        style={{
          background:
            "linear-gradient(135deg, #fff0f5 0%, #fffbf0 60%, #f5f5f0 100%)",
        }}
      >
        <div className="pointer-events-none absolute left-5 top-5">
          <KiteSVG />
        </div>

        <div className="absolute left-4 top-28 flex h-8 w-8 items-center justify-center rounded-full bg-[#E84393] text-[9px] font-black tracking-wider text-white">
          RTL
        </div>

        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Today&apos;s <span className="text-[#E84393]">popular picks</span>
          </h2>
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6">
          <PopularPicksArrowButton
            direction="left"
            onClick={() => setPopularCurrent((c) => Math.max(0, c - 1))}
            disabled={popularCurrent === 0}
          />

          <div className="overflow-hidden">
            <div
              className={`flex transition-transform duration-500 ease-in-out ${popularLoading ? "py-2" : ""}`}
              style={{
                transform: `translateX(-${popularCurrent * (100 / popularVisible)}%)`,
              }}
            >
              {popularLoading
                ? Array.from({ length: popularVisible }).map((_, i) => (
                    <div
                      key={i}
                      className="shrink-0 px-2"
                      style={{ width: `${100 / popularVisible}%` }}
                    >
                      <div className="bg-white/60 animate-pulse rounded-2xl h-[360px] w-full border border-gray-100/50 shadow-sm flex flex-col p-4">
                        <div className="h-48 bg-gray-200/60 rounded-xl w-full mb-4"></div>
                        <div className="h-5 bg-gray-200/60 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200/60 rounded w-1/2 mt-auto mb-3"></div>
                        <div className="h-10 bg-gray-200/60 rounded-full w-full"></div>
                      </div>
                    </div>
                  ))
                : popularProductsList.map((product) => (
                    <div
                      key={product.name}
                      className="shrink-0 px-2"
                      style={{ width: `${100 / popularVisible}%` }}
                    >
                      <PopularProductCard
                        product={product}
                        onAddToCart={addToCart}
                      />
                    </div>
                  ))}
            </div>
          </div>

          <PopularPicksArrowButton
            direction="right"
            onClick={() =>
              setPopularCurrent((c) => Math.min(popularMaxIndex, c + 1))
            }
            disabled={popularCurrent === popularMaxIndex}
          />

          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: popularMaxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPopularCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === popularCurrent
                    ? "h-2 w-5 bg-[#E84393]"
                    : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to popular picks slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── DEAL OF THE DAY ── */}
      <section className="bg-[#FFF5F9] py-16 px-5">
        <div className="max-w-[1200px] mx-auto">
          {/* Header row: title + timer */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-6">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 text-center md:text-left">
              Deal of <span className="text-[#E84393]">the Day</span>
            </h2>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
                Ends in:
              </span>
              {[dealTimer.h, dealTimer.m, dealTimer.s].map((v, i) => (
                <div
                  key={i}
                  className="bg-slate-900 text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl text-lg sm:text-xl font-black shadow-lg"
                >
                  {pad(v)}
                </div>
              ))}
            </div>
          </div>

          {/* Tag filter pills */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {[
              { tag: "limited edition", label: "👑 Limited Edition", activeColor: "#7c3aed" },
              { tag: "sales", label: "🔥 On Sale", activeColor: "#ef4444" },
            ].map((pill) => (
              <button
                key={pill.tag}
                onClick={() => setDealTag(pill.tag)}
                style={dealTag === pill.tag ? { background: pill.activeColor, color: "#fff", borderColor: pill.activeColor } : {}}
                className={`px-5 py-2 rounded-full text-sm font-black border-2 transition-all duration-200 ${
                  dealTag === pill.tag
                    ? "shadow-lg scale-105"
                    : "border-pink-200 text-slate-600 bg-white hover:border-[#E84393] hover:text-[#E84393]"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Products grid */}
          {dealLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white animate-pulse rounded-[30px] sm:rounded-[40px] h-48 border-4 border-[#FFE0EE]" />
              ))}
            </div>
          ) : dealProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-lg font-bold">
                No deals found for{" "}
                <span className="text-[#E84393]">
                  {dealTag === "limited edition" ? "Limited Edition" : "On Sale"}
                </span>
              </p>
              <p className="text-sm mt-1">
                Tag products with &ldquo;{dealTag}&rdquo; in the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {dealProducts.map((d) => (
                <div
                  key={d._id}
                  className="bg-white p-6 sm:p-8 rounded-[30px] sm:rounded-[40px] flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border-4 border-[#FFE0EE] shadow-xl hover:shadow-2xl transition-all h-full cursor-pointer"
                  onClick={() => router.push(`/shop/${d._id}`)}
                >
                  <div className="w-full sm:w-[45%] max-w-[240px] sm:max-w-none aspect-square relative shrink-0">
                    <Image
                      className="object-cover hover:scale-105 transition-transform duration-500 drop-shadow-md"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={d.image}
                      alt={d.name}
                    />
                  </div>
                  <div className="flex flex-col flex-1 items-center sm:items-start text-center sm:text-left gap-4 w-full">
                    <span
                      className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{
                        background: dealTag === "limited edition" ? "#ede9fe" : "#fee2e2",
                        color: dealTag === "limited edition" ? "#7c3aed" : "#ef4444",
                      }}
                    >
                      {dealTag === "limited edition" ? "👑 Limited Edition" : "🔥 On Sale"}
                    </span>
                    <h3 className="text-lg font-black leading-tight">
                      {d.name}
                    </h3>
                    <Stars />
                    <p className="text-2xl font-black text-[#E84393]">{d.price}</p>
                    <div className="flex gap-3 mt-auto flex-wrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(d);
                        }}
                        className="bg-[#E84393] hover:bg-[#d83a82] text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors shadow-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
                          if (!waNumber) return;
                          const msg = `Hi, I want to buy: ${d.name}`;
                          window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors shadow-sm"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* LEFT BANNER */}
          <div className="md:col-span-1 min-h-[300px] md:min-h-[auto] relative rounded-3xl overflow-hidden shadow-xl">
            {/* Background Image */}
            <Image
              src="/home page/ads-1.jpg"
              alt="toy"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-black/20 opacity-80 backdrop-blur-[2px]"></div>

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-between text-white z-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 drop-shadow-md">
                  Featured
                </p>
                <h2 className="text-3xl md:text-2xl lg:text-3xl font-black mt-2 mb-4 leading-tight drop-shadow-lg">
                  Kid Toy Collection <br /> for Summer
                </h2>

                <Link
                  href="/shop"
                  className="mt-6 bg-white text-orange-500 px-6 py-2.5 rounded-full text-sm font-black hover:scale-105 transition-transform shadow-lg"
                >
                  View Shop
                </Link>
              </div>
            </div>
          </div>
          {/* RIGHT CONTENT */}
          <div className="md:col-span-3 min-w-0">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                Top Selling <span className="text-pink-500">products</span>
              </h2>
            </div>

            {/* SLIDER */}
            <Swiper
              modules={[Navigation, Autoplay, Grid]}
              spaceBetween={20}
              slidesPerView={4}
              navigation
              autoplay={{ delay: 3000 }}
              grid={{
                rows: 2,
                fill: "row",
              }}
              breakpoints={{
                320: { slidesPerView: 1, grid: { rows: 1 }, spaceBetween: 10 },
                640: { slidesPerView: 3, grid: { rows: 1 }, spaceBetween: 15 },
                1024: { slidesPerView: 4, grid: { rows: 2 }, spaceBetween: 20 },
              }}
            >
              {bestsellingLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <SwiperSlide key={`skeleton-${i}`} className="h-auto">
                    <div className="bg-white/60 animate-pulse rounded-2xl h-[360px] w-full border border-gray-100/50 shadow-sm flex flex-col p-4">
                      <div className="h-48 bg-gray-200/60 rounded-xl w-full mb-4"></div>
                      <div className="h-5 bg-gray-200/60 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200/60 rounded w-1/2 mt-auto mb-3"></div>
                      <div className="h-10 bg-gray-200/60 rounded-full w-full"></div>
                    </div>
                  </SwiperSlide>
                ))
              ) : bestsellingProducts.length > 0 ? (
                bestsellingProducts.map((item) => (
                  <SwiperSlide key={item.id} className="h-auto pb-4">
                    <PopularProductCard
                      product={{ ...item, image: item.img }}
                      onAddToCart={addToCart}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="col-span-4 text-center py-12 text-gray-400">
                    <p className="text-lg font-semibold">
                      No bestselling products found.
                    </p>
                    <p className="text-sm mt-1">
                      Tag products with{" "}
                      <span className="font-mono bg-gray-100 px-1 rounded">
                        bestselling
                      </span>{" "}
                      in the admin panel.
                    </p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ── PROMO TICKER ── */}
      <div className="bg-slate-900 py-4 overflow-hidden">
        <style>{`
          .ticker-swiper .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        `}</style>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView="auto"
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={false}
          className="ticker-swiper flex items-center h-full"
        >
          {promoTags.map((t, i) => (
            <SwiperSlide
              key={i}
              className="!w-auto flex items-center justify-center"
            >
              <span className="text-[#FFB800] font-black text-sm mx-10 uppercase tracking-[0.2em] whitespace-nowrap">
                {t}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── PROMO BANNERS ── */}
      <section className="px-5 py-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-5">
          {/* Left Card – Red */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-7 min-h-[220px] group cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#e8294c 0%,#c0123a 100%)",
            }}
          >
            {/* Decorative circle */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute right-4 bottom-4 w-28 h-28 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-500" />

            {/* Text */}
            <div className="relative z-10">
              <h3 className="text-white text-2xl font-black leading-tight drop-shadow">
                Puzzle for Kids
              </h3>
              <p className="text-white/80 text-sm mt-1 mb-6 font-semibold">
                From <span className="text-white font-black">₹50 Only</span>
              </p>
              <Link
                href="/shop"
                className="mt-5 border-2 border-white/60 text-white text-xs font-black px-6 py-2 rounded-full hover:bg-white hover:text-[#e8294c] transition-all duration-300"
              >
                Shop now
              </Link>
            </div>

            {/* Toy image */}
            <div className="absolute right-0 bottom-0 w-[160px] h-[160px] group-hover:scale-105 transition-transform duration-500">
              <Image
                src="/home page/feature-1.webp"
                alt="Puzzle toy"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain object-right-bottom"
              />
            </div>
          </div>

          {/* Middle Card – Blue (Buy One Get One) */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-8 min-h-[220px] group cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#1a9fe0 0%,#0d7cc7 100%)",
            }}
          >
            {/* Wavy decorative blobs */}
            <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-64 h-24 rounded-full bg-white/5" />

            {/* Text */}
            <div className="relative z-10">
              <span className="inline-block bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Special Offer
              </span>
              <h3 className="text-white text-4xl mb-6 font-black leading-tight drop-shadow-sm">
                Buy One
                <br />
                Get One
              </h3>
              <Link
                href="/shop"
                className="mt-5 border-2 border-white/60 text-white text-sm font-black px-8 py-2.5 rounded-full hover:bg-white hover:text-[#1a9fe0] transition-all duration-300"
              >
                Shop now
              </Link>
            </div>

            {/* Toy images collage */}
            <div className="absolute right-6 bottom-4 flex gap-3 items-end z-10 group-hover:scale-105 transition-transform duration-500">
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/40 shadow-xl">
                <Image
                  src="/home page/feature-2.webp"
                  alt="Toy 1"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/40 shadow-xl">
                <Image
                  src="/home page/feature-3.webp"
                  alt="Toy 2"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Card – Green */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-7 min-h-[220px] group cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#22c85e 0%,#16a34a 100%)",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />

            {/* Text */}
            <div className="relative z-10">
              <h3 className="text-white text-2xl font-black leading-tight drop-shadow">
                Puzzle for Kids
              </h3>
              <p className="text-white/80 text-sm mt-1 font-semibold mb-6">
                From <span className="text-white font-black">₹40 Only</span>
              </p>
              <Link
                href="/shop"
                className="mt-5 border-2 border-white/60 text-white text-xs font-black px-6 py-2 rounded-full hover:bg-white hover:text-[#16a34a] transition-all duration-300"
              >
                Shop now
              </Link>
            </div>

            {/* Baby / toy image */}
            <div className="absolute right-0 bottom-0 w-[150px] h-[170px] group-hover:scale-105 transition-transform duration-500">
              <Image
                src="/home page/hero-girl.png"
                alt="Kids toy"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain object-right-bottom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SELECT FROM COLLECTION ── */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[1300px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900">
              Select from <span className="text-[#E84393]">Collection</span>
            </h2>
            <Link
              href="/shop"
              className="text-[#E84393] text-sm font-bold hover:underline transition-all"
            >
              View All
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* ── LEFT: Filter Sidebar ── */}
            <div className="md:w-48 shrink-0">
              <div className="border border-pink-100 rounded-2xl overflow-hidden shadow-sm">
                {[
                  { label: "Boy",    display: "Boys",   emoji: "\uD83D\uDE80", color: "#3b82f6" },
                  { label: "Girl",   display: "Girls",  emoji: "\uD83C\uDF38", color: "#E84393" },
                  { label: "Unisex", display: "Unisex", emoji: "\u2B50",       color: "#f59e0b" },
                ].map((g, idx) => (
                  <button
                    key={g.label}
                    onClick={() => setActiveGender(g.label)}
                    className={`w-full text-left px-5 py-4 text-sm font-bold transition-all duration-200 flex items-center gap-3 ${
                      idx !== 0 ? "border-t border-pink-50" : ""
                    } ${
                      activeGender === g.label
                        ? "bg-[#fff0f7] text-[#E84393] border-l-4 border-[#E84393]"
                        : "text-slate-600 hover:bg-pink-50 hover:text-[#E84393]"
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                      style={{ background: activeGender === g.label ? g.color + "22" : "#f3f4f6" }}
                    >
                      {g.emoji}
                    </span>
                    {g.display}
                  </button>
                ))}
              </div>

              {/* Decorative emoji */}
              <div className="hidden md:flex justify-center mt-6 pointer-events-none select-none">
                <span className="text-[80px] leading-none">
                  {activeGender === "Boy" ? "\uD83D\uDE80" : activeGender === "Girl" ? "\uD83E\uDDF8" : "\uD83C\uDF08"}
                </span>
              </div>
            </div>

            {/* ── RIGHT: Product Grid ── */}
            <div className="flex-1 min-h-[300px]">
              {genderLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 animate-pulse rounded-2xl h-56"
                    />
                  ))}
                </div>
              ) : genderProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                  <span className="text-5xl mb-4">🔍</span>
                  <p className="text-lg font-bold">
                    No products found for{" "}
                    <span className="text-[#E84393]">
                      {activeGender === "Boy" ? "Boys" : activeGender === "Girl" ? "Girls" : "Unisex"}
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    Try tagging products with this gender in the admin panel.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {genderProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => router.push(`/shop/${product._id}`)}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative bg-gray-50 h-44 overflow-hidden">
                        <Image
                          fill
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover p-3 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-3 flex flex-col flex-grow">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                          {product.category || "Toy"}
                        </p>
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#E84393] transition-colors leading-snug">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-[#E84393] font-black text-sm mb-3">
                          {product.price}
                        </p>

                        {/* Action Buttons */}
                        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="bg-[#E84393] hover:bg-[#d83a82] text-white py-1.5 px-3 rounded-full text-[10px] font-bold uppercase transition-colors text-center w-full shadow-sm"
                          >
                            Add to Cart
                          </button>
                          <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}?text=${encodeURIComponent("Hi, I am interested in " + product.name)}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#E84393] text-white px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(232,67,147,0.4)] flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-100">
          <span className="text-xl">✅</span>
          <span className="font-bold text-sm tracking-wide">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
