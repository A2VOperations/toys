"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SUBCATEGORIES,
} from "@/constants/productCategories";
import { getCartCount } from "./cartStorage";

/* ── WhatsApp from .env ── */
const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9643399433";
const waLink = `https://wa.me/${waNumber.replace(/\D/g, "")}`;

/* Featured 9 categories for the image grid */
const GRID_CATEGORIES = [
  {
    label: "Bestseller",
    href: "/shop?tags=Bestseller",
    img: "/navbar/imgs1.jpg",
    emoji: "🔥",
  },
  {
    label: "New Arrivals",
    href: "/shop?tags=New",
    img: "/navbar/imgs2.jpg",
    emoji: "🆕",
  },
  {
    label: "Sale",
    href: "/shop?tags=Sale",
    img: "/navbar/imgs3.jpg",
    emoji: "🚗",
  },
  {
    label: "Limited Edition",
    href: "/shop?tags=Limited Edition",
    img: "/navbar/imgs4.png",
    emoji: "🧩",
  },
  {
    label: "Award Winning",
    href: "/shop?tags=Award Winning",
    img: "/navbar/imgs5.png",
    emoji: "🏆",
  },
  {
    label: "Eco Friendly",
    href: "/shop?tags=Eco Friendly",
    img: "/navbar/imgs6.png",
    emoji: "🌱",
  },
  {
    label: "Battery Operated",
    href: "/shop?category=Battery Operated Toys",
    img: "/navbar/imgs8.png",
    emoji: "👶",
  },
  {
    label: "Toys",
    href: "/shop?category=Toys",
    img: "/navbar/imgs7 (2).png",
    emoji: "📚",
  },
];

const ALL_SIDEBAR_CATEGORIES = PRODUCT_CATEGORIES.map((cat) => ({
  label: cat,
  path: cat,
}));

const AGE_RANGES = [
  { label: "0 – 12 Months", path: "0,1" },
  { label: "1 – 2 Years", path: "1,2" },
  { label: "3 – 4 Years", path: "3,4" },
  { label: "5 – 7 Years", path: "5,6,7" },
  { label: "8 – 10 Years", path: "8,9,10" },
  {
    label: "11+ Years",
    path: "11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
  },
];

const PRICE_RANGES = [
  { label: "Under ₹500", href: "/shop?maxPrice=500" },
  { label: "₹500 – ₹1000", href: "/shop?minPrice=500&maxPrice=1000" },
  { label: "₹1000 – ₹2000", href: "/shop?minPrice=2000" },
  // { label: "₹2000 – ₹3000", href: "/shop?minPrice=2000&maxPrice=3000" },
  // { label: "Above ₹3000", href: "/shop?minPrice=3000" },
];

const SERVICES = [
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "100% secure payments with trusted gateways.",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    desc: "Hassle-free returns within 7 days.",
  },
  { icon: "⚡", title: "Fast Delivery", desc: "Quick delivery across India." },
];

const BOTTOM_BADGES = [
  { icon: "🎁", title: "Exclusive Deals", desc: "Best offers on top toys" },
  {
    icon: "🏆",
    title: "Award Winning Toys",
    desc: "Curated for happy learning",
  },
  {
    icon: "🛡️",
    title: "Child Safe & Non-Toxic",
    desc: "Made with safe materials",
  },
  {
    icon: "🌱",
    title: "Eco-Friendly Toys",
    desc: "Sustainable & environment friendly",
  },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Shop", path: "/shop" },
  { name: "Contact", path: "/contact" },
];

/* ── Icons ── */
const WaIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const FbIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const IgIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

