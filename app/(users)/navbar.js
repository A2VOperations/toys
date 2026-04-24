"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CATEGORIES, CATEGORY_EMOJIS } from "./categories";

/* ── WhatsApp from .env ── */
const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
const waLink = `https://wa.me/${waNumber.replace(/\D/g, "")}`;

/* ── Announcement slides ── */
const ANNOUNCEMENTS = [
  { icon: "🚚", text: "Free Shipping on all orders over Rs.2500 — Shop now!" },
  { icon: "✅", text: "100% Trustworthy & Verified Toys — Quality Guaranteed" },
  { icon: "⚡", text: "Reliable Same-Day Delivery available in major cities" },
  { icon: "💬", text: `Need help? WhatsApp us at +${waNumber}`, link: waLink },
  { icon: "🔒", text: "Secure Payments — COD, Card & EasyPaisa accepted" },
  {
    icon: "🎁",
    text: "Gift Wrapping available on all orders — Surprise someone today!",
  },
  { icon: "⭐", text: "4.9★ Rated by 10,000+ happy parents across Pakistan" },
  { icon: "🔄", text: "Easy 7-day Returns — No questions asked" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Shop", path: "/shop" },
  { name: "Contact", path: "/contact" },
];

const MEGA = {
  categories: [
    { label: "Action Figures", emoji: "🦸" },
    { label: "Board Games", emoji: "♟️" },
    { label: "Educational", emoji: "📚" },
    { label: "Dolls", emoji: "🪆" },
    { label: "Vehicles", emoji: "🚗" },
    { label: "Puzzles", emoji: "🧩" },
    { label: "Outdoor & Sports", emoji: "⚽" },
    { label: "Arts & Crafts", emoji: "🎨" },
  ],
  tags: [
    "🔥 Bestseller",
    "✨ New",
    "💰 Sale",
    "🏆 Award Winning",
    "🎯 Limited Edition",
  ],
  genders: [
    { label: "Boys", emoji: "🚀", path: "Boy" },
    { label: "Girls", emoji: "🌸", path: "Girl" },
    { label: "Unisex", emoji: "🌈", path: "Unisex" },
  ],
};

/* ════════════════════════════════════════
   Announcement Carousel — pure React/CSS
   ════════════════════════════════════════ */
function AnnouncementBar() {
  return (
    <div
      className="relative w-full h-[36px] flex items-center px-4 md:px-6"
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
          width: 1px;
          height: 14px;
          background: rgba(255,255,255,0.4);
          margin: 0 12px;
        }
        .ann-dropdown {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          transition: background 0.15s;
        }
        .ann-dropdown:hover { background: rgba(255,255,255,0.15); }
        .ann-dropdown svg { opacity: 0.85; }
      `}</style>

      {/* LEFT — Open Hours + Live Chat */}
      <div className="flex items-center gap-1 text-white text-[0.68rem] font-semibold whitespace-nowrap flex-1">
        {/* Clock icon */}
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
        <span className="ml-1">Open Hours: Mon – Fri 8am – 6pm</span>

        <div className="ann-divider" />

        {/* Headset icon */}
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
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
          <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
        <span className="ml-1">Live Chat</span>
      </div>

      {/* CENTER — Promo text */}
      <div className="text-white text-[0.68rem] md:text-[0.72rem] whitespace-nowrap text-center">
        Supper Value Deals –{" "}
        <strong className="font-800">Save more with coupons 2BD30X</strong>
      </div>

      {/* RIGHT — Language + Currency */}
      <div className="flex items-center gap-1 text-white text-[0.68rem] font-semibold whitespace-nowrap flex-1 justify-end">
        {/* Language */}
        <div className="ann-dropdown">
          {/* Flag icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>EN</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="ann-divider" />

        {/* Currency */}
        <div className="ann-dropdown">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01" />
            <path d="M12 6v2m0 8v2M6 12h2m8 0h2" />
          </svg>
          <span>USD</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   Main Navbar
   ════════════════════════════════════════ */
export default function Navbar({ cartCount = 0, onCartClick }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopSubmenu, setMobileShopSubmenu] = useState(false);
  const timerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setMegaOpen(false);
    setMobileMenuOpen(false);
    setMobileShopSubmenu(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
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

  const openMega = () => {
    if (window.innerWidth >= 768) {
      clearTimeout(timerRef.current);
      setMegaOpen(true);
    }
  };
  const closeMega = () => {
    if (window.innerWidth >= 768) {
      timerRef.current = setTimeout(() => setMegaOpen(false), 150);
    }
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileShopSubmenu(false);
  };

  return (
    <>
      <AnnouncementBar />

      {/* ── Sticky Nav ── */}
      <nav
        className="nb-font sticky top-0 z-[1000] bg-white  px-5"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 h-[68px]">
          {/* Logo */}
          <Link
            href="/"
            className="text-[2rem] font-black leading-none tracking-[-2px] no-underline flex items-center transition-transform duration-200 hover:scale-105"
          >
            <span style={{ color: "#e84393" }}>K</span>
            <span style={{ color: "#ff6b35" }}>I</span>
            <span style={{ color: "#ffd700" }}>D</span>
            <span style={{ color: "#4caf50" }}>D</span>
            <span style={{ color: "#2196f3" }}>E</span>
            <span style={{ color: "#9c27b0" }}>X</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex list-none p-0 m-0 items-center gap-1">
            {navLinks.map((link) =>
              link.name === "Shop" ? (
                <li key="Shop">
                  <button
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-[1rem] font-extrabold cursor-pointer border-none transition-all duration-200 nb-font
                      ${megaOpen || pathname === "/shop" ? "bg-[#fce4ef] text-[#e84393]" : "bg-transparent text-[#555] hover:bg-[#fce4ef] hover:text-[#e84393]"}`}
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    Shop
                    <svg
                      className={`w-[14px] h-[14px] transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </li>
              ) : (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-[0.88rem] font-extrabold no-underline transition-all duration-200 nb-font
                      ${pathname === link.path ? "bg-[#fce4ef] text-[#e84393]" : "text-[#555] hover:bg-[#fce4ef] hover:text-[#e84393]"}`}
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              onClick={onCartClick}
              className="flex items-center gap-2 bg-white border-2 border-[#fce4ef] rounded-full px-4 py-2 text-[0.84rem] font-extrabold text-[#555] no-underline relative transition-all duration-200 hover:bg-[#fce4ef] hover:border-[#e84393] hover:text-[#e84393] max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              <span>🛒 Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#e84393] text-white rounded-full text-[0.6rem] font-black flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="lg:hidden flex items-center justify-center bg-transparent border-none cursor-pointer p-2 rounded-lg text-[#555] transition-all duration-200 hover:bg-[#fce4ef] hover:text-[#e84393]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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

        {/* ── Mega Menu — inside sticky nav, zero scroll gap ── */}
        <div
          className="hidden md:block absolute left-0 right-0 w-full z-[9999] pointer-events-none"
          style={{ top: "100%" }}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div
            className={`bg-white border-t-[3px] border-t-[#e84393] border-b-2 border-b-[#fce4ef] shadow-[0_24px_80px_rgba(232,67,147,0.13)] transition-all duration-[280ms]
            ${megaOpen ? "opacity-100 visible translate-y-0 pointer-events-auto mega-open" : "opacity-0 invisible -translate-y-3"}`}
          >
            <div
              className="max-w-[1280px] mx-auto grid min-h-[360px]"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 320px" }}
            >
              {/* Col 1 */}
              <div className="p-9 border-r border-[#fce4ef] overflow-y-auto max-h-[450px] scrollbar-thin scrollbar-track-[#fce4ef] scrollbar-thumb-[#e84393] hover:scrollbar-thumb-[#c73580] scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                <h4 className="text-[0.66rem] font-black tracking-[0.18em] uppercase mb-5 pb-3 border-b-2 border-[#fce4ef] flex items-center gap-2 text-[#e84393]">
                  🗂️ Categories
                </h4>
                <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
                  {CATEGORIES.map((label) => (
                    <li key={label}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(label)}`}
                        className="text-[0.84rem] font-bold text-[#555] no-underline flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-[#fff0f6] hover:text-[#e84393] hover:pl-4 group"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#fce4ef] transition-all duration-200 group-hover:bg-[#e84393] group-hover:scale-125" />
                        {CATEGORY_EMOJIS[label] || "🧸"} {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2 */}
              <div className="p-9 border-r border-[#fce4ef]">
                <h4 className="text-[0.66rem] font-black tracking-[0.18em] uppercase mb-5 pb-3 border-b-2 border-[#ffe0d4] flex items-center gap-2 text-[#ff6b35]">
                  🏷️ Trending Tags
                </h4>
                <div className="flex flex-wrap gap-2 mb-7">
                  {MEGA.tags.map((t) => {
                    const tagValue = t.replace(/[^a-zA-Z\s]/g, "").trim();
                    return (
                      <Link
                        key={t}
                        href={`/shop?tags=${encodeURIComponent(tagValue)}`}
                        className="inline-flex items-center gap-1 bg-[#fff0f6] border-[1.5px] border-[#fce4ef] rounded-full px-3.5 py-1.5 text-[0.78rem] font-bold text-[#e84393] no-underline transition-all duration-200 hover:bg-[#e84393] hover:text-white hover:-translate-y-0.5"
                      >
                        {t}
                      </Link>
                    );
                  })}
                </div>
                <h4 className="text-[0.66rem] font-black tracking-[0.18em] uppercase mb-5 pb-3 border-b-2 border-[#f3e5f5] flex items-center gap-2 text-[#9c27b0]">
                  👶 Shop by Gender
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {MEGA.genders.map((g) => (
                    <Link
                      key={g.label}
                      href={`/shop?gender=${encodeURIComponent(g.path)}`}
                      className="flex flex-col items-center justify-center py-4 px-2.5 rounded-2xl border-2 border-[#fce4ef] no-underline text-[0.78rem] font-extrabold text-[#555] bg-white transition-all duration-200 hover:bg-[#fce4ef] hover:border-[#e84393] hover:text-[#e84393] hover:-translate-y-0.5"
                    >
                      <span className="text-2xl">{g.emoji}</span>
                      {g.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Col 3 */}
              <div className="p-9 border-r border-[#fce4ef]">
                <h4 className="text-[0.66rem] font-black tracking-[0.18em] uppercase mb-5 pb-3 border-b-2 border-[#fce4ef] flex items-center gap-2 text-[#e84393]">
                  ⚡ Quick Access
                </h4>
                <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
                  {[
                    "New Arrivals",
                    "Best Sellers",
                    "Flash Sale",
                    "Gift Sets",
                    "Under Rs.1000",
                  ].map((l) => {
                    let href = "/shop";
                    if (l === "New Arrivals") href = "/shop?sortBy=latest";
                    else if (l === "Best Sellers")
                      href = "/shop?tags=Bestseller";
                    else if (l === "Flash Sale") href = "/shop?tags=Sale";
                    else if (l === "Under Rs.1000")
                      href = "/shop?maxPrice=1000";
                    return (
                      <li key={l}>
                        <Link
                          href={href}
                          className="text-[0.84rem] font-bold text-[#555] no-underline flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-[#fff0f6] hover:text-[#e84393] hover:pl-4 group"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#fce4ef] transition-all duration-200 group-hover:bg-[#e84393] group-hover:scale-125" />
                          {l}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Col 4 */}
              <div
                className="p-10 flex flex-col justify-between"
                style={{
                  background:
                    "linear-gradient(160deg, #fff0f6 0%, #fce4ef 60%, #ffd6eb 100%)",
                }}
              >
                <div>
                  <span className="text-[0.62rem] font-black text-[#e84393] bg-white px-2.5 py-0.5 rounded-2xl border-[1.5px] border-[#fce4ef] self-start inline-block mb-3">
                    ✨ The Toy Stack
                  </span>
                  <h3 className="text-[2rem] font-black leading-tight text-[#222] mb-3">
                    DISCOVER <span style={{ color: "#e84393" }}>PLAYTIME</span>{" "}
                    MAGIC
                  </h3>
                  <p className="text-[0.8rem] text-[#888] leading-relaxed font-semibold mb-6">
                    Curated premium toys for every child. Spark imagination and
                    create memories.
                  </p>
                  <div className="flex gap-4 mb-6">
                    <div>
                      <div className="text-[1.3rem] font-black text-[#e84393]">
                        500+
                      </div>
                      <div className="text-[0.65rem] text-[#aaa] font-bold uppercase">
                        Toys
                      </div>
                    </div>
                    <div>
                      <div className="text-[1.3rem] font-black text-[#e84393]">
                        4.9★
                      </div>
                      <div className="text-[0.65rem] text-[#aaa] font-bold uppercase">
                        Rating
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex self-start bg-[#e84393] text-white px-5 py-3 rounded-full text-[0.82rem] font-black no-underline shadow-[0_8px_24px_rgba(232,67,147,0.25)] hover:brightness-110 transition-all"
                >
                  SHOP ALL →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9999] transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeMobileMenu}
      />

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white z-[10000] flex flex-col overflow-y-auto shadow-[-4px_0_20px_rgba(0,0,0,0.1)] transition-all duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header */}
        <div className="p-5 border-b-2 border-[#fce4ef] flex justify-between items-center">
          <span className="text-[1.5rem] font-black tracking-[-1px] flex items-center">
            <span style={{ color: "#e84393" }}>K</span>
            <span style={{ color: "#ff6b35" }}>I</span>
            <span style={{ color: "#ffd700" }}>D</span>
            <span style={{ color: "#4caf50" }}>D</span>
            <span style={{ color: "#2196f3" }}>E</span>
            <span style={{ color: "#9c27b0" }}>X</span>
          </span>
          <button
            onClick={closeMobileMenu}
            className="bg-none border-none text-2xl cursor-pointer text-[#e84393] font-black px-3 py-1 rounded-lg hover:bg-[#fce4ef] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 p-5">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={closeMobileMenu}
              className={`flex items-center justify-between py-3.5 no-underline font-extrabold text-base border-b border-[#fce4ef] ${pathname === link.path ? "text-[#e84393]" : "text-[#444]"}`}
            >
              {link.name}
            </Link>
          ))}

          {/* Shop submenu */}
          <div>
            <button
              onClick={() => setMobileShopSubmenu(!mobileShopSubmenu)}
              className="w-full flex items-center justify-between py-3.5 font-extrabold text-base border-b border-[#fce4ef] bg-transparent border-none cursor-pointer text-[#444]"
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
                <div className="mb-6">
                  <div className="text-[0.7rem] font-black tracking-widest uppercase text-[#e84393] mb-3">
                    🗂️ Categories
                  </div>
                  {CATEGORIES.map((label) => (
                    <Link
                      key={label}
                      href={`/shop?category=${encodeURIComponent(label)}`}
                      onClick={closeMobileMenu}
                      className="block py-2.5 pl-4 text-[#666] font-semibold text-[0.9rem] no-underline border-b border-[#fce4ef] hover:text-[#e84393]"
                    >
                      {CATEGORY_EMOJIS[label] || "🧸"} {label}
                    </Link>
                  ))}
                </div>
                <div className="mb-6">
                  <div className="text-[0.7rem] font-black tracking-widest uppercase text-[#e84393] mb-3">
                    🏷️ Trending Tags
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {MEGA.tags.map((t) => {
                      const tagValue = t.replace(/[^a-zA-Z\s]/g, "").trim();
                      return (
                        <Link
                          key={t}
                          href={`/shop?tags=${encodeURIComponent(tagValue)}`}
                          onClick={closeMobileMenu}
                          className="bg-[#fff0f6] border border-[#fce4ef] rounded-full px-3 py-1.5 text-[0.7rem] font-bold text-[#e84393] no-underline"
                        >
                          {t}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="text-[0.7rem] font-black tracking-widest uppercase text-[#e84393] mb-3">
                    👶 Shop by Gender
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {MEGA.genders.map((g) => (
                      <Link
                        key={g.label}
                        href={`/shop?gender=${encodeURIComponent(g.path)}`}
                        onClick={closeMobileMenu}
                        className="flex flex-col items-center p-3 rounded-xl border-2 border-[#fce4ef] no-underline text-[0.7rem] font-extrabold text-[#555] bg-white"
                      >
                        <span className="text-2xl">{g.emoji}</span>
                        {g.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="text-[0.7rem] font-black tracking-widest uppercase text-[#e84393] mb-3">
                    ⚡ Quick Access
                  </div>
                  {[
                    "New Arrivals",
                    "Best Sellers",
                    "Flash Sale",
                    "Gift Sets",
                    "Under Rs.1000",
                  ].map((l) => {
                    let href = "/shop";
                    if (l === "New Arrivals") href = "/shop?sortBy=latest";
                    else if (l === "Best Sellers")
                      href = "/shop?tags=Bestseller";
                    else if (l === "Flash Sale") href = "/shop?tags=Sale";
                    else if (l === "Under Rs.1000")
                      href = "/shop?maxPrice=1000";
                    return (
                      <Link
                        key={l}
                        href={href}
                        onClick={closeMobileMenu}
                        className="block py-2.5 pl-4 text-[#666] font-semibold text-[0.9rem] no-underline border-b border-[#fce4ef] hover:text-[#e84393]"
                      >
                        {l}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className={`flex items-center justify-between py-3.5 no-underline font-extrabold text-base border-b border-[#fce4ef] ${pathname === "/contact" ? "text-[#e84393]" : "text-[#444]"}`}
          >
            Contact
          </Link>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-5 mb-3 py-3 flex items-center justify-center gap-2 rounded-full font-extrabold text-white no-underline text-sm"
          style={{ background: "#25D366" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp Us
        </a>

        {/* Feature promo */}
        <div
          className="mx-5 my-2 p-5 rounded-2xl"
          style={{
            background: "linear-gradient(160deg, #fff0f6 0%, #fce4ef 100%)",
          }}
        >
          <span className="text-[10px] font-black uppercase text-[#e84393]">
            ✨ The Toy Stack
          </span>
          <h3 className="text-[1.2rem] font-black mt-1 mb-3 text-[#222]">
            DISCOVER PLAYTIME MAGIC
          </h3>
          <div className="flex gap-4 mb-3">
            <div>
              <span className="text-[1.1rem] font-black text-[#e84393]">
                500+
              </span>
              <div className="text-[10px] text-[#aaa]">Toys</div>
            </div>
            <div>
              <span className="text-[1.1rem] font-black text-[#e84393]">
                4.9★
              </span>
              <div className="text-[10px] text-[#aaa]">Rating</div>
            </div>
          </div>
          <Link
            href="/shop"
            onClick={closeMobileMenu}
            className="inline-block bg-[#e84393] text-white px-5 py-2.5 rounded-full text-xs font-black no-underline"
          >
            SHOP ALL →
          </Link>
        </div>

        {/* Cart */}
        <Link
          href="/cart"
          onClick={(e) => {
            if (onCartClick) onCartClick(e);
            closeMobileMenu();
          }}
          className="mx-5 mb-5 py-3 bg-[#e84393] text-white no-underline text-center rounded-full font-extrabold flex items-center justify-center gap-2"
        >
          🛒 View Cart {cartCount > 0 && `(${cartCount})`}
        </Link>
      </div>
    </>
  );
}