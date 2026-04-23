"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    icon: "🚚",
    text: "Free Shipping on all orders over Rs.2500 — Shop now!",
    link: null,
  },
  {
    icon: "✅",
    text: "100% Trustworthy & Verified Toys — Quality Guaranteed",
    link: null,
  },
  {
    icon: "⚡",
    text: "Reliable Same-Day Delivery available in major cities",
    link: null,
  },
  { icon: "💬", text: "Need help? WhatsApp us at ", link: null },
  {
    icon: "🔒",
    text: "Secure Payments — COD, Card & EasyPaisa accepted",
    link: null,
  },
  {
    icon: "🎁",
    text: "Gift Wrapping available on all orders — Surprise someone today!",
    link: null,
  },
  {
    icon: "⭐",
    text: "4.9★ Rated by 10,000+ happy parents across Pakistan",
    link: null,
  },
  { icon: "🔄", text: "Easy 7-day Returns — No questions asked", link: null },
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
              <span className="text-sm md:text-[1rem] leading-none">{slide.icon}</span>
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
