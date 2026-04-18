"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Testimonials from "../testimonials";
import "swiper/css";
import Link from "next/link";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getBrandIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("lego") || n.includes("block")) return "🟥";
  if (n.includes("bear") || n.includes("teddy")) return "🧸";
  if (n.includes("car") || n.includes("wheel") || n.includes("speed"))
    return "🚗";
  if (n.includes("doll") || n.includes("barbie") || n.includes("dream"))
    return "🪆";
  if (n.includes("puzzle") || n.includes("brain")) return "🧩";
  if (n.includes("art") || n.includes("craft")) return "🎨";
  if (n.includes("sport") || n.includes("ball") || n.includes("outdoor"))
    return "⚽";
  if (n.includes("science") || n.includes("lab")) return "🔬";
  if (n.includes("music")) return "🎵";
  if (n.includes("robot") || n.includes("robo") || n.includes("tech"))
    return "🤖";
  const fallbacks = [
    "🧸",
    "🎮",
    "🚀",
    "🎨",
    "🪁",
    "🎪",
    "🏆",
    "🌟",
    "🎁",
    "🎯",
  ];
  let hash = 0;
  for (const c of name) hash = (hash << 5) - hash + c.charCodeAt(0);
  return fallbacks[Math.abs(hash) % fallbacks.length];
}

function getCategoryEmoji(category = "") {
  const cat = category.toLowerCase();
  if (cat.includes("car")) return "🚗";
  if (cat.includes("doll")) return "🪆";
  if (cat.includes("puzzle")) return "🧩";
  if (cat.includes("art") || cat.includes("craft")) return "🎨";
  if (cat.includes("sport") || cat.includes("outdoor")) return "⚽";
  if (cat.includes("science")) return "🔬";
  if (cat.includes("music")) return "🎵";
  if (cat.includes("robot")) return "🤖";
  if (cat.includes("animal") || cat.includes("bear") || cat.includes("stuff"))
    return "🧸";
  if (cat.includes("block")) return "🟥";
  return "🎁";
}

// ─── Category Carousel ───────────────────────────────────────────────────────

const categories = [
  { icon: "🚗", label: "Toy Car" },
  { icon: "👗", label: "Girls Doll" },
  { icon: "🎈", label: "Balloons" },
  { icon: "🎨", label: "Color Plate" },
  { icon: "🧩", label: "Puzzles" },
  { icon: "🧸", label: "Stuffed Toys" },
  { icon: "🤖", label: "Robots" },
  { icon: "🏏", label: "Sports" },
  { icon: "🎵", label: "Music Toys" },
  { icon: "🔬", label: "Science Kits" },
  { icon: "🚗", label: "Toy Car" },
  { icon: "👗", label: "Girls Doll" },
  { icon: "🎈", label: "Balloons" },
  { icon: "🎨", label: "Color Plate" },
  { icon: "🧩", label: "Puzzles" },
  { icon: "🧸", label: "Stuffed Toys" },
  { icon: "🤖", label: "Robots" },
  { icon: "🏏", label: "Sports" },
  { icon: "🎵", label: "Music Toys" },
  { icon: "🔬", label: "Science Kits" },
  { icon: "🚗", label: "Toy Car" },
  { icon: "👗", label: "Girls Doll" },
  { icon: "🎈", label: "Balloons" },
  { icon: "🎨", label: "Color Plate" },
  { icon: "🧩", label: "Puzzles" },
  { icon: "🧸", label: "Stuffed Toys" },
  { icon: "🤖", label: "Robots" },
  { icon: "🏏", label: "Sports" },
  { icon: "🎵", label: "Music Toys" },
  { icon: "🔬", label: "Science Kits" },
];

