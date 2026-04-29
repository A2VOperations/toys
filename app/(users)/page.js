"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Grid } from "swiper/modules";
import Testimonials from "./testimonials";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiStarFourFill } from "react-icons/pi";
import { addItemToCart } from "./cartStorage";
import FacebookVideos from "./components/facebookGallery";
import ProductCarouselSection, {
  PopularProductCard,
  ProductTagBadge,
} from "./components/ProductCarouselSection";

// ─── DATA ────────────────────────────────────────────────────────────────────

const isBannerActive = (banner, now = Date.now()) => {
  if (!banner?.startDate || !banner?.endDate) return false;

  const start = new Date(banner.startDate).getTime();
  const end = new Date(banner.endDate).getTime();

  return now >= start && now <= end;
};

const categories = [
  {
    label: "Card Category",
    color: "#2ecc71",
    stroke: "#00b894",
    bg: "#e8f8f0",
    borderImage: "/home page/shape-11.png",
    image: "/home page/category-1.png",
  },
  {
    label: "Kids Toys",
    color: "#f39c12",
    stroke: "#e67e22",
    bg: "#fef9e7",
    borderImage: "/home page/shape-12.png",
    image: "/home page/category-2.png",
  },
  {
    label: "Return Gifts",
    color: "#9b59b6",
    stroke: "#8e44ad",
    bg: "#f5eef8",
    borderImage: "/home page/shape-13.png",
    image: "/home page/category-3.png",
  },
  {
    label: "School Stationery",
    color: "#e74c3c",
    stroke: "#c0392b",
    bg: "#fdecea",
    borderImage: "/home page/shape-14.png",
    image: "/home page/category-4.png",
  },
  {
    label: "Lunch Boxes",
    color: "#ff69b4",
    stroke: "#e91e8c",
    bg: "#fde7f3",
    borderImage: "/home page/shape-15.png",
    image: "/home page/category-5.png",
  },
  {
    label: "Water Bottles",
    color: "#3498db",
    stroke: "#2980b9",
    bg: "#eaf4fc",
    borderImage: "/home page/shape-16.png",
    image: "/home page/category-6.png",
  },
  {
    label: "School Bags",
    color: "#f39c12",
    stroke: "#e67e22",
    bg: "#fef9e7",
    borderImage: "/home page/shape-12.png",
    image: "/home page/category-2.png",
  },
];

