"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CATEGORIES, CATEGORY_EMOJIS } from "./categories";
import { getCartCount } from "./cartStorage";

/* ── WhatsApp from .env ── */
const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
const waLink = `https://wa.me/${waNumber.replace(/\D/g, "")}`;

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
        background: "linear-gradient(90deg, #b5105a 0%, #e84393 45%, #ff6b9d 75%, #e84393 100%)",
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
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="ml-1">Open Hours: 9am – 10pm</span>
        <div className="ann-divider" />
      </div>

      <Link href="/#dealOf" className="flex-1 md:flex-none text-white text-[0.75rem] sm:text-[0.78rem] md:text-[0.82rem] whitespace-nowrap text-center">
        Today's Deals – <strong className="font-extrabold">Click to Save More</strong>
      </Link>

      <div className="hidden sm:flex items-center gap-1 text-white text-[0.78rem] font-semibold whitespace-nowrap flex-1 justify-end">
        <div className="flex items-center gap-2">
          {[
            { href: `https://wa.me/${waNumber}`, Icon: WaIcon, label: "WhatsApp" },
            { href: "https://facebook.com", Icon: FbIcon, label: "Facebook" },
            { href: "https://instagram.com", Icon: IgIcon, label: "Instagram" },
          ].map(({ href, Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
              aria-label={label}>
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
  const megaRef = useRef(null);
  const timerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setLocalCartCount(getCartCount());
    const update = () => setLocalCartCount(getCartCount());
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("cartUpdated", update); window.removeEventListener("storage", update); };
  }, []);

  useEffect(() => { setMegaOpen(false); setMobileMenuOpen(false); setMobileShopSubmenu(false); }, [pathname]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1280) setMobileMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  /* ── Stable hover: open on button enter, close only when leaving BOTH button + panel ── */
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setMegaOpen(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const closeMobileMenu = () => { setMobileMenuOpen(false); setMobileShopSubmenu(false); };

  return (
    <>
      <style>{`
        /* Pink glow on mega hover links */
        .mega-cat-link:hover { color: #e84393 !important; padding-left: 10px; }
        .mega-cat-link { transition: color 0.2s, padding-left 0.2s; }
        .mega-collection-item:hover { background: linear-gradient(90deg,#fff0f6,#fce4ef) !important; color: #e84393 !important; }
        .mega-tag:hover { background: #e84393 !important; color: #fff !important; border-color: #e84393 !important; }
        .mega-gender-card:hover { border-color: #e84393 !important; color: #e84393 !important; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(232,67,147,0.18) !important; }
        /* Bridge: invisible gap-filler between button and panel so mouse can travel */
        .mega-bridge {
          position: absolute;
          left: 0; right: 0;
          height: 12px;
          bottom: -12px;
          background: transparent;
          z-index: 998;
        }
      `}</style>

      <AnnouncementBar />

      <nav
        className="nb-font sticky top-0 z-[1000] bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 px-4 md:px-8"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-[80px] gap-4">

          {/* Logo */}
          <Link href="/" className="relative shrink-0 flex items-center group">
            <div className="transition-transform duration-300 group-hover:scale-105">
              <Image src="/Kids For Toy logo.png" alt="Logo" width={160} height={50}
                className="w-auto h-[48px] md:h-[54px] object-contain" priority />
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden xl:flex items-center gap-2 list-none p-0 m-0">
            {navLinks.map((link) =>
              link.name === "Shop" ? (
                <li key="Shop" className="relative">
                  {/* Button + invisible bridge to panel */}
                  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
                    <button
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.95rem] font-bold transition-all duration-200 cursor-pointer border-none
                        ${megaOpen || pathname === "/shop"
                          ? "bg-[#e84393] text-white shadow-lg shadow-[#e84393]/30"
                          : "bg-transparent text-gray-600 hover:bg-[#fff0f6] hover:text-[#e84393]"}`}
                    >
                      Shop
                      <svg className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Invisible bridge so cursor can travel to mega panel without it closing */}
                    {megaOpen && <div className="mega-bridge" />}
                  </div>
                </li>
              ) : (
                <li key={link.name}>
                  <Link href={link.path}
                    className={`px-5 py-2.5 rounded-full text-[0.95rem] font-bold transition-all duration-200 no-underline inline-block
                      ${pathname === link.path
                        ? "bg-[#e84393] text-white shadow-lg shadow-[#e84393]/30"
                        : "text-gray-600 hover:bg-[#fff0f6] hover:text-[#e84393]"}`}>
                    {link.name}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/cart" onClick={onCartClick}
              className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border-2 border-[#e84393]/20 text-[#e84393] font-bold no-underline transition-all duration-200 hover:bg-[#e84393] hover:text-white hover:border-[#e84393] hover:shadow-lg hover:shadow-[#e84393]/30">
              <span className="text-lg">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {localCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#e84393] text-white rounded-full text-[0.65rem] font-black flex items-center justify-center border-2 border-white">
                  {localCartCount}
                </span>
              )}
            </Link>

            <button className="xl:hidden p-2 rounded-xl text-gray-600 hover:bg-[#fff0f6] hover:text-[#e84393] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* ════════ MEGA MENU ════════ */}
        {/*
          Key fix: the mega panel itself ALSO gets onMouseEnter/Leave with the same handlers,
          so hovering inside the panel keeps it open.
        */}
        <div
          ref={megaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute left-0 right-0 w-full z-[999] transition-all duration-300 ease-in-out
            ${megaOpen ? "opacity-100 visible translate-y-0 pointer-events-auto" : "opacity-0 invisible -translate-y-3 pointer-events-none"}`}
          style={{ top: "100%" }}
        >
          {/* Pink-tinted backdrop */}
          <div className="absolute inset-0 -z-10" style={{
            background: "linear-gradient(180deg, rgba(252,228,239,0.6) 0%, rgba(255,255,255,0) 100%)",
            backdropFilter: "blur(6px)",
          }} />

          <div style={{
            background: "linear-gradient(180deg, #fff5f9 0%, #ffffff 60%)",
            boxShadow: "0 24px 60px rgba(232,67,147,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            borderTop: "2px solid #fce4ef",
          }}>
            <div className="max-w-[1400px] mx-auto grid grid-cols-5" style={{ minHeight: 480 }}>

              {/* ── Col 1: Categories ── */}
              <div className="p-5 pl-5 col-span-2" style={{ borderRight: "1px solid #fce4ef" }}>
                <div className="mb-7">
                  <span className="inline-block text-[0.65rem] font-black tracking-[0.22em] uppercase px-3 py-1 rounded-full mb-3"
                    style={{ background: "#fce4ef", color: "#e84393" }}>
                    ✦ Browse
                  </span>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">All Categories</h3>
                </div>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-0 list-none p-0 m-0">
                  {CATEGORIES.map((label) => (
                    <li key={label}>
                      <Link href={`/shop?category=${encodeURIComponent(label)}`}
                        className="mega-cat-link flex items-center gap-1 py-1.5 text-gray-500 font-bold text-[0.85rem] no-underline group">
                        <span className="text-base opacity-60 group-hover:opacity-100 transition-all group-hover:scale-110 inline-block">
                          {CATEGORY_EMOJIS[label] || "🧸"}
                        </span>
                        <span className="truncate">{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Col 2: Tags + Gender ── */}
              <div className="p-10" style={{ borderRight: "1px solid #fce4ef", background: "linear-gradient(160deg,#fff8fb,#ffffff)" }}>
                <div className="mb-8">
                  <span className="inline-block text-[0.65rem] font-black tracking-[0.22em] uppercase px-3 py-1 rounded-full mb-4"
                    style={{ background: "#fff0eb", color: "#ff6b35" }}>
                    🔥 Trending
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {MEGA.tags.map((t) => {
                      const tagValue = t.replace(/[^a-zA-Z\s]/g, "").trim();
                      return (
                        <Link key={t} href={`/shop?tags=${encodeURIComponent(tagValue)}`}
                          className="mega-tag px-4 py-1.5 rounded-full text-[0.78rem] font-bold no-underline transition-all duration-200"
                          style={{ background: "#fff0f6", border: "1.5px solid #fce4ef", color: "#e84393" }}>
                          {t}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="inline-block text-[0.65rem] font-black tracking-[0.22em] uppercase px-3 py-1 rounded-full mb-5"
                    style={{ background: "#f3e8ff", color: "#9c27b0" }}>
                    👶 For Every Child
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {MEGA.genders.map((g) => (
                      <Link key={g.label} href={`/shop?gender=${encodeURIComponent(g.path)}`}
                        className="mega-gender-card flex flex-col items-center justify-center p-3 rounded-2xl no-underline transition-all duration-200"
                        style={{ background: "#fff", border: "1.5px solid #fce4ef", color: "#555" }}>
                        <span className="text-2xl mb-1">{g.emoji}</span>
                        <span className="text-[0.65rem] font-black uppercase tracking-wider">{g.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Col 3: Quick Collections ── */}
              <div className="p-10" style={{ borderRight: "1px solid #fce4ef" }}>
                <div className="mb-7">
                  <span className="inline-block text-[0.65rem] font-black tracking-[0.22em] uppercase px-3 py-1 rounded-full mb-3"
                    style={{ background: "#fce4ef", color: "#e84393" }}>
                    ⚡ Quick Access
                  </span>
                  <h3 className="text-xl font-black text-gray-900">Collections</h3>
                </div>
                <ul className="flex flex-col gap-1 list-none p-0 m-0">
                  {[
                    { label: "New Arrivals", href: "/shop?sortBy=latest", icon: "✨", desc: "Fresh drops this week" },
                    { label: "Best Sellers", href: "/shop?tags=Bestseller", icon: "🔥", desc: "Top picks by parents" },
                    { label: "Flash Sale", href: "/shop?tags=Sale", icon: "💥", desc: "Limited-time deals" },
                    { label: "Under Rs.1000", href: "/shop?maxPrice=1000", icon: "💰", desc: "Budget-friendly fun" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}
                        className="mega-collection-item flex items-center gap-3 py-3 px-4 rounded-xl no-underline transition-all duration-200 group"
                        style={{ color: "#555" }}>
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all"
                          style={{ background: "#fce4ef" }}>
                          {item.icon}
                        </span>
                        <div>
                          <div className="font-bold text-[0.9rem] leading-tight">{item.label}</div>
                          <div className="text-[0.72rem] text-gray-400 font-semibold">{item.desc}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Col 4: Featured Promo ── */}
              <div className="p-10 flex flex-col justify-between relative overflow-hidden"
                style={{ background: "linear-gradient(145deg,#fff0f6 0%,#fce4ef 60%,#fff5f9 100%)" }}>
                {/* Decorative blobs */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle,rgba(232,67,147,0.18),transparent 70%)" }} />
                <div className="absolute bottom-10 -left-6 w-28 h-28 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle,rgba(255,107,157,0.15),transparent 70%)" }} />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest rounded-lg mb-5"
                    style={{ background: "#fff", border: "1px solid #fce4ef", color: "#e84393", boxShadow: "0 2px 8px rgba(232,67,147,0.1)" }}>
                    ✨ Featured Selection
                  </span>
                  <h3 className="text-3xl font-black text-gray-900 leading-tight mb-4">
                    The <br />
                    <span style={{ color: "#e84393" }}>Toy Stack</span>
                  </h3>
                  <p className="text-sm text-gray-500 font-semibold leading-relaxed mb-7">
                    Hand-picked toys that spark creativity and bring endless joy to every child.
                  </p>
                  <div className="flex gap-6 mb-8">
                    {[ { val: "4.9★", label: "Rating" }, { val: "10k+", label: "Happy Kids" }].map(({ val, label }) => (
                      <div key={label}>
                        <div className="text-xl font-black" style={{ color: "#e84393" }}>{val}</div>
                        <div className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/shop"
                  className="relative z-10 inline-flex items-center justify-center px-10 py-4 rounded-full text-sm font-black text-white no-underline transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg,#e84393,#c4176e)",
                    boxShadow: "0 8px 24px rgba(232,67,147,0.35)",
                  }}>
                  SHOP MORE
                </Link>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <div className={`fixed inset-0 bg-black/50 z-[9999] transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeMobileMenu} />

      {/* ── Mobile Drawer ── */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white z-[10000] flex flex-col overflow-y-auto shadow-[-4px_0_20px_rgba(0,0,0,0.1)] transition-all duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="p-5 flex justify-between items-center" style={{ borderBottom: "2px solid #fce4ef" }}>
          <Image src="/Kids For Toy logo.png" alt="Logo" width={120} height={40} className="object-contain" />
          <button onClick={closeMobileMenu}
            className="text-2xl cursor-pointer font-black px-3 py-1 rounded-lg transition-all"
            style={{ color: "#e84393", background: "none", border: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "#fce4ef"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            ✕
          </button>
        </div>

        <div className="flex-1 p-5">
          {[{ name: "Home", path: "/" }, { name: "About", path: "/about" }].map((link) => (
            <Link key={link.name} href={link.path} onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 no-underline font-extrabold text-lg"
              style={{ borderBottom: "1px solid #fce4ef", color: pathname === link.path ? "#e84393" : "#444" }}>
              {link.name}
            </Link>
          ))}

          <div>
            <button onClick={() => setMobileShopSubmenu(!mobileShopSubmenu)}
              className="w-full flex items-center justify-between py-3.5 font-extrabold text-lg cursor-pointer"
              style={{ background: "none", border: "none", borderBottom: "1px solid #fce4ef", color: "#444" }}>
              Shop
              <svg style={{ transform: mobileShopSubmenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {mobileShopSubmenu && (
              <div className="ml-4 mt-2 mb-2">
                <div className="mb-5">
                  <div className="text-[0.75rem] font-black tracking-widest uppercase mb-3" style={{ color: "#e84393" }}>🗂️ Categories</div>
                  {CATEGORIES.map((label) => (
                    <Link key={label} href={`/shop?category=${encodeURIComponent(label)}`} onClick={closeMobileMenu}
                      className="block py-2.5 pl-4 font-semibold text-[1rem] no-underline"
                      style={{ color: "#666", borderBottom: "1px solid #fce4ef" }}>
                      {CATEGORY_EMOJIS[label] || "🧸"} {label}
                    </Link>
                  ))}
                </div>
                <div className="mb-5">
                  <div className="text-[0.75rem] font-black tracking-widest uppercase mb-3" style={{ color: "#e84393" }}>🏷️ Trending Tags</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {MEGA.tags.map((t) => {
                      const tagValue = t.replace(/[^a-zA-Z\s]/g, "").trim();
                      return (
                        <Link key={t} href={`/shop?tags=${encodeURIComponent(tagValue)}`} onClick={closeMobileMenu}
                          className="rounded-full px-3 py-1.5 text-[0.8rem] font-bold no-underline"
                          style={{ background: "#fff0f6", border: "1px solid #fce4ef", color: "#e84393" }}>
                          {t}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-5">
                  <div className="text-[0.75rem] font-black tracking-widest uppercase mb-3" style={{ color: "#e84393" }}>👶 Shop by Gender</div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {MEGA.genders.map((g) => (
                      <Link key={g.label} href={`/shop?gender=${encodeURIComponent(g.path)}`} onClick={closeMobileMenu}
                        className="flex flex-col items-center p-3 rounded-xl no-underline font-extrabold text-[0.8rem]"
                        style={{ border: "2px solid #fce4ef", color: "#555", background: "#fff" }}>
                        <span className="text-2xl">{g.emoji}</span>{g.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mb-5">
                  <div className="text-[0.75rem] font-black tracking-widest uppercase mb-3" style={{ color: "#e84393" }}>⚡ Quick Access</div>
                  {[
                    { l: "New Arrivals", href: "/shop?sortBy=latest" },
                    { l: "Best Sellers", href: "/shop?tags=Bestseller" },
                    { l: "Flash Sale", href: "/shop?tags=Sale" },
                    { l: "Under Rs.1000", href: "/shop?maxPrice=1000" },
                  ].map(({ l, href }) => (
                    <Link key={l} href={href} onClick={closeMobileMenu}
                      className="block py-2.5 pl-4 font-semibold text-[1rem] no-underline"
                      style={{ color: "#666", borderBottom: "1px solid #fce4ef" }}>
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/contact" onClick={closeMobileMenu}
            className="flex items-center justify-between py-3.5 no-underline font-extrabold text-lg"
            style={{ borderBottom: "1px solid #fce4ef", color: pathname === "/contact" ? "#e84393" : "#444" }}>
            Contact
          </Link>
        </div>

        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="mx-5 mb-3 py-3 flex items-center justify-center gap-2 rounded-full font-extrabold text-white no-underline text-base"
          style={{ background: "#25D366" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp Us
        </a>

        <div className="mx-5 my-2 p-5 rounded-2xl"
          style={{ background: "linear-gradient(160deg,#fff0f6 0%,#fce4ef 100%)" }}>
          <span className="text-[10px] font-black uppercase" style={{ color: "#e84393" }}>✨ The Toy Stack</span>
          <h3 className="text-[1.2rem] font-black mt-1 mb-3 text-gray-900">DISCOVER PLAYTIME MAGIC</h3>
          <div className="flex gap-4 mb-3">
            {[ { val: "4.9★", l: "Rating" }].map(({ val, l }) => (
              <div key={l}>
                <span className="text-[1.1rem] font-black" style={{ color: "#e84393" }}>{val}</span>
                <div className="text-[10px] text-gray-400">{l}</div>
              </div>
            ))}
          </div>
          <Link href="/shop" onClick={closeMobileMenu}
            className="inline-block text-white px-5 py-2.5 rounded-full text-xs font-black no-underline"
            style={{ background: "#e84393" }}>
            SHOP ALL →
          </Link>
        </div>

        <Link href="/cart"
          onClick={(e) => { if (onCartClick) onCartClick(e); closeMobileMenu(); }}
          className="mx-5 mb-5 py-3 text-white no-underline text-center rounded-full font-extrabold text-lg flex items-center justify-center gap-2"
          style={{ background: "#e84393" }}>
          🛒 View Cart {localCartCount > 0 && `(${localCartCount})`}
        </Link>
      </div>
    </>
  );
}