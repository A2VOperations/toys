"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// ─── ADD YOUR LOCAL VIDEO FILES HERE ────────────────────────────────
// Place your video files in: /public/videos/
// Then just add the filename below

const ReviewsWidget = dynamic(() => import("../testimonials"), {
  ssr: false,
});

const LOCAL_VIDEOS = [
  "/facebook video/facebookVideo1.mp4",
  "/facebook video/facebookVideo2.mp4",
  "/facebook video/facebookVideo3.mp4",
  "/facebook video/facebookVideo4.mp4",
  "/facebook video/facebookVideo5.mp4",
  "/facebook video/facebookVideo6.mp4",
  "/facebook video/facebookVideo7.mp4",
  "/facebook video/facebookVideo8.mp4",
  "/facebook video/facebookVideo9.mp4",
];
// ────────────────────────────────────────────────────────────────────

// ── Butterfly & Star data helpers ───────────────────────
const generateButterflies = () =>
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 28 + Math.random() * 22,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    duration: 12 + Math.random() * 10,
    delay: Math.random() * 8,
    flapDuration: 0.6 + Math.random() * 0.4,
    color: ["#ff6eb4", "#ffb347", "#a78bfa", "#34d399", "#60a5fa", "#f472b6"][
      i % 6
    ],
    wingColor: [
      "#ffd6ec",
      "#ffe4b5",
      "#ddd6fe",
      "#a7f3d0",
      "#bfdbfe",
      "#fbcfe8",
    ][i % 6],
  }));

const generateStars = () =>
  Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 5,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 4,
    color: ["#fff", "#ffe066", "#f9a8d4", "#a5f3fc", "#c4b5fd"][i % 5],
  }));

function Butterfly({ size, color, wingColor }) {
  return (
    <svg width={size * 2} height={size * 1.4} viewBox="0 0 60 42" fill="none">
      <ellipse
        cx="18"
        cy="14"
        rx="16"
        ry="11"
        fill={wingColor}
        opacity="0.85"
      />
      <ellipse cx="14" cy="28" rx="12" ry="8" fill={color} opacity="0.7" />
      <ellipse
        cx="42"
        cy="14"
        rx="16"
        ry="11"
        fill={wingColor}
        opacity="0.85"
      />
      <ellipse cx="46" cy="28" rx="12" ry="8" fill={color} opacity="0.7" />
      <ellipse cx="18" cy="14" rx="7" ry="5" fill={color} opacity="0.4" />
      <ellipse cx="42" cy="14" rx="7" ry="5" fill={color} opacity="0.4" />
      <ellipse cx="30" cy="21" rx="3" ry="12" fill="#5b3a1a" opacity="0.85" />
      <path
        d="M28 10 Q24 2 20 1"
        stroke="#5b3a1a"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="20" cy="1" r="1.5" fill={color} />
      <path
        d="M32 10 Q36 2 40 1"
        stroke="#5b3a1a"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="40" cy="1" r="1.5" fill={color} />
    </svg>
  );
}

