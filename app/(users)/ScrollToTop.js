"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      setScrollPercent(Math.round(percent));
      setVisible(scrollY > 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SVG circle progress
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollPercent / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{ fontFamily: "'Nunito', sans-serif" }}
      className={`
        fixed bottom-6 right-6 z-[9999]
        w-14 h-14
        flex items-center justify-center
        rounded-full
        bg-white
        shadow-[0_8px_32px_rgba(232,67,147,0.25)]
        border-2 border-[#fce4ef]
        transition-all duration-500 ease-out
        hover:scale-110 hover:shadow-[0_12px_40px_rgba(232,67,147,0.4)]
        hover:border-[#e84393]
        active:scale-95
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"}
      `}
    >
      {/* Circular progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 56 56"
      >
        {/* Track */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#fce4ef"
          strokeWidth="2.5"
        />
        {/* Progress */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#e84393"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.2s ease" }}
        />
      </svg>

      {/* Arrow icon */}
      <svg
        className="relative z-10 w-5 h-5 text-[#e84393]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
