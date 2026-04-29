"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { name: "Home", path: "/admin/home" },
  { name: "Add Products", path: "/admin/home/addProduct" },
  { name: "My Shop", path: "/admin/home/shop" },
  { name: "Banners", path: "/admin/home/banners" },
  { name: "Settings", path: "/admin/home/settings" },
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <nav className="sticky top-0 z-999 bg-white border-b border-[#f0f0f0] shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
      {/* Desktop row */}
      <div className="flex items-center justify-between h-[70px] px-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-[26px] font-black tracking-[-0.06em] shrink-0">
          <Link
            href="/"
            className="relative shrink-0 flex items-center  transition-transform duration-200 z-99999"
          >
              <Image
                src="/Toy for kids log.png"
                alt="Logo"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
          </Link>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#444]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className="hover:text-[#E84393] transition-colors duration-200"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop logout */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 bg-linear-to-r from-[#E84393] to-[#FFB800] text-white text-sm font-bold px-5 py-2 rounded-full shadow-md hover:opacity-90 transition-all active:scale-95 shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-5 pb-4 flex flex-col gap-1 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-[#444] hover:text-[#E84393] hover:bg-pink-50 px-3 py-3 rounded-lg transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 bg-linear-to-r from-[#E84393] to-[#FFB800] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md hover:opacity-90 transition-all w-full justify-center"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