export default function LocalVideoCarousel() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const videoRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const scrollTimeout = useRef(null);

  const [stars, setStars] = useState([]);
  const [butterflies, setButterflies] = useState([]);

  useEffect(() => {
    setStars(generateStars());
    setButterflies(generateButterflies());
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // ── Play active, pause others ────────────────────────────────────
  useEffect(() => {
    scrollToIndex(activeIndex);
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    const mid = Math.floor(LOCAL_VIDEOS.length / 2);
    const t = setTimeout(() => scrollToIndex(mid), 150);
    return () => clearTimeout(t);
  }, []);

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    const offset =
      card.offsetLeft -
      track.scrollLeft -
      track.clientWidth / 2 +
      card.offsetWidth / 2;
    track.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i > 0 ? i - 1 : LOCAL_VIDEOS.length - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i < LOCAL_VIDEOS.length - 1 ? i + 1 : 0));
  }, []);

  const handleScroll = useCallback(() => {
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0,
        minDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (d < minDist) {
          minDist = d;
          closest = i;
        }
      });
      setActiveIndex(closest);
    }, 150);
  }, []);

  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0,
      minDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < minDist) {
        minDist = d;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStart.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    trackRef.current.scrollLeft =
      scrollStart.current - (e.clientX - dragStartX.current);
  };
  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    snapToNearest();
  };

  // ── Card sizes (your values — untouched) ────────────────────────
  const ACTIVE_W = 220;
  const ACTIVE_H = 400;
  const SIDE_W = 200;
  const SIDE_H = 380;

  return (
    <div
      className="w-full py-10 select-none overflow-hidden"
      style={{ position: "relative" }}
    >
      <style>{`
        @keyframes floatButterfly {
          0%   { transform: translate(0px, 0px) rotate(-8deg) scaleX(1); }
          20%  { transform: translate(40px, -30px) rotate(5deg) scaleX(1); }
          40%  { transform: translate(80px, 10px) rotate(-5deg) scaleX(-1); }
          60%  { transform: translate(50px, -50px) rotate(8deg) scaleX(-1); }
          80%  { transform: translate(20px, -20px) rotate(-3deg) scaleX(1); }
          100% { transform: translate(0px, 0px) rotate(-8deg) scaleX(1); }
        }
        @keyframes flapWings {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.55); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%       { opacity: 0.2; transform: scale(0.5); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Our <span className="text-[#f75781]">Gallery</span>
        </h2>
      </div>

      {/* ── Stars ── */}
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            pointerEvents: "none",
            zIndex: 0,
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        >
          <svg viewBox="0 0 20 20" width={s.size} height={s.size}>
            <polygon
              points="10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8"
              fill={s.color}
              opacity="0.85"
            />
          </svg>
        </div>
      ))}

      {/* ── Butterflies ── */}
      {butterflies.map((b) => (
        <div
          key={b.id}
          style={{
            position: "absolute",
            left: `${b.startX}%`,
            top: `${b.startY}%`,
            pointerEvents: "none",
            zIndex: 2,
            animation: `floatButterfly ${b.duration}s ${b.delay}s ease-in-out infinite`,
          }}
        >
          <div
            style={{
              animation: `flapWings ${b.flapDuration}s ease-in-out infinite`,
              transformOrigin: "center",
            }}
          >
            <Butterfly size={b.size} color={b.color} wingColor={b.wingColor} />
          </div>
        </div>
      ))}

      {/* ── Track ── */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          overflowX: "auto",
          paddingLeft: "calc(50vw - 110px)",
          paddingRight: "calc(50vw - 110px)",
          paddingBottom: 16,
          scrollbarWidth: "none",
          cursor: "grab",
          position: "relative",
          zIndex: 5,
        }}
      >
        {LOCAL_VIDEOS.map((src, i) => {
          const isActive = i === activeIndex;
          const w = isActive ? ACTIVE_W : SIDE_W;
          const h = isActive ? ACTIVE_H : SIDE_H;

          return (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => {
                if (!isDragging.current && !isActive) setActiveIndex(i);
              }}
              style={{
                flexShrink: 0,
                width: w,
                height: h,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "none",
                cursor: isActive ? "default" : "pointer",
                position: "relative",
                background: "#111",
                zIndex: isActive ? 10 : 1,
                transition:
                  "width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1)",
              }}
            >
              {/* ── Native HTML5 video — no YouTube, no API ── */}
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={src}
                muted
                playsInline
                loop={false}
                preload="metadata"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                // Auto-advance when video ends — infinite loop back to first
                onEnded={() => {
                  setActiveIndex((prev) =>
                    prev < LOCAL_VIDEOS.length - 1 ? prev + 1 : 0,
                  );
                }}
              />

              {/* Dark overlay + blocks pause icon on non-active */}
              {!isActive && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    borderRadius: 18,
                    pointerEvents: "none",
                    zIndex: 20,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Arrows ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginTop: 14,
          position: "relative",
          zIndex: 5,
        }}
      >
        <button
          onClick={goPrev}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(4px)",
            border: "2px solid pink",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 16,
            color: "#333",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.85)")
          }
          aria-label="Previous"
        >
          ‹
        </button>

        <button
          onClick={goNext}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(4px)",
            border: "2px solid pink",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 16,
            color: "#333",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,1)")
          }
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <ReviewsWidget />
    </div>
  );
}
