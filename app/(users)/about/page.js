"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Testimonials from "../testimonials";
import "swiper/css";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { PiStarFourFill } from "react-icons/pi";

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

const whyChooseUs = [
  "More than 8 years of industry experience",
  "Wholesale and retail pricing available",
  "Wide range of toys, gifts, stationery, lunch boxes, bags & swimming items",
  "Budget-friendly products with good quality",
  "Bulk order support for retailers, schools, birthday parties & events",
  "Located in Sant Nagar Burari with trusted customer service",
  "Regularly updated collection with new and trending kids' products",
  "Products for all age groups and different gifting needs",
  "Easy shopping for parents, shop owners, and bulk buyers",
  "Focus on useful, attractive, and child-friendly products",
  "Support for return gift planning and product selection",
  "One-stop solution for school essentials, play items & gifting products",
  "Flexible options for small quantity and bulk quantity orders",
  "Trusted for variety, pricing, and product availability",
];

export function AboutInfoSection() {
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
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
            Founded & Managed by{" "}
            <span className="text-pink-500">Jyoti Agrawal</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm leading-relaxed font-medium">
            With over{" "}
            <strong className="text-pink-500">
              8 years of industry experience
            </strong>
            , we serve customers with reliable products, fair pricing, and a
            customer-first approach — understanding what children love, what
            parents look for, and what retailers need.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          {/* What we offer */}
          <div className="bg-white rounded-xl border-2 border-pink-100 p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-5">
              <h3 className="text-2xl font-black text-gray-800">
                What We Offer
              </h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              We provide a complete collection of kids&apos; toys, school
              stationery, lunch boxes, water bottles, return gifts, gift sets,
              swimming accessories, educational toys, puzzles, bags, and many
              more kids&apos; products at both{" "}
              <span className="text-pink-500 font-bold">
                wholesale and retail prices
              </span>
              .
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: "🧸", label: "Toys & Dolls" },
                { icon: "📚", label: "Stationery" },
                { icon: "🎒", label: "Bags & Bottles" },
                { icon: "🎁", label: "Return Gifts" },
                { icon: "🏊", label: "Swimming Items" },
                { icon: "🧩", label: "Puzzles & Kits" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 bg-pink-50 rounded-xl px-3 py-2.5 border border-pink-100"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-bold text-gray-700">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & aim */}
          <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-5">
              <h3 className="text-2xl font-black text-gray-800">
                Where We Are & Our Aim
              </h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Located in{" "}
              <span className="text-blue-500 font-bold">Sant Nagar Burari</span>
              , we focus on delivering products that are useful, attractive,
              budget-friendly, and suitable for different age groups.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Whether you are looking for a single product, birthday return
              gifts, school supplies, or bulk products for resale — we are here
              to provide the right options under one roof.
            </p>
            <div className="mt-6 bg-gradient-to-r from-pink-50 to-blue-50 border-2 border-dashed border-pink-200 rounded-2xl p-4 text-center">
              <p className="text-gray-600 text-sm font-bold italic">
                &ldquo;To bring quality, variety, and happiness to every
                customer through products that make kids smile and make shopping
                easy.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-xl border-2 border-pink-100 p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-8">
            <h3 className="text-3xl font-black text-gray-800">
              Why Choose Us?
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {whyChooseUs.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-pink-50/60 hover:bg-pink-50 border border-pink-100 hover:border-pink-300 rounded-2xl px-4 py-3 transition-all duration-200 group"
              >
                <span className="mt-0.5 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <p className="text-sm font-semibold text-gray-700 leading-snug">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceBadge() {
  const circleText = "8+ Years Experience | 8+ Years Experience | ";

  return (
    <div className="absolute top-4 right-4 md:right-10 z-20 flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white shadow-xl shadow-pink-200/70">
      <div
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "12s" }}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <defs>
            <path
              id="experience-circle"
              d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
            />
          </defs>
          <text
            fill="#ec4899"
            fontSize="8"
            fontWeight="800"
            letterSpacing="2.3"
          >
            <textPath href="#experience-circle" startOffset="0%">
              {circleText}
            </textPath>
          </text>
        </svg>
      </div>

      <div className="relative flex h-[66px] w-[66px] flex-col items-center justify-center rounded-full border-2 border-pink-200 bg-linear-to-br from-pink-50 to-white">
        <span className="text-pink-500 text-xl font-black leading-tight">
          8+
        </span>
        <span className="text-[9px] tracking-[2px] text-gray-400 font-bold uppercase">
          Years
        </span>
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

// function BrandsLoader() {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 gap-5">
//       {/* Animated toy spinner */}
//       <div className="relative w-20 h-20">
//         {/* Outer ring */}
//         <div className="absolute inset-0 rounded-full border-4 border-pink-100" />
//         <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-fuchsia-400 animate-spin" />
//         {/* Inner pulse */}
//         <div className="absolute inset-3 rounded-full bg-pink-50 animate-pulse flex items-center justify-center text-2xl">
//           🧸
//         </div>
//       </div>
//       <div className="text-center">
//         <p className="text-sm font-black text-gray-600">Loading Brands</p>
//         <p className="text-xs text-gray-400 font-semibold mt-1">
//           Gathering toys from our shelves…
//         </p>
//       </div>
//       {/* Bouncing dots */}
//       <div className="flex gap-2">
//         {[0, 1, 2].map((i) => (
//           <div
//             key={i}
//             className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
//             style={{ animationDelay: `${i * 0.15}s` }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// ─── Brands Section ──────────────────────────────────────────────────────────

