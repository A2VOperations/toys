"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const FALLBACK_IDS = ["O9FpMgNowYw"];

// ── Butterfly & Star data helpers ───────────────────────
const generateButterflies = () => Array.from({ length: 6 }, (_, i) => ({
  id: i,
  size: 28 + Math.random() * 22,
  startX: Math.random() * 100,
  startY: Math.random() * 100,
  duration: 12 + Math.random() * 10,
  delay: Math.random() * 8,
  flapDuration: 0.6 + Math.random() * 0.4,
  color: ["#ff6eb4","#ffb347","#a78bfa","#34d399","#60a5fa","#f472b6"][i % 6],
  wingColor: ["#ffd6ec","#ffe4b5","#ddd6fe","#a7f3d0","#bfdbfe","#fbcfe8"][i % 6],
}));

const generateStars = () => Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  duration: 2 + Math.random() * 3,
  delay: Math.random() * 4,
  color: ["#fff","#ffe066","#f9a8d4","#a5f3fc","#c4b5fd"][i % 5],
}));

// ── Butterfly SVG component ──────────────────────────────────────
function Butterfly({ size, color, wingColor }) {
  return (
    <svg width={size * 2} height={size * 1.4} viewBox="0 0 60 42" fill="none">
      {/* Left wings */}
      <ellipse cx="18" cy="14" rx="16" ry="11" fill={wingColor} opacity="0.85" />
      <ellipse cx="14" cy="28" rx="12" ry="8" fill={color} opacity="0.7" />
      {/* Right wings */}
      <ellipse cx="42" cy="14" rx="16" ry="11" fill={wingColor} opacity="0.85" />
      <ellipse cx="46" cy="28" rx="12" ry="8" fill={color} opacity="0.7" />
      {/* Wing details */}
      <ellipse cx="18" cy="14" rx="7" ry="5" fill={color} opacity="0.4" />
      <ellipse cx="42" cy="14" rx="7" ry="5" fill={color} opacity="0.4" />
      {/* Body */}
      <ellipse cx="30" cy="21" rx="3" ry="12" fill="#5b3a1a" opacity="0.85" />
      {/* Antennae */}
      <path d="M28 10 Q24 2 20 1" stroke="#5b3a1a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="1" r="1.5" fill={color} />
      <path d="M32 10 Q36 2 40 1" stroke="#5b3a1a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <circle cx="40" cy="1" r="1.5" fill={color} />
    </svg>
  );
}

export default function VideoCarousel() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const playerRefs = useRef([]);
  const [reelIds, setReelIds] = useState(FALLBACK_IDS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  useEffect(() => {
    fetch("/api/youtube-shorts")
      .then((r) => r.json())
      .then((data) => {
        if (data.ids?.length) setReelIds(data.ids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (window.YT && window.YT.Player) { initPlayers(); return; }
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () => { initPlayers(); };
  }, [loading, reelIds]);

  const initPlayers = useCallback(() => {
    reelIds.forEach((id, i) => {
      if (playerRefs.current[i]) return;
      playerRefs.current[i] = new window.YT.Player(`yt-player-${i}`, {
        videoId: id,
        playerVars: {
          autoplay: i === 0 ? 1 : 0,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
        },
        events: {
          onStateChange: (e) => {
            if (e.data === 0 && i === activeIndexRef.current) {
              setActiveIndex((prev) =>
                prev < reelIds.length - 1 ? prev + 1 : 0
              );
            }
          },
        },
      });
    });
  }, [reelIds]);

  useEffect(() => {
    scrollToIndex(activeIndex);
    playerRefs.current.forEach((player, i) => {
      if (!player?.pauseVideo) return;
      if (i === activeIndex) {
        player.seekTo(0);
        player.playVideo();
      } else {
        player.pauseVideo();
        player.seekTo(0);
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    const t = setTimeout(() => scrollToIndex(0), 150);
    return () => clearTimeout(t);
  }, [reelIds]);

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    const offset =
      card.offsetLeft - track.scrollLeft - track.clientWidth / 2 + card.offsetWidth / 2;
    track.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i > 0 ? i - 1 : reelIds.length - 1));
  }, [reelIds.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i < reelIds.length - 1 ? i + 1 : 0));
  }, [reelIds.length]);

  const handleScroll = useCallback(() => {
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0, minDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (d < minDist) { minDist = d; closest = i; }
      });
      setActiveIndex(closest);
    }, 150);
  }, []);

  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0, minDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < minDist) { minDist = d; closest = i; }
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
    trackRef.current.scrollLeft = scrollStart.current - (e.clientX - dragStartX.current);
  };
  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    snapToNearest();
  };

  if (loading) {
    return (
      <div className="w-full py-10 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fce4ec 0%, #e8f5e9 50%, #e3f2fd 100%)" }}>
        <div style={{ color: "#aaa", fontSize: 14 }}>Loading videos...</div>
      </div>
    );
  }

  // ── Card sizes (your values — untouched) ─────────────────────────
  const ACTIVE_W = 220;
  const ACTIVE_H = 400;
  const SIDE_W   = 200;
  const SIDE_H   = 380;

  return (
    <div
      className="w-full py-10 select-none overflow-hidden"
      style={{ position: "relative" }}
    >

      {/* ── CSS animations ── */}
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
        @keyframes drift {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Stars ── */}
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            pointerEvents: "none",
            zIndex: 0,
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        >
          {/* 4-point star shape */}
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
          <div style={{
            animation: `flapWings ${b.flapDuration}s ease-in-out infinite`,
            transformOrigin: "center",
          }}>
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
          zIndex: 5, // above butterflies
        }}
      >
        {reelIds.map((_, i) => {
          const isActive = i === activeIndex;
          const w = isActive ? ACTIVE_W : SIDE_W;
          const h = isActive ? ACTIVE_H : SIDE_H;

          return (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => { if (!isDragging.current && !isActive) setActiveIndex(i); }}
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
                transition: "width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1)",
              }}
            >
              <div
                id={`yt-player-${i}`}
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              />
              {!isActive && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  borderRadius: 18,
                  pointerEvents: "none",
                  zIndex: 20,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Arrows ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "center", gap: 16, marginTop: 14,
        position: "relative", zIndex: 5,
      }}>
        <button
          onClick={goPrev}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(4px)",
            border: "2px solid pink",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16, color: "#333",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,1)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.85)"}
          aria-label="Previous"
        >‹</button>

        <button
          onClick={goNext}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(4px)",
            border: "2px solid pink",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16, color: "#333",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,1)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,1)"}
          aria-label="Next"
        >›</button>
      </div>

    </div>
  );
}