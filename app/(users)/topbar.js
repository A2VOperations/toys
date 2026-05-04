"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    icon: "🚚",
    text: "Free Shipping on orders over ₹8000",
    link: null,
  },
  {
    icon: "🏷️",
    text: "Best Wholesale Prices & Bulk Deals Available",
    link: null,
  },
  {
    icon: "🎁",
    text: "Perfect Return Gifts for Birthdays & Events",
    link: null,
  },
  {
    icon: "🧸",
    text: "Trending Toys, School Essentials & New Arrivals",
    link: null,
  },
  {
    icon: "🏊",
    text: "Summer Specials: Pool Toys & Accessories",
    link: null,
  },
  {
    icon: "🚀",
    text: "Same Day Dispatch for orders before 12 PM",
    link: null,
  },
  {
    icon: "⭐",
    text: "Trusted by Thousands of Happy Customers",
    link: null,
  },
];

export default function topbar() {
  return (
    <div className="w-full bg-black h-[60px] flex items-center overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={3000}
        slidesPerView="auto"
        allowTouchMove={false}
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} style={{ width: "auto" }}>
            <div className="flex items-center gap-2 text-white font-bold tracking-wide text-[0.72rem] md:text-[20px] h-[36px] px-8 whitespace-nowrap">
              <span className="text-sm md:text-[1rem] leading-none">
                {slide.icon}
              </span>
              {slide.link ? (
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white no-underline hover:underline underline-offset-2"
                >
                  {slide.text}
                </a>
              ) : (
                <span>{slide.text}</span>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