/* ── Announcement Bar ── */
function AnnouncementBar() {
  return (
    <div
      className="relative w-full min-h-9 overflow-hidden flex items-center px-3 md:px-6"
      style={{
        background:
          "linear-gradient(90deg, #b5105a 0%, #e84393 45%, #ff6b9d 75%, #e84393 100%)",
        backgroundSize: "200% 100%",
        animation: "ann-bg 8s linear infinite",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes ann-bg {
          0%   { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        .ann-divider {
          width: 1px; height: 14px;
          background: rgba(255,255,255,0.4);
          margin: 0 10px; flex-shrink: 0;
        }
      `}</style>

      <div className="hidden md:flex items-center gap-1 text-white text-[0.78rem] font-semibold whitespace-nowrap flex-1">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="ml-1">Open Hours: 9am – 10pm</span>
        <div className="ann-divider" />
      </div>

      <Link
        href="/#dealOf"
        className="flex-1 md:flex-none text-white text-[0.75rem] sm:text-[0.78rem] md:text-[0.82rem] whitespace-nowrap text-center"
      >
        Today&apos;s Deals –{" "}
        <strong className="font-extrabold">Click to Save More</strong>
      </Link>

      <div className="hidden sm:flex items-center gap-1 text-white text-[0.78rem] font-semibold whitespace-nowrap flex-1 justify-end">
        <div className="flex items-center gap-2">
          {[
            {
              href: `https://wa.me/${waNumber}`,
              Icon: WaIcon,
              label: "WhatsApp",
            },
            {
              href: "https://www.facebook.com/people/Toys-for-kids/61560423274946/?rdid=FVWBSZ0jg6g1tcUF&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DuTiFczCU%2F",
              Icon: FbIcon,
              label: "Facebook",
            },
            {
              href: "https://www.instagram.com/toys_for_kids_wholeseller?utm_source=qr&igsh=MW10b29jMHpmbjV6eg%3D%3D",
              Icon: IgIcon,
              label: "Instagram",
            },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   Main Navbar
   ════════════════════════════════════════ */
export default function Navbar({ onCartClick }) {
  const [localCartCount, setLocalCartCount] = useState(0);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopSubmenu, setMobileShopSubmenu] = useState(false);
  const [hoveredSidebarCat, setHoveredSidebarCat] =
    useState("All Toys & Games");
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const megaRef = useRef(null);
  const timerRef = useRef(null);
  const pathname = usePathname();
  const [offerData, setOfferData] = useState({
    title: "Limited Time Offer",
    heading: "UP TO 30%\nOFF",
    subheading: "On Selected Toys",
    linkText: "SHOP NOW →",
    linkUrl: "/shop?tags=Sale",
  });

  useEffect(() => {
    fetch("/api/offer")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.offer) {
          setOfferData({
            title: data.offer.title || "Limited Time Offer",
            heading: data.offer.heading || "UP TO 30%\nOFF",
            subheading: data.offer.subheading || "On Selected Toys",
            linkText: data.offer.linkText || "SHOP NOW →",
            linkUrl: data.offer.linkUrl || "/shop?tags=Sale",
          });
        }
      })
      .catch((err) => console.error("Failed to load offer:", err));
  }, []);

  useEffect(() => {
    setLocalCartCount(getCartCount());
    const update = () => setLocalCartCount(getCartCount());
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileMenuOpen(false);
    setMobileShopSubmenu(false);
    setMobileExpandedCat(null);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setMegaOpen(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileShopSubmenu(false);
    setMobileExpandedCat(null);
  };

  /* Build category href */
  const catHref = (label) =>
    label === "All Toys & Games" || label === ""
      ? "/shop"
      : label === "age"
        ? "/shop?sortBy=age"
        : label === "brands"
          ? "/shop?sortBy=brands"
          : `/shop?category=${encodeURIComponent(label)}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        .nb-font { font-family: 'Nunito', sans-serif; }

        /* Sidebar category hover */
        .sidebar-cat-item { transition: background 0.15s, color 0.15s; cursor: pointer; }
        .sidebar-cat-item:hover, .sidebar-cat-item.active {
          background: #fff0f6 !important;
          color: #e84393 !important;
        }
        .sidebar-cat-item:hover .cat-arrow, .sidebar-cat-item.active .cat-arrow {
          color: #e84393;
        }

        /* Grid card hover */
        .grid-cat-card:hover { border-color: #e84393 !important; box-shadow: 0 4px 16px rgba(232,67,147,0.15) !important; }
        .grid-cat-card:hover .grid-cat-label { color: #e84393 !important; }

        /* Age / Price row hover */
        .age-row:hover { color: #e84393 !important; }
        .price-row:hover { color: #e84393 !important; }

        /* Service icon */
        .service-row:hover .service-icon { background: #fce4ef !important; }

        /* Why us check */
        .why-row { transition: color 0.15s; }
        .why-row:hover { color: #e84393 !important; }

        /* Bottom badges */
        .bottom-badge:hover { background: #fff0f6 !important; }

        /* Mega bridge */
        .mega-bridge {
          position: absolute;
          left: 0; right: 0;
          height: 12px;
          bottom: -12px;
          background: transparent;
          z-index: 998;
        }

        /* Mobile drawer */
        .mobile-cat-link:hover { color: #e84393 !important; }
      `}</style>

      <AnnouncementBar />

      <nav
        className="nb-font sticky top-0 z-[1000] bg-white/95 backdrop-blur-md "
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="max-w-[1500px] mx-auto flex items-center justify-between h-[80px] gap-4 px-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="relative shrink-0 flex items-center group">
            <div className="transition-transform duration-300 group-hover:scale-105 flex items-center">
              <Image
                src="/Toy for kids log.png"
                alt="Logo"
                width={220}
                height={150}
                className="w-[200px] md:w-[220px] object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden xl:flex items-center gap-2 list-none p-0 m-0">
            {navLinks.map((link) =>
              link.name === "Shop" ? (
                <li key="Shop" className="relative">
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                  >
                    <button
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.95rem] font-bold transition-all duration-200 cursor-pointer border-none
                        ${
                          megaOpen || pathname === "/shop"
                            ? "bg-[#e84393] text-white shadow-lg shadow-[#e84393]/30"
                            : "bg-transparent text-gray-600 hover:bg-[#fff0f6] hover:text-[#e84393]"
                        }`}
                    >
                      Shop
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {megaOpen && <div className="mega-bridge" />}
                  </div>
                </li>
              ) : (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`px-5 py-2.5 rounded-full text-[0.95rem] font-bold transition-all duration-200 no-underline inline-block
                      ${
                        pathname === link.path
                          ? "bg-[#e84393] text-white shadow-lg shadow-[#e84393]/30"
                          : "text-gray-600 hover:bg-[#fff0f6] hover:text-[#e84393]"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              onClick={onCartClick}
              className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border-2 border-[#e84393]/20 text-[#e84393] font-bold no-underline transition-all duration-200 hover:bg-[#e84393] hover:text-white hover:border-[#e84393] hover:shadow-lg hover:shadow-[#e84393]/30"
            >
              <span className="text-lg">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {localCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#e84393] text-white rounded-full text-[0.65rem] font-black flex items-center justify-center border-2 border-white">
                  {localCartCount}
                </span>
              )}
            </Link>

            <button
              className="xl:hidden p-2 rounded-xl text-gray-600 hover:bg-[#fff0f6] hover:text-[#e84393] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={megaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute left-0 right-0 w-full z-999 transition-all duration-300 ease-in-out bg-[#fcfaf8] shadow-2xl overflow-x-hidden
            ${megaOpen ? "opacity-100 visible translate-y-0 pointer-events-auto" : "opacity-0 invisible -translate-y-3 pointer-events-none"}`}
          style={{
            top: "100%",
            borderTop: "2px solid #fce4ef",
          }}
        >
          <div
            className="flex flex-col w-full max-w-[1600px] mx-auto overflow-x-hidden overflow-y-visible"
            style={{
              background: "#fff",
            }}
          >
            {/* ── Main 5-column grid ── */}
            <div
              className="grid flex-1 w-full overflow-visible relative"
              style={{ gridTemplateColumns: "1fr 1.2fr 0.8fr 1fr 300px" }}
            >
              {/* ── Col 1: Shop by Categories Sidebar ── */}
              <div
                style={{
                  borderRight: "1px solid #f0f0f0",
                  background: "#fff",
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: "2px solid #e84393" }}
                >
                  <span
                    className="text-[0.72rem] font-black uppercase tracking-widest"
                    style={{ color: "#e84393" }}
                  >
                    Shop by Categories
                  </span>
                </div>
                <div className="relative">
                  <ul className="list-none p-0 m-0">
                    {ALL_SIDEBAR_CATEGORIES.map((cat) => (
                      <li key={cat.label}>
                        <Link
                          href={catHref(cat.path)}
                          className={`sidebar-cat-item flex items-center justify-between px-4 py-2.5 no-underline text-[0.82rem] font-bold ${hoveredSidebarCat === cat.label ? "active" : ""}`}
                          style={{
                            color:
                              hoveredSidebarCat === cat.label
                                ? "#e84393"
                                : "#444",
                            background:
                              hoveredSidebarCat === cat.label
                                ? "#fff0f6"
                                : "transparent",
                          }}
                          onMouseEnter={() => setHoveredSidebarCat(cat.label)}
                        >
                          {cat.label}
                          {(PRODUCT_SUBCATEGORIES[cat.label] ||
                            cat.label === "All Toys & Games") && (
                            <svg
                              className="cat-arrow w-3.5 h-3.5 flex-shrink-0"
                              style={{
                                color:
                                  hoveredSidebarCat === cat.label
                                    ? "#e84393"
                                    : "#bbb",
                              }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </Link>

                        {hoveredSidebarCat === cat.label &&
                          PRODUCT_SUBCATEGORIES[cat.label] && (
                            <div
                              className="absolute left-full top-0 w-[380px] bg-white shadow-xl border border-gray-100 z-[1001] py-3 rounded-r-xl"
                              style={{ maxWidth: "calc(100vw - 200px)" }}
                            >
                              <div className="px-4 py-2 mb-2 border-b border-gray-50">
                                <span className="text-[0.72rem] font-black uppercase tracking-widest text-[#e84393]">
                                  {cat.label} Subcategories
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-2 px-2">
                                {PRODUCT_SUBCATEGORIES[cat.label].map((sub) => (
                                  <Link
                                    key={sub}
                                    href={`/shop?category=${encodeURIComponent(cat.label)}&subCategory=${encodeURIComponent(sub)}`}
                                    className="block px-3 py-2 text-[0.82rem] font-bold text-gray-600 rounded-lg hover:bg-[#fff0f6] hover:text-[#e84393] transition-colors"
                                  >
                                    {sub}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Col 2: All Toys & Games image grid ── */}
              <div className="p-5" style={{ borderRight: "1px solid #f0f0f0" }}>
                <div
                  className="mb-3"
                  style={{
                    borderBottom: "2px solid #e84393",
                    paddingBottom: "8px",
                  }}
                >
                  <span
                    className="text-[0.72rem] font-black uppercase tracking-widest"
                    style={{ color: "#e84393" }}
                  >
                    All Toys &amp; Games
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {GRID_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      className="grid-cat-card flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-100 no-underline transition-all duration-200"
                      style={{ background: "#fff" }}
                    >
                      <div
                        className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative"
                        style={{ maxHeight: 72 }}
                      >
                        {/* Try to load image, fallback to emoji */}
                        {/* <span className="text-3xl">{cat.emoji}</span> */}
                        <Image
                          src={cat.img}
                          alt={cat.label}
                          fill
                          className="object-cover absolute inset-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <span className="grid-cat-label text-[0.7rem] font-medium text-center text-gray-600 leading-tight transition-colors">
                        {cat.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Col 3: Shop by Age + Shop by Price ── */}
              <div className="p-5" style={{ borderRight: "1px solid #f0f0f0" }}>
                {/* Shop by Age */}
                <div
                  className="mb-4"
                  style={{
                    borderBottom: "2px solid #e84393",
                    paddingBottom: "8px",
                  }}
                >
                  <span
                    className="text-[0.72rem] font-black uppercase tracking-widest"
                    style={{ color: "#e84393" }}
                  >
                    Shop by Age
                  </span>
                </div>
                <ul className="list-none p-0 m-0 mb-6">
                  {AGE_RANGES.map((age) => (
                    <li key={age.label}>
                      <Link
                        href={`/shop?age=${encodeURIComponent(age.path)}`}
                        className="age-row flex items-center justify-between py-2 text-[0.82rem] font-bold no-underline transition-colors"
                        style={{
                          color: "#444",
                          borderBottom: "1px solid #f5f5f5",
                        }}
                      >
                        {age.label}
                        <svg
                          className="w-3.5 h-3.5 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Shop by Price */}
                <div
                  className="mb-4"
                  style={{
                    borderBottom: "2px solid #e84393",
                    paddingBottom: "8px",
                  }}
                >
                  <span
                    className="text-[0.72rem] font-black uppercase tracking-widest"
                    style={{ color: "#e84393" }}
                  >
                    Shop by Price
                  </span>
                </div>
                <ul className="list-none p-0 m-0">
                  {PRICE_RANGES.map((pr) => (
                    <li key={pr.label}>
                      <Link
                        href={pr.href}
                        className="price-row flex items-center justify-between py-2 text-[0.82rem] font-bold no-underline transition-colors"
                        style={{
                          color: "#444",
                          borderBottom: "1px solid #f5f5f5",
                        }}
                      >
                        {pr.label}
                        <svg
                          className="w-3.5 h-3.5 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Col 4: Our Services ── */}
              <div className="p-5" style={{ borderRight: "1px solid #f0f0f0" }}>
                <div
                  className="mb-4"
                  style={{
                    borderBottom: "2px solid #e84393",
                    paddingBottom: "8px",
                  }}
                >
                  <span
                    className="text-[0.72rem] font-black uppercase tracking-widest"
                    style={{ color: "#e84393" }}
                  >
                    Our Services
                  </span>
                </div>
                <ul className="list-none p-0 m-0">
                  {SERVICES.map((svc) => (
                    <li
                      key={svc.title}
                      className="service-row flex items-start gap-3 py-2.5"
                      style={{ borderBottom: "1px solid #f5f5f5" }}
                    >
                      <div
                        className="service-icon w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all text-base"
                        style={{ background: "#f5f5f5" }}
                      >
                        {svc.icon}
                      </div>
                      <div>
                        <div className="text-[0.82rem] font-bold text-gray-800">
                          {svc.title}
                        </div>
                        <div className="text-[0.72rem] text-gray-400 font-semibold leading-snug">
                          {svc.desc}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Col 5: Why Shop With Us + Promo ── */}
              <div className="p-5">
                {/* Promo banner */}
                <div
                  className="mt-auto rounded-2xl p-4 relative overflow-hidden h-[300px] flex flex-col"
                  style={{
                    background: "linear-gradient(135deg,#fff0f6,#fce4ef)",
                  }}
                >
                  <div
                    className="text-[0.6rem] font-black uppercase tracking-widest mb-3"
                    style={{ color: "#e84393" }}
                  >
                    Limited Time Offer
                  </div>
                  <div
                    className="text-2xl md:text-3xl font-black leading-tight mb-3"
                    style={{ color: "#e84393", whiteSpace: "pre-line" }}
                  >
                    {offerData.heading}
                  </div>
                  <div className="text-[0.7rem] md:text-[1rem] font-bold text-gray-500 mb-3">
                    On Selected Toys
                  </div>
                  <Link
                    href="/shop?tags=Sale"
                    className="mt-auto self-start inline-flex items-center gap-1 px-4 py-2 rounded-full text-white text-[0.75rem] font-black no-underline transition-all hover:-translate-y-0.5"
                    style={{
                      background: "#e84393",
                      boxShadow: "0 4px 12px rgba(232,67,147,0.35)",
                    }}
                  >
                    SHOP NOW →
                  </Link>
                  {/* decorative teddy emoji */}
                  <div className="absolute -bottom-1 right-2 text-5xl opacity-80 select-none pointer-events-none">
                    🧸
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bottom badges bar ── */}
            <div
              style={{
                borderTop: "1px solid #f0f0f0",
                background: "#fff",
              }}
            >
              <div className="w-full grid grid-cols-4">
                {BOTTOM_BADGES.map((b, i) => (
                  <div
                    key={b.title}
                    className="bottom-badge flex items-center gap-3 px-6 py-3 transition-colors"
                    style={{
                      borderRight: i < 3 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <div className="text-[0.8rem] font-black text-gray-800">
                        {b.title}
                      </div>
                      <div className="text-[0.7rem] text-gray-400 font-semibold">
                        {b.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <div
        className={`fixed inset-0 bg-black/50 z-9999 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeMobileMenu}
      />

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white z-10000 flex flex-col overflow-y-auto shadow-[-4px_0_20px_rgba(0,0,0,0.1)] transition-all duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div
          className="p-5 flex justify-between items-center"
          style={{ borderBottom: "2px solid #fce4ef" }}
        >
          <Image
            src="/Kids For Toy logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="object-contain"
          />
          <button
            onClick={closeMobileMenu}
            className="text-2xl cursor-pointer font-black px-3 py-1 rounded-lg transition-all"
            style={{ color: "#e84393", background: "none", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fce4ef")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 p-5">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 no-underline font-extrabold text-lg"
              style={{
                borderBottom: "1px solid #fce4ef",
                color: pathname === link.path ? "#e84393" : "#444",
              }}
            >
              {link.name}
            </Link>
          ))}

          <div>
            <button
              onClick={() => setMobileShopSubmenu(!mobileShopSubmenu)}
              className="w-full flex items-center justify-between py-3.5 font-extrabold text-lg cursor-pointer"
              style={{
                background: "none",
                border: "none",
                borderBottom: "1px solid #fce4ef",
                color: "#444",
              }}
            >
              Shop
              <svg
                style={{
                  transform: mobileShopSubmenu ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {mobileShopSubmenu && (
              <div className="ml-4 mt-2 mb-2">
                {/* All Categories */}
                <div className="mb-5">
                  <div
                    className="text-[0.75rem] font-black tracking-widest uppercase mb-3"
                    style={{ color: "#e84393" }}
                  >
                    🗂️ Categories
                  </div>
                  {ALL_SIDEBAR_CATEGORIES.map((cat) => {
                    const hasSub = PRODUCT_SUBCATEGORIES[cat.label];
                    const isExpanded = mobileExpandedCat === cat.label;
                    return (
                      <div
                        key={cat.label}
                        style={{ borderBottom: "1px solid #fce4ef" }}
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={catHref(cat.path)}
                            onClick={closeMobileMenu}
                            className="mobile-cat-link flex-1 py-2.5 pl-4 font-semibold text-[1rem] no-underline transition-colors text-[#666]"
                          >
                            {cat.label}
                          </Link>
                          {hasSub && (
                            <button
                              onClick={() =>
                                setMobileExpandedCat(
                                  isExpanded ? null : cat.label,
                                )
                              }
                              className="p-3 text-[#e84393] transition-transform duration-200"
                              style={{
                                transform: isExpanded
                                  ? "rotate(180deg)"
                                  : "none",
                                background: "none",
                                border: "none",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {hasSub && isExpanded && (
                          <div className="bg-[#fff0f6] py-1 border-b border-[#fce4ef]/50">
                            {hasSub.map((sub) => (
                              <Link
                                key={sub}
                                href={`/shop?category=${encodeURIComponent(cat.label)}&subCategory=${encodeURIComponent(sub)}`}
                                onClick={closeMobileMenu}
                                className="block py-2.5 pl-10 pr-4 font-bold text-[0.85rem] text-gray-500 hover:text-[#e84393] transition-colors no-underline"
                              >
                                • {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Featured Grid Categories */}
                <div className="mb-6 mr-4">
                  <div
                    className="text-[0.75rem] font-black tracking-widest uppercase mb-3"
                    style={{ color: "#e84393" }}
                  >
                    🚀 Featured Categories
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {GRID_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.label}
                        href={cat.href}
                        onClick={closeMobileMenu}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-[#fce4ef] no-underline transition-all active:scale-95"
                        style={{ background: "#fff" }}
                      >
                        <div
                          className="w-full aspect-square rounded-xl overflow-hidden bg-[#fff0f6] flex items-center justify-center relative"
                          style={{ maxHeight: 80 }}
                        >
                          {/* <span className="text-3xl">{cat.emoji}</span> */}
                          <Image
                            src={cat.img}
                            alt={cat.label}
                            fill
                            className="object-cover absolute inset-0"
                          />
                        </div>
                        <span className="text-[0.7rem] font-black text-center text-gray-700 leading-tight">
                          {cat.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Shop by Age */}
                <div className="mb-5">
                  <div
                    className="text-[0.75rem] font-black tracking-widest uppercase mb-3"
                    style={{ color: "#e84393" }}
                  >
                    👶 Shop by Age
                  </div>
                  {AGE_RANGES.map((age) => (
                    <Link
                      key={age.label}
                      href={`/shop?age=${encodeURIComponent(age.path)}`}
                      onClick={closeMobileMenu}
                      className="mobile-cat-link block py-2.5 pl-4 font-semibold text-[1rem] no-underline transition-colors"
                      style={{
                        color: "#666",
                        borderBottom: "1px solid #fce4ef",
                      }}
                    >
                      {age.label}
                    </Link>
                  ))}
                </div>

                {/* Shop by Price */}
                <div className="mb-5">
                  <div
                    className="text-[0.75rem] font-black tracking-widest uppercase mb-3"
                    style={{ color: "#e84393" }}
                  >
                    💰 Shop by Price
                  </div>
                  {PRICE_RANGES.map((pr) => (
                    <Link
                      key={pr.label}
                      href={pr.href}
                      onClick={closeMobileMenu}
                      className="mobile-cat-link block py-2.5 pl-4 font-semibold text-[1rem] no-underline transition-colors"
                      style={{
                        color: "#666",
                        borderBottom: "1px solid #fce4ef",
                      }}
                    >
                      {pr.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className="flex items-center justify-between py-3.5 no-underline font-extrabold text-lg"
            style={{
              borderBottom: "1px solid #fce4ef",
              color: pathname === "/contact" ? "#e84393" : "#444",
            }}
          >
            Contact
          </Link>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-5 mb-3 py-3 flex items-center justify-center gap-2 rounded-full font-extrabold text-white no-underline text-base"
          style={{ background: "#25D366" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp Us
        </a>

        <div
          className="mx-5 my-2 p-5 rounded-2xl"
          style={{
            background: "linear-gradient(160deg,#fff0f6 0%,#fce4ef 100%)",
          }}
        >
          <span
            className="text-[10px] font-black uppercase"
            style={{ color: "#e84393" }}
          >
            ✨ Limited Time Offer
          </span>
          <h3
            className="text-[1.2rem] font-black mt-1 mb-1"
            style={{ color: "#e84393" }}
          >
            UP TO 30% OFF
          </h3>
          <p className="text-[0.75rem] text-gray-500 font-semibold mb-3">
            On Selected Toys
          </p>
          <Link
            href="/shop?tags=Sale"
            onClick={closeMobileMenu}
            className="inline-block text-white px-5 py-2.5 rounded-full text-xs font-black no-underline"
            style={{ background: "#e84393" }}
          >
            SHOP NOW →
          </Link>
        </div>

        <Link
          href="/cart"
          onClick={(e) => {
            if (onCartClick) onCartClick(e);
            closeMobileMenu();
          }}
          className="mx-5 mb-5 py-3 text-white no-underline text-center rounded-full font-extrabold text-lg flex items-center justify-center gap-2"
          style={{ background: "#e84393" }}
        >
          🛒 View Cart {localCartCount > 0 && `(${localCartCount})`}
        </Link>
      </div>
    </>
  );
}