export function CategoryCarousel() {
  const doubled = [...categories, ...categories, ...categories];
  return (
    <div className="bg-white border-y-2 border-pink-100 py-4 overflow-hidden">
      <div className="flex w-max scrollX hover:[animation-play-state:paused]">
        {doubled.map((cat, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-7 border-r-2 border-dashed border-pink-100 cursor-pointer group shrink-0 select-none"
          >
            <span className="text-xl group-hover:scale-125 transition-transform duration-200">
              {cat.icon}
            </span>
            <span className="text-sm font-bold text-gray-700 whitespace-nowrap tracking-wide group-hover:text-pink-500 transition-colors">
              {cat.label}
            </span>
            <span className="text-pink-400 font-black text-base ml-1">+</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Brand Card ──────────────────────────────────────────────────────────────

function BrandCard({ brand, index }) {
  const icon = getBrandIcon(brand.name);
  const count = brand.toys.length;

  // Collect unique categories for this brand
  const uniqueCategories = [
    ...new Set(brand.toys.map((t) => t.category).filter(Boolean)),
  ];
  const primaryCategory = uniqueCategories[0] || "";

  // Up to 3 product previews — use image if available, else emoji
  const previews = brand.toys.slice(0, 3);

  return (
    <div
      className="group relative bg-white rounded-2xl border-2 border-gray-100 overflow-hidden cursor-pointer
        transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-200/60 hover:border-pink-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top colored bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* HOT badge */}
      <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
        ✨ HOT
      </span>

      <div className="p-5 flex flex-col items-center text-center gap-3">
        {/* Brand icon */}
        <div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50 border-2 border-pink-100 flex items-center justify-center text-3xl
          group-hover:scale-110 group-hover:border-pink-300 group-hover:shadow-md transition-all duration-300"
        >
          {icon}
        </div>

        {/* Product preview strip */}
        <div className="flex gap-1.5 justify-center">
          {previews.map((toy, i) =>
            toy.images?.[0] ? (
              <div
                key={i}
                className="w-9 h-9 rounded-xl border-2 border-pink-100 bg-pink-50 overflow-hidden flex items-center justify-center
                group-hover:border-pink-300 group-hover:scale-105 transition-all duration-200"
              >
                <Image
                  src={toy.images[0]}
                  alt={toy.title || "toy"}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                key={i}
                className="w-9 h-9 rounded-xl border-2 border-pink-100 bg-pink-50 flex items-center justify-center text-base
                group-hover:border-pink-300 group-hover:scale-105 transition-all duration-200"
              >
                {getCategoryEmoji(toy.category)}
              </div>
            ),
          )}
          {/* Fill empty slots if fewer than 3 toys */}
          {Array.from({ length: Math.max(0, 3 - previews.length) }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center text-gray-200 text-base"
              >
                +
              </div>
            ),
          )}
        </div>

        {/* Brand name */}
        <div>
          <h4 className="text-sm font-black text-gray-800 group-hover:text-pink-500 transition-colors duration-200 truncate max-w-[120px]">
            {brand.name}
          </h4>
          {primaryCategory && (
            <span className="inline-block mt-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
              {primaryCategory}
            </span>
          )}
        </div>

        {/* Item count */}
        <div className="w-full bg-gradient-to-r from-pink-50 to-fuchsia-50 border border-pink-100 rounded-xl px-3 py-1.5 flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-semibold">
            Products
          </span>
          <span className="text-sm font-black text-pink-500">{count}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Center Suspense Spinner ─────────────────────────────────────────────────

function BrandsLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      {/* Animated toy spinner */}
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-pink-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-fuchsia-400 animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-3 rounded-full bg-pink-50 animate-pulse flex items-center justify-center text-2xl">
          🧸
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-black text-gray-600">Loading Brands</p>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          Gathering toys from our shelves…
        </p>
      </div>
      {/* Bouncing dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Brands Section ──────────────────────────────────────────────────────────

export function BrandsSection() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBrandsFromToys() {
      try {
        // Fetch all toys (high limit so we get all unique brands)
        const res = await fetch("/api/toys?limit=200&page=1");
        if (!res.ok) throw new Error("Failed to fetch toys");

        const data = await res.json();
        const toys = data.toys || [];

        // Group toys by brand
        const map = {};
        for (const toy of toys) {
          const brandName = (toy.brand || "").trim();
          if (!brandName) continue; // skip toys without a brand
          if (!map[brandName]) map[brandName] = { name: brandName, toys: [] };
          map[brandName].toys.push(toy);
        }

        setBrands(Object.values(map));
      } catch (e) {
        setError("Could not load brands. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadBrandsFromToys();
  }, []);

  return (
    <section className="py-20 px-5 bg-[#f5f1e6] relative overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #f2608a 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-3">
            🏆 Our Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-800">
            Shop by <span className="text-pink-500">Brands</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-semibold">
            Handpicked collection of the world's most beloved toy brands
          </p>
        </div>

        {/* States */}
        {loading ? (
          <BrandsLoader />
        ) : error ? (
          <div className="text-center py-10 text-red-400 bg-red-50 rounded-2xl font-semibold max-w-md mx-auto">
            ⚠️ {error}
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl font-semibold max-w-md mx-auto border-2 border-dashed border-gray-200">
            🎁 No brands found in the catalog yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {brands.map((brand, i) => (
              <BrandCard key={brand.name} brand={brand} index={i} />
            ))}
          </div>
        )}

        {/* Footer link */}
        <div className="text-center mt-12 pt-8 border-t-2 border-dashed border-pink-200">
          <p className="text-gray-400 text-sm font-semibold">
            Discover our full collection —{" "}
            <Link href="/shop" className="text-pink-500 font-black hover:underline">
              Browse All Toys →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function AboutSection() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#fdf8f2] via-[#fde8ef] to-[#e6f6fd] py-20 px-5 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-100 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center relative z-10">
          {/* LEFT: Image cluster */}
          <div className="relative flex justify-center md:justify-start">
            <span className="absolute top-4 left-4 text-2xl animate-bounce z-10">
              ⭐
            </span>
            <span className="absolute bottom-8 left-16 text-lg animate-bounce [animation-delay:0.7s] z-10">
              🌈
            </span>

            <div className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-br from-pink-200 to-pink-100 relative overflow-hidden flex items-end justify-center border-4 border-white shadow-2xl shadow-pink-200">
              <Image
                src="/about/about-1.jpg"
                alt="girl"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-[-20px] right-4 md:right-8 w-[150px] h-[150px] md:w-[190px] md:h-[190px] rounded-full bg-gradient-to-br from-blue-200 to-blue-100 overflow-hidden border-[5px] border-white shadow-xl shadow-blue-100 z-10">
              <Image
                src="/about/about-2.jpg"
                alt="boy"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute top-6 right-6 md:right-12 w-[90px] h-[90px] rounded-full bg-white border-2 border-pink-200 shadow-lg flex flex-col items-center justify-center z-20">
              <span className="text-pink-500 text-xl font-black leading-tight">
                30+
              </span>
              <span className="text-[9px] tracking-[2px] text-gray-400 font-bold uppercase">
                Years
              </span>
            </div>
          </div>

          {/* RIGHT: Text */}
          <div>
            <span className="inline-block bg-pink-100 text-pink-500 text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              ✨ Our Story
            </span>

            <h2 className="text-3xl md:text-4xl font-black leading-snug mb-4 text-gray-800">
              We are a retail business in the Ecommerce{" "}
              <span className="text-pink-500">Products and accessories</span>{" "}
              for kids
            </h2>

            <p className="text-gray-500 mb-3 leading-relaxed text-[15px]">
              <span className="text-pink-500 font-bold">Balloon</span>, with a
              rich legacy spanning 12 years, stands as a venerable online
              destination for kids seeking a diverse range of high-quality toys
              and accessories.
            </p>

            <p className="text-gray-400 mb-8 leading-relaxed text-sm">
              All products in our inventory undergo rigorous quality checks to
              meet or exceed industry standards — instilling confidence in every
              purchase you make.
            </p>

            {/* Stats box */}
            <div className="border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-4 text-center bg-white shadow-lg shadow-pink-50">
              <div className="flex-1">
                <h3 className="text-3xl font-black text-pink-500">25+</h3>
                <p className="text-gray-500 text-xs mt-1 font-semibold">
                  Retail Stores in the City
                </p>
              </div>
              <div className="hidden md:block w-px bg-pink-100" />
              <div className="flex-1">
                <h3 className="text-3xl font-black text-pink-500">300+</h3>
                <p className="text-gray-500 text-xs mt-1 font-semibold">
                  Active Delivery Partners
                </p>
              </div>
              <div className="hidden md:block w-px bg-pink-100" />
              <div className="flex-1">
                <h3 className="text-3xl font-black text-pink-500">120+</h3>
                <p className="text-gray-500 text-xs mt-1 font-semibold">
                  Brands and Companies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryCarousel />
      <BrandsSection />
      <Testimonials />
    </>
  );
}