const featuredBanners = [
  {
    tag: "FEATURED",
    label: "School Picks",
    price: "₹0.99",
    bg: "bg-[#0bb31b]",
    image: "/home page/feature-1.webp",
    link: "/shop?category=School Essentials",
  },
  {
    tag: "HOT DEAL",
    label: "Learning Toys",
    price: "₹34.00",
    bg: "bg-[#e81a3c]",
    image: "/home page/feature-2.webp",
    link: "/shop?category=Learning and Education Toys",
  },
  {
    tag: "LATEST",
    label: "Creative Play",
    price: "₹35.99",
    bg: "bg-[#1a6ce8]",
    image: "/home page/feature-3.webp",
    link: "/shop?category=Puzzles and Brain Teasers",
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
  "Puzzles",
  "Cubes",
  "Toy Car",
  "Dolls",
  "Balloons",
  "Or Plate",
  "Puzzles",
  "Cubes",
  "Toy Car",
  "Dolls",
  "Balloons",
  "Or Plate",
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

export default function Home() {
  const router = useRouter();

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
  const [toastMessage, setToastMessage] = useState("");
  const [bannerData, setBannerData] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerTimer, setBannerTimer] = useState({ h: 0, m: 0, s: 0 });

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

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
            img: t.images?.[0] || "https://placehold.co/600x600?text=No+Image",
            price: `₹${parseFloat(t.price || 0).toFixed(2)}`,
            old: null,
            stock: t.stock,
            tags: t.tags || [],
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
        const res = await fetch(
          `/api/toys?tags=${encodeURIComponent(dealTag)}&limit=4`,
        );
        const data = await res.json();
        if (data && data.toys) {
          setDealProducts(
            data.toys.map((t) => ({
              _id: t._id,
              name: t.title,
              image:
                t.images?.[0] || "https://placehold.co/600x600?text=No+Image",
              price: `\u20b9${parseFloat(t.price || 0).toFixed(2)}`,
              stock: t.stock,
              tags: t.tags || [],
            })),
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
        const res = await fetch(
          `/api/toys?gender=${encodeURIComponent(activeGender)}&limit=8`,
        );
        const data = await res.json();
        if (data && data.toys) {
          const mapped = data.toys.map((t) => ({
            _id: t._id,
            name: t.title,
            category: t.category,
            image:
              t.images?.[0] || "https://placehold.co/600x600?text=No+Image",
            price: `₹${parseFloat(t.price || 0).toFixed(2)}`,
            stock: t.stock,
            tags: t.tags || [],
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

  // ── Fetch banner ONCE on mount only ──
  const bannerFetched = useRef(false);
  useEffect(() => {
    if (bannerFetched.current) return;
    bannerFetched.current = true;

    const fetchBanner = async () => {
      try {
        const res = await fetch("/api/banner", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setBannerData(data);
        } else {
          setBannerData(null);
        }
      } catch (err) {
        console.error("Banner fetch failed", err);
        setBannerData(null);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchBanner();
  }, []);

  // ── Countdown timer (only starts when bannerData has dates) ──
  useEffect(() => {
    if (!bannerData?.endDate) return;

    const tick = () => {
      const now = Date.now();
      const start = new Date(bannerData.startDate).getTime();
      const end = new Date(bannerData.endDate).getTime();

      if (now < start || now >= end) {
        setBannerData(null);
        return;
      }

      const diff = end - now;
      setBannerTimer({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [bannerData?.startDate, bannerData?.endDate]);

  const pad = (n) => String(n).padStart(2, "0");

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

  const addToCart = (product) => {
    const result = addItemToCart(product, 1);
    if (result.ok) {
      showToast("Added to cart successfully!");
    } else {
      showToast(result.message || "Failed to add to cart.");
    }
  };

  return (
    <div className="overflow-x-hidden bg-white text-slate-800 font-sans selection:bg-[#E84393] selection:text-white">
      {/* ── HERO ── */}
      <section className="m-0 p-0 leading-none">
        <Image
          src="/home page/hero-border-1.png"
          alt="Decorative shape divider"
          width={1920}
          height={180}
          priority
          className="block h-auto w-full scale-y-[-1] bg-[linear-gradient(78.33deg,#FFCF78_5.9%,#FEE2B1_97.88%)]"
        />
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(78.33deg,#FFCF78_5.9%,#FEE2B1_97.88%)] px-4 py-14 sm:px-5 sm:py-[4.5rem] md:py-[5.5rem]">
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
          <div className="absolute bottom-10 left-5 hidden md:block md:top-60 md:left-5">
            <Image
              src="/home page/shape-4.png"
              alt="toys for kids"
              width={180}
              height={180}
              priority
              className=" object-contain opacity-50"
            />
            <Image
              src="/home page/shape-3.png"
              alt="toys for kids"
              width={150}
              height={150}
              priority
              className="object-contain animate-floatUpDown"
            />
          </div>
          <div className="absolute top-12 right-[58%] hidden md:block">
            <Image
              src="/home page/shape-6.png"
              alt="toys for kids"
              width={130}
              height={130}
              priority
              className="h-[130px] w-[130px] object-contain animate-floatLeftRight"
            />
          </div>

          <div className="absolute right-4 top-10 hidden md:block md:right-10 md:top-20">
            <Image
              src="/home page/shape-7.png"
              alt="toys for kids"
              width={180}
              height={180}
              priority
              className="h-[180px] w-[180px] object-contain"
            />
          </div>
          <div className="absolute right-4 top-24 hidden md:block md:right-10 md:top-45">
            <Image
              src="/home page/shape-8.png"
              alt="toys for kids"
              width={90}
              height={90}
              priority
              className="h-[90px] w-[90px] object-contain animate-floatUpDown"
            />
          </div>
          <div className="absolute bottom-12 right-[20%] hidden md:block">
            <Image
              src="/home page/shape-9.png"
              alt="toys for kids"
              width={80}
              height={80}
              priority
              className="h-[80px] w-[80px] object-contain animate-floatUpDown"
            />
          </div>
          <div className="absolute bottom-0 right-0 hidden md:block">
            <Image
              src="/home page/shape-10.png"
              alt="toys for kids"
              width={200}
              height={200}
              priority
              className="h-[200px] w-[200px] object-contain opacity-50"
            />
          </div>
        </div>
        <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-8 md:flex-row md:gap-8 lg:gap-12">
          <div
            className={`relative z-10 mx-auto flex h-[260px] w-[260px] items-center justify-center rounded-full text-[120px] transition-all duration-1000 delay-200 animate-bounce-slow transform sm:h-[320px] sm:w-[320px] sm:text-[150px] md:mx-4 md:h-[320px] md:w-[320px] lg:mx-12 lg:h-[350px] lg:w-[400px] lg:text-[180px] ${heroVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          >
            <Image
              src="/home page/girl with toys.png"
              alt="toys for kids"
              width={400}
              height={400}
              priority
              className="object-contain"
            />
          </div>
          <div
            className={`relative z-10 flex-1 px-5 text-center md:text-left transition-all duration-1000 transform ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <p className="text-xs mt-2 sm:text-lg lg:text-xl text-orange-600 mb-3 font-extrabold w-fit mx-auto md:mx-0 uppercase">
              Welcome to the World of Joy
            </p>
            <h1 className="mb-4 text-2xl sm:text-4xl md:text-4xl lg:text-6xl font-extrabold leading-[1.1] text-slate-900">
              From Playtime to <br />
              School Time,
              <br />
              <span className="text-[#f52c6c]">We Bring You the Best</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-500 mb-8 leading-relaxed md:text-sm lg:text-lg">
              Discover the ultimate collection of toys, educational stationery,
              and unique return gifts. High-quality kids&apos; essentials
              delivered at prices both shops and parents love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
              <Link
                href="/shop"
                className="bg-white text-[#f52c6c] hover:text-white hover:bg-[#f52c6c] hover:border hover:border-white hover:border-dashed border border-dashed border-pink-500 px-6 py-4 rounded-full font-bold text-md uppercase tracking-widest shadow-lg shadow-pink-200 hover:scale-105 active:scale-95 transition-all"
              >
                View Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="m-0 p-0 leading-none">
        <Image
          src="/home page/hero-border-2.png"
          alt="Decorative shape divider"
          width={1920}
          height={180}
          className="block h-auto w-full bg-[linear-gradient(78.33deg,#FFCF78_5.9%,#FEE2B1_97.88%)]"
        />
      </section>

      {/* ── CATEGORIES ── */}
      <section className="relative overflow-hidden rounded-2xl px-4 py-10">
        <div className="absolute right-5 top-25 hidden md:block">
          <Image
            src="/home page/shape-6.png"
            alt="toys for kids"
            width={150}
            height={150}
            priority
            className="h-[150px] w-[150px] object-contain animate-floatLeftRight"
          />
        </div>
        <span className="absolute left-8 top-0 hidden text-2xl lg:block">
          <Image
            src="/home page/shape-17.png"
            alt="Decorative shape divider"
            width={1920}
            height={180}
            className="block h-auto w-full"
          />
        </span>

        <div className="pb-4 max-w-[1300px] mx-auto">
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
                  <div className="relative" style={{ width: 140, height: 140 }}>
                    <Image
                      src={c.borderImage}
                      alt="Decorative ring"
                      fill
                      className="object-contain"
                    />
                    <Image
                      src={c.image}
                      alt={c.label}
                      width={90}
                      height={90}
                      className="absolute left-21 top-16 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
                      style={{ width: 90, height: 90, background: c.bg }}
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
      <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 pb-14 sm:px-5 md:grid-cols-3 md:pb-16">
        {featuredBanners.map((b) => (
          <div
            key={b.label}
            onClick={() => router.push(b.link)}
            className={`${b.bg} h-auto sm:h-65 rounded-xl flex flex-col sm:flex-row items-center justify-between text-white group hover:-translate-y-2 transition-transform cursor-pointer shadow-xl overflow-hidden gap-4 sm:gap-0`}
          >
            <div className="z-10 mx-auto flex w-full flex-col items-center p-2 pt-6 text-center sm:w-auto sm:p-5 sm:pt-5">
              <span className="inline-block text-xs font-bold rounded-full w-fit">
                {b.tag}
              </span>
              <h3 className="text-3xl font-bold leading-tight">{b.label}</h3>
              <Link
                href={b.link}
                onClick={(e) => e.stopPropagation()}
                className="text-center bg-white/50 text-white border border-dashed px-5 py-2 rounded-full text-md font-black shadow-lg w-fit mt-5 sm:mt-10"
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

      {bannerData && isBannerActive(bannerData) && (
        <section className="relative mx-auto w-full mt-6 sm:mt-10 mb-6 sm:mb-10 sm:px-0">
          <div className="relative overflow-hidden sm:rounded-none shadow-[0_20px_50px_-12px_rgba(232,67,147,0.25)] sm:shadow-[0_32px_80px_-12px_rgba(232,67,147,0.25)]">
            <Swiper
              modules={[Autoplay, Navigation]}
              autoplay={{
                delay: bannerData.timing || 5000,
                disableOnInteraction: false,
              }}
              navigation={
                (bannerData.images || bannerData.urls || []).length > 1
              }
              loop={(bannerData.images || bannerData.urls || []).length > 1}
              className="w-full h-[380px] xs:h-[420px] sm:h-[450px] md:h-[550px] lg:h-[600px]"
            >
              {(bannerData.images || bannerData.urls || []).map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`Banner ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
                      className="object-cover"
                      priority={idx === 0}
                    />

                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 sm:via-black/30 to-black/20 sm:to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/40 sm:to-transparent" />

                    <div className="absolute top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:top-8 sm:right-10 z-20 flex flex-col items-center sm:items-end gap-1.5 sm:gap-3">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full">
                        Offer ends in
                      </span>

                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[
                          { val: pad(bannerTimer.h), label: "HRS" },
                          { val: pad(bannerTimer.m), label: "MIN" },
                          { val: pad(bannerTimer.s), label: "SEC" },
                        ].map((unit, i) => (
                          <div
                            key={unit.label}
                            className="flex items-center gap-1 sm:gap-1.5"
                          >
                            <div className="flex flex-col items-center">
                              <div className="bg-black/55 backdrop-blur-xl border border-white/15 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
                                <span className="text-white text-sm sm:text-xl md:text-2xl font-black tabular-nums tracking-tight">
                                  {unit.val}
                                </span>
                              </div>
                              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/70 mt-0.5 sm:mt-1">
                                {unit.label}
                              </span>
                            </div>
                            {i < 2 && (
                              <span className="text-white/50 text-base sm:text-xl font-black mb-3 sm:mb-4">
                                :
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-0 px-5 sm:px-12 sm:justify-center text-center sm:text-left items-center sm:items-start z-10">
                      <span className="inline-flex items-center gap-2 w-fit mb-3 sm:mb-4 bg-[#E84393]/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping inline-block" />
                        Limited Time Offer
                      </span>

                      <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-xl max-w-xs sm:max-w-md mb-4 sm:mb-6">
                        Shop Our <br className="hidden sm:block" />
                        <span className="text-[#FFD700]">Best Deals</span> Today
                      </h2>

                      <Link
                        href="/shop"
                        className="w-fit bg-white text-[#E84393] hover:bg-[#E84393] hover:text-white border-2 border-white/60 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
                      >
                        Shop Now →
                      </Link>
                    </div>

                    {(bannerData.images || bannerData.urls || []).length >
                      1 && (
                      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                        {(bannerData.images || bannerData.urls || []).map(
                          (_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className={`block h-1.5 rounded-full bg-white transition-all duration-300 ${
                                dotIdx === idx
                                  ? "w-6 opacity-100"
                                  : "w-1.5 opacity-40"
                              }`}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      <ProductCarouselSection
        titlePrefix="New"
        titleHighlight="Arrivals"
        apiFilter="sortBy=latest"
        onAddToCart={addToCart}
      />

      {/* ── DEAL OF THE DAY ── */}
      <section id="dealOf" className="leading-none">
        <Image
          src="/home page/hero-border-2.png"
          alt="Decorative shape divider"
          width={1920}
          height={180}
          priority
          className="block h-auto scale-y-[-1] scale-x-[-1] w-full bg-[#FFE8EE]"
        />
      </section>

        <section className="relative isolate overflow-hidden bg-[#FFE8EE] px-4 py-5 sm:px-5 ">
          <div className="pointer-events-none absolute left-10 top-80 hidden md:block">
            <Image
              src="/home page/shape-24.png"
              alt="Toy for kids"
              width={180}
              height={180}
              priority
              className="h-[180px] w-[180px] object-contain animate-floatUpDown"
            />
          </div>
          <div className="pointer-events-none absolute top-0 right-[70%] hidden md:block">
            <Image
              src="/home page/shape-17.png"
              alt="Toy for kids"
              width={180}
              height={180}
              priority
              className="h-[180px] w-[180px] object-contain"
            />
          </div>
          <div className="pointer-events-none absolute top-0 right-80 hidden md:block">
            <Image
              src="/home page/shape-25.png"
              alt="Toy for kids"
              width={180}
              height={180}
              priority
              className="h-[180px] w-[180px] object-contain animate-floatLeftRight"
            />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-center items-center mb-6 md:mb-8 gap-6">
              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-left md:text-5xl">
                Deal of <span className="text-[#E84393]">the Day</span>
              </h2>
            </div>

            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              {[
                {
                  tag: "limited edition",
                  label: "👑 Limited Edition",
                  activeColor: "#7c3aed",
                },
                { tag: "sales", label: "🔥 On Sale", activeColor: "#ef4444" },
              ].map((pill) => (
                <button
                  key={pill.tag}
                  onClick={() => setDealTag(pill.tag)}
                  style={
                    dealTag === pill.tag
                      ? {
                          background: pill.activeColor,
                          color: "#fff",
                          borderColor: pill.activeColor,
                        }
                      : {}
                  }
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

            {dealLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white animate-pulse rounded-[30px] sm:rounded-[40px] h-48 border-4 border-[#FFE0EE]"
                  />
                ))}
              </div>
          ) : dealProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-lg font-bold">
                No deals found for{" "}
                <span className="text-[#E84393]">
                  {dealTag === "limited edition"
                    ? "Limited Edition"
                    : "On Sale"}
                </span>
              </p>
              <p className="text-sm mt-1">
                Tag products with &ldquo;{dealTag}&rdquo; in the admin panel.
              </p>
            </div>
            ) : (
              <div className="relative px-0 sm:px-12">
                <button className="deal-prev absolute left-1 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-900 shadow-md transition-all duration-200 cursor-pointer active:scale-90 hover:bg-slate-900 hover:text-white sm:flex sm:h-12 sm:w-12">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="h-5 w-5"
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  loop={true}
                  navigation={{
                    prevEl: ".deal-prev",
                    nextEl: ".deal-next",
                  }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 20 },
                    1024: { slidesPerView: 2, spaceBetween: 30 },
                  }}
                  className="deal-swiper"
                >
                  {dealProducts.map((d) => (
                    <SwiperSlide key={d._id} className="pb-8 px-2">
                      <div
                        className="bg-white rounded-[30px] sm:rounded-[40px] flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border-4 border-[#FFE0EE] shadow-xl hover:shadow-2xl transition-all h-full cursor-pointer"
                        onClick={() => router.push(`/shop/${d._id}`)}
                      >
                        <div className="w-full sm:w-[45%] aspect-square relative shrink-0 rounded-t-[20px] sm:rounded-l-[20px] sm:rounded-tr-none overflow-hidden">
                          <ProductTagBadge tag={d.tags?.[0]} />
                          <Image
                            className="object-cover hover:scale-105 transition-transform duration-500 drop-shadow-md rounded-t-[20px] sm:rounded-l-[20px] sm:rounded-tr-none"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            src={d.image}
                            alt={d.name}
                          />
                        </div>
                        <div className="flex flex-col flex-1 items-center sm:items-start text-center sm:text-left gap-4 w-full">
                          <h3 className="text-lg font-black leading-tight">
                            {d.name}
                          </h3>
                          <p className="text-2xl font-black text-[#E84393]">
                            {d.price}
                          </p>
                          <div className="flex gap-3 mt-auto flex-wrap pb-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(d);
                              }}
                              className="rounded-full border border-dashed bg-white px-6 py-2.5 text-xs font-black uppercase tracking-widest text-[#e8569a] shadow-sm transition-colors hover:border-white hover:bg-[#d83a82] hover:text-white"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const waNumber =
                                  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
                                if (!waNumber) return;
                                const msg = `Hi, I want to buy: ${d.name}`;
                                window.open(
                                  `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,
                                  "_blank",
                                );
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors shadow-sm"
                            >
                              WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button className="deal-next absolute right-1 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-900 shadow-md transition-all duration-200 cursor-pointer active:scale-90 hover:bg-slate-900 hover:text-white sm:flex sm:h-12 sm:w-12">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="h-5 w-5"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>
      <section className="m-0 p-0 leading-none">
        <Image
          src="/home page/hero-border-2.png"
          alt="Decorative shape divider"
          width={1920}
          height={180}
          priority
          className="block h-auto w-full scale-y-[-1] scale-x-[-1] bg-[#FFE8EE] rotate-180"
        />
      </section>

      {/* ── Return gifts ── */}
      <ProductCarouselSection
        titlePrefix="Return"
        titleHighlight="Gifts"
        apiFilter={`category=${encodeURIComponent("Return Gifts Ideas")}`}
        onAddToCart={addToCart}
      />

      {/* ── Stationary Items── */}
      <ProductCarouselSection
        titlePrefix="Stationary"
        titleHighlight="Items"
        apiFilter={`category=${encodeURIComponent("Stationary (Return Gifts + Regular)")}`}
        onAddToCart={addToCart}
      />

      {/* ── Classic & Battery Items── */}
      <ProductCarouselSection
        titlePrefix="Classic &"
        titleHighlight="Battery Powered"
        apiFilter={`tags=${encodeURIComponent("Battery Operated")}`}
        onAddToCart={addToCart}
      />

        <section className="relative isolate overflow-hidden bg-white py-14 md:py-16">
          <div className="pointer-events-none absolute right-8 top-0 hidden md:block -z-10 xl:right-20">
            <Image
              src="/home page/shape-26.png"
              alt="toys for kids"
              width={150}
              height={150}
              priority
              className="h-[150px] w-[150px] object-contain animate-floatLeftRight"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* LEFT BANNER */}
            <div className="relative min-h-[260px] overflow-hidden rounded-3xl shadow-xl md:col-span-1 md:min-h-auto">
              <Image
                src="/home page/ads-1.jpg"
                alt="toy for kids"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-80 backdrop-blur-[2px]"></div>
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 text-white md:justify-between md:p-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 drop-shadow-md">
                    Featured
                  </p>
                  <h2 className="mt-2 mb-4 text-2xl font-black leading-tight drop-shadow-lg xl:text-3xl">
                    Kid Toy Collection <br /> for Summer
                  </h2>
                  <Link
                    href="/shop"
                    className="mt-6 inline-block bg-white text-orange-500 text-center px-5 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-black hover:scale-105 transition-transform shadow-lg"
                  >
                    View Shop
                  </Link>
                </div>
              </div>
            </div>
            {/* RIGHT CONTENT */}
            <div className="md:col-span-3 min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                  Best Selling <span className="text-pink-500">products</span>
                </h2>
              </div>

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

      {/* School Essentials */}
      <ProductCarouselSection
        titlePrefix="School"
        titleHighlight="Essentials"
        apiFilter={`category=${encodeURIComponent("School Essentials")}`}
        onAddToCart={addToCart}
      />

      {/* Stationary (Return Gifts + Regular) */}
      <ProductCarouselSection
        titlePrefix="Stationary"
        titleHighlight="(Return Gifts + Regular)"
        apiFilter={`category=${encodeURIComponent("Stationary (Return Gifts + Regular)")}`}
        onAddToCart={addToCart}
      />


  

      {/* ── PROMO TICKER ── */}
      <section className="relative isolate my-12 overflow-visible -rotate-2 md:my-20 md:-rotate-5">
        <div className="pointer-events-none absolute -top-[180px] left-10 z-10 hidden md:block">
          <Image
            src="/home page/shape-33.png"
            alt="Toy for kids"
            width={200}
            height={200}
            priority
            className="h-[200px] w-[200px] object-contain animate-floatUpDown"
          />
        </div>
        <div className="pointer-events-none absolute -top-[170px] right-10 z-10 hidden md:block">
          <Image
            src="/home page/shape-29.png"
            alt="Toy for kids"
            width={180}
            height={180}
            priority
            className="h-[180px] w-[180px] object-contain animate-floatUpDown"
          />
        </div>
        <div className="m-0 p-0 leading-none">
          <Image
            src="/home page/shape-32.png"
            alt="Decorative shape divider"
            width={1920}
            height={180}
            priority
            className="block h-auto w-full scale-y-[-1]"
          />
        </div>

        <div className="overflow-hidden  py-3 sm:py-4">
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
                className="w-auto! flex items-center justify-center"
              >
                <div className="flex flex-row items-center justify-center gap-4">
                  <span className="mx-6 text-lg font-bold tracking-tight text-slate-900 uppercase whitespace-nowrap sm:mx-8 sm:text-xl md:mx-10 md:text-2xl">
                    {t}
                  </span>
                  <PiStarFourFill className="text-slate-900" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="m-0 p-0 leading-none">
          <Image
            src="/home page/shape-32.png"
            alt="Decorative shape divider"
            width={1920}
            height={180}
            priority
            className="block h-auto w-full"
          />
        </div>
      </section>



      {/* ── PROMO BANNERS ── */}
      <section className="relative isolate mx-auto  overflow-hidden px-4 py-12 sm:px-5">
        <div className="pointer-events-none absolute right-0 top-0 hidden md:block">
          <Image
            src="/home page/shape-27.png"
            alt="Toy for kids"
            width={180}
            height={180}
            priority
            className=" object-contain animate-floatUpDown"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-5 max-w-[1400px] mx-auto">
          {/* Left Card – Red */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-7 min-h-[220px] group cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#e8294c 0%,#c0123a 100%)",
            }}
          >
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute right-4 bottom-4 w-28 h-28 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              <h3 className="text-white  text-2xl font-black leading-tight drop-shadow mb-5">
                Puzzle for Kids
              </h3>
              <Link
                href="/shop"
                className="mt-5 border-2 bg-white/80 border-gray-900 text-gray-900 text-xs font-black px-6 py-2 rounded-full hover:border-[#e8294c] hover:text-[#e8294c] transition-all duration-300"
              >
                Shop now
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 w-[160px] h-[160px] group-hover:scale-105 transition-transform duration-500">
              <Image
                src="/home page/feature-1.webp"
                alt="Puzzle toy"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain object-bottom-right"
              />
            </div>
          </div>

          {/* Middle Card – Blue */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-8 min-h-[220px] group cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#1a9fe0 0%,#0d7cc7 100%)",
            }}
          >
            <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-64 h-24 rounded-full bg-white/5" />
            <div className="relative z-10">
              <span className="inline-block bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Special Offer
              </span>
              <h3 className="text-white text-4xl mb-6 font-black leading-tight drop-shadow-sm z-1000">
                Buy One
                <br />
                Get One
              </h3>
              <Link
                href="/shop"
                className="mt-5 border-2 bg-white/80 border-gray-900 text-gray-900 text-sm font-black px-8 py-2.5 rounded-full hover:bg-white hover:text-[#1a9fe0] transition-all duration-300"
              >
                Shop now
              </Link>
            </div>
            <div className="absolute right-6 bottom-4 flex gap-3 items-end z-10 group-hover:scale-105 transition-transform duration-500">
              <div className="relative w-24 h-24 rounded-full overflow-hidden hidden xl:block lg:block ring-4 ring-white/40 shadow-xl md:hidden">
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
            <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
            <div className="relative z-10">
              <h3 className="text-white text-2xl font-black leading-tight drop-shadow mb-5">
                Puzzle for Kids
              </h3>
              <Link
                href="/shop"
                className="mt-5 border-2 bg-white/80 border-gray-900 text-gray-900 text-xs font-black px-6 py-2 rounded-full hover:bg-white hover:text-[#16a34a] transition-all duration-300"
              >
                Shop now
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 w-[150px] h-[170px] group-hover:scale-105 transition-transform duration-500">
              <Image
                src="/home page/girl with toys.png"
                alt="Kids toy"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain object-bottom-right"
              />
            </div>
          </div>
        </div>
      </section>


          {/* Puzzles and Brain Teasers */}
      <ProductCarouselSection
        titlePrefix="Puzzles &"
        titleHighlight="Brain Teasers"
        apiFilter={`category=${encodeURIComponent("Puzzles and Brain Teasers")}`}
        onAddToCart={addToCart}
      />

      {/* Outdoor and Sports Toys */}
      <ProductCarouselSection
        titlePrefix="Outdoor &"
        titleHighlight="Sports Toys"
        apiFilter={`category=${encodeURIComponent("Outdoor & Sports")}`}
        onAddToCart={addToCart}
      />

      {/* ── SELECT FROM COLLECTION ── */}
      <section className="relative isolate overflow-hidden bg-white px-4 py-14 sm:px-5 md:py-16">
        <div className="pointer-events-none absolute hidden -z-10 md:block">
          <Image
            src="/home page/shape-28.png"
            alt="Toy for kids"
            width={400}
            height={400}
            priority
            className="h-[200px] w-[200px] object-contain animate-floatUpDown"
          />
        </div>
        <div className="pointer-events-none absolute top-2 right-[35%] hidden -z-10 md:block">
          <Image
            src="/home page/shape-30.png"
            alt="Toy for kids"
            width={400}
            height={400}
            priority
            className="h-[200px] w-[200px] object-contain animate-floatUpDown"
          />
        </div>
        <div className="relative z-10 max-w-[1300px] mx-auto">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-slate-900 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
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
            <div className="shrink-0 md:w-48">
              <div className="bg-white border border-pink-100 rounded-lg overflow-hidden shadow-sm">
                {[
                  {
                    label: "Boy",
                    display: "Boys",
                    emoji: "\uD83D\uDE80",
                    color: "#3b82f6",
                  },
                  {
                    label: "Girl",
                    display: "Girls",
                    emoji: "\uD83C\uDF38",
                    color: "#E84393",
                  },
                  {
                    label: "Unisex",
                    display: "Unisex",
                    emoji: "\u2B50",
                    color: "#f59e0b",
                  },
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
                      style={{
                        background:
                          activeGender === g.label ? g.color + "22" : "#f3f4f6",
                      }}
                    >
                      {g.emoji}
                    </span>
                    {g.display}
                  </button>
                ))}
              </div>

              <div className="hidden md:flex justify-center mt-6 pointer-events-none select-none">
                <span className="text-[80px] leading-none">
                  {activeGender === "Boy"
                    ? "\uD83D\uDE80"
                    : activeGender === "Girl"
                      ? "\uD83E\uDDF8"
                      : "\uD83C\uDF08"}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-75">
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
                      {activeGender === "Boy"
                        ? "Boys"
                        : activeGender === "Girl"
                          ? "Girls"
                          : "Unisex"}
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    Try tagging products with this gender in the admin panel.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 rounded-xl border border-dashed border-[#E84393] bg-white sm:grid-cols-2 lg:grid-cols-4">
                  {genderProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => router.push(`/shop/${product._id}`)}
                      className="group bg-white overflow-hidden border border-gray-100 rounded-xl transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      <div className="relative bg-gray-50 h-44 overflow-hidden">
                        <ProductTagBadge tag={product.tags?.[0]} />
                        <Image
                          fill
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-3 flex flex-col grow ">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                          {product.category || "Toy"}
                        </p>
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#E84393] transition-colors leading-snug">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-[#E84393] font-black text-sm mb-3">
                          {product.price}
                        </p>
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

      {/* Soft and Plush Toys */}
      <ProductCarouselSection
        titlePrefix="Soft &"
        titleHighlight="Plush Toys"
        apiFilter={`category=${encodeURIComponent("Soft and Plush Toys")}`}
        onAddToCart={addToCart}
      />


      <FacebookVideos />

      {/* <Testimonials /> */}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-max -translate-x-1/2 transform items-center gap-3 rounded-full bg-[#E84393] px-4 py-3 text-white opacity-100 shadow-[0_10px_40px_rgba(232,67,147,0.4)] transition-all duration-300 translate-y-0 sm:bottom-10 sm:w-auto sm:px-6">
          <span className="text-xl">✅</span>
          <span className="font-bold text-sm tracking-wide">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
