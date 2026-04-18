"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/admin/home" },
  { name: "Add Products", path: "/admin/home/addProduct" },
  { name: "My Shop", path: "/admin/home/shop" },
  { name: "Settings", path: "/admin/home/settings" },
];

export default function Navbar({ cartCount = 0, onCartClick }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <>
      

      <nav className="sticky top-0 z-[999] border-b border-[#f0f0f0] bg-white px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex items-center gap-1 text-[28px] font-black tracking-[-0.06em] lg:justify-self-start">
            <span className="text-[#E84393]">KIDD</span>
            <span className="text-[#FFB800]">EX</span>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-[#444] lg:gap-6 lg:justify-self-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className="cursor-pointer text-[#444] transition-colors duration-200 hover:text-[#E84393]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex justify-end lg:justify-self-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E84393] to-[#FFB800] px-5 py-2 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
        </div>
      </nav>
    </>
  );
}