// export function BrandsSection() {
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function loadBrandsFromToys() {
//       try {
//         // Fetch all toys (high limit so we get all unique brands)
//         const res = await fetch("/api/toys?limit=200&page=1");
//         if (!res.ok) throw new Error("Failed to fetch toys");

//         const data = await res.json();
//         const toys = data.toys || [];

//         // Group toys by brand
//         const map = {};
//         for (const toy of toys) {
//           const brandName = (toy.brand || "").trim();
//           if (!brandName) continue; // skip toys without a brand
//           if (!map[brandName]) map[brandName] = { name: brandName, toys: [] };
//           map[brandName].toys.push(toy);
//         }

//         setBrands(Object.values(map));
//       } catch (e) {
//         setError("Could not load brands. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadBrandsFromToys();
//   }, []);

//   return (
//     <section className="py-20 px-5 bg-gray-50 relative overflow-hidden">
//       {/* Dot pattern */}
//       <div
//         className="absolute inset-0 opacity-[0.04] pointer-events-none"
//         style={{
//           backgroundImage:
//             "radial-gradient(circle, #f2608a 1px, transparent 1px)",
//           backgroundSize: "28px 28px",
//         }}
//       />

//       <div className="max-w-6xl mx-auto relative z-10">
//         {/* Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
//             Shop by <span className="text-pink-500">Brands</span>
//           </h2>
//         </div>

//         {/* States */}
//         {loading ? (
//           <BrandsLoader />
//         ) : error ? (
//           <div className="text-center py-10 text-red-400 bg-red-50 rounded-2xl font-semibold max-w-md mx-auto">
//             ⚠️ {error}
//           </div>
//         ) : brands.length === 0 ? (
//           <div className="text-center py-10 text-gray-400 bg-white rounded-2xl font-semibold max-w-md mx-auto border-2 border-dashed border-gray-200">
//             🎁 No brands found in the catalog yet.
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
//             {brands.map((brand, i) => (
//               <BrandCard key={brand.name} brand={brand} index={i} />
//             ))}
//           </div>
//         )}

//         {/* Footer link */}
//         <div className="text-center mt-12 pt-8 border-t-2 border-dashed border-pink-200">
//           <p className="text-gray-400 text-sm font-semibold">
//             Discover our full collection —{" "}
//             <Link
//               href="/shop"
//               className="text-pink-500 font-black hover:underline"
//             >
//               Browse All Toys →
//             </Link>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

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

            <div className="w-[320px] h-80 md:w-120 md:h-130 rounded-t-full rounded-br-full relative overflow-hidden flex items-end justify-center border-4 border-white shadow-2xl shadow-pink-200">
              <Image
                src="/about/about-1.jpg"
                alt="Toy for kids"
                height={400}
                width={400}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-2 right-4 md:right-8 w-[180px] h-[160px] md:w-[240px] md:h-[240px] rounded-t-full  rounded-bl-full bg-linear-to-br from-blue-200 to-blue-100 overflow-hidden border-[5px] border-white shadow-xl shadow-blue-100 z-10">
              <Image
                src="/about/about-2.jpg"
                alt="Toy for kids"
                height={400}
                width={400}
                className="object-cover"
              />
            </div>

            <ExperienceBadge />
          </div>

          {/* RIGHT: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-4 text-gray-800">
              {/* We are a retail business in the Ecommerce{" "}
              <span className="text-pink-500">Products and accessories</span>{" "}
              for kids */}
              Trusted for kid&apos;s toys, stationery, gifts & everyday
              essentials
              <br />
              <span className="text-pink-500">retail & wholesale.</span>
            </h2>

            <p className="text-gray-500 mb-3 leading-relaxed text-[15px]">
              {/* <span className="text-pink-500 font-bold">Balloon</span>, with a
              rich legacy spanning 12 years, stands as a venerable online
              destination for kids seeking a diverse range of high-quality toys
              and accessories. */}
              Founded and managed by{" "}
              <span className="text-pink-500 font-bold">Jyoti Agrawal</span> ,
              we have been working in this industry for more than 8 years,
              serving customers with reliable products, fair pricing, and a
              customer-first approach.
            </p>

            <p className="text-gray-400 mb-8 leading-relaxed text-sm">
              With years of experience, we understand what children love, what
              parents look for, and what retailers need for their business.
            </p>

            {/* Stats box */}
            <div className="border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-4 text-center bg-white shadow-lg shadow-pink-50">
              <div className="flex-1">
                <h3 className="text-3xl font-black text-pink-500">20+</h3>
                <p className="text-gray-500 text-xs mt-1 font-semibold">
                  All India
                </p>
              </div>
              <div className="hidden md:block w-px bg-pink-100" />
              <div className="flex-1">
                <h3 className="text-3xl font-black text-pink-500">100+</h3>
                <p className="text-gray-500 text-xs mt-1 font-semibold">
                  Active Delivery Partners
                </p>
              </div>
              <div className="hidden md:block w-px bg-pink-100" />
              <div className="flex-1">
                <h3 className="text-3xl font-black text-pink-500">5000+</h3>
                <p className="text-gray-500 text-xs mt-1 font-semibold">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMO TICKER ── */}
      <section className="bg-white">
        <div className="bg-white py-4 overflow-hidden border-3 border-dashed border-[#f5a1c8]">
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
                className="w-auto! flex items-center justify-center pt-3 pb-3"
              >
                <div className="flex flex-row items-center justify-center gap-4">
                  <span className="mx-10 text-2xl font-bold tracking-tight text-slate-900 uppercase whitespace-nowrap md:text-2xl">
                    {t}
                  </span>
                  <PiStarFourFill className="text-slate-900" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <AboutInfoSection />
      {/* <BrandsSection /> */}
      <Testimonials />
    </>
  );
}
