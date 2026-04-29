"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";

const VIDEO_URLS = [
  "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1351434100046487&show_text=false",
  "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F840131985067800&show_text=false",
  "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2721033548277503&show_text=false",
  "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4073453562911140&show_text=false",
  "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4304687176485557&show_text=false",
  "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1693333952112514&show_text=false",
  "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1674907590812780&show_text=false",
];

export default function FacebookVideos() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleSlideChange = (swiper) => {
    // Use realIndex to correctly track position in loop mode
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section className="relative overflow-hidden bg-white py-16">
      {/* Soft ambient blobs — no hard shadows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-pink-100 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-yellow-50 opacity-40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-full">
        {/* Heading */}
        <div className="mb-10 px-4 text-center">
          <h2 className="mb-3 text-3xl font-black text-slate-900 md:text-5xl">
            Fun with <span className="text-[#E84393]">Us</span> ✨
          </h2>
          <p className="mx-auto max-w-2xl text-sm font-semibold text-gray-500 md:text-base">
            Join our community and see the magic of play!
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 20,       // slight pull-together feel
              depth: 80,
              modifier: 1,
              slideShadows: false, // ← kills the built-in Swiper shadow completely
            }}
            navigation={{
              nextEl: ".fb-next",
              prevEl: ".fb-prev",
            }}
            onActiveIndexChange={handleSlideChange}
            className="fb-swiper !py-8"
          >
            {VIDEO_URLS.map((url, index) => {
              const isActive = index === activeIndex;

              return (
                <SwiperSlide key={index} className="fb-slide">
                  <div
                    className={`
                      relative aspect-[9/16] w-full overflow-hidden rounded-[1.75rem] bg-black
                      transition-all duration-500 ease-out
                      ${isActive
                        ? "scale-100 opacity-100"
                        : "scale-[0.82] opacity-50 grayscale-[15%]"
                      }
                    `}
                  >
                    {/* Subtle border on active card only */}
                    {isActive && (
                      <div className="pointer-events-none absolute inset-0 z-10 rounded-[1.75rem] ring-2 ring-white/30" />
                    )}
                    <iframe
                      src={url}
                      width="100%"
                      height="100%"
                      style={{ border: "none", overflow: "hidden" }}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Nav buttons — centered below carousel */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <button className="fb-prev flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:bg-[#E84393] hover:text-white active:scale-95">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="fb-next flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:bg-[#E84393] hover:text-white active:scale-95">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .fb-swiper {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .fb-slide {
          width: 220px !important;   /* fixed card width */
          display: flex;
          justify-content: center;
          align-items: center;
        }
        /* Kill Swiper's own generated shadow divs */
        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right {
          display: none !important;
        }
      `}</style>
    </section>
  );
}