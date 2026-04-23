"use client";

import { useState, Fragment } from "react";
import Image from "next/image";

// ── Inline SVG icons (replaces react-icons to avoid extra deps) ──────────────
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);
const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Constants ─────────────────────────────────────────────────────────────────

const heroStars = [
  { size: "text-xl", top: "top-10", left: "left-[8%]", delay: "0s" },
  { size: "text-3xl", top: "top-20", left: "left-[42%]", delay: "1.2s" },
  { size: "text-2xl", top: "top-14", right: "right-[12%]", delay: "2.1s" },
  { size: "text-lg", top: "top-[52%]", left: "left-[6%]", delay: "0.8s" },
  { size: "text-4xl", top: "top-[60%]", right: "right-[8%]", delay: "1.7s" },
  { size: "text-xl", top: "bottom-12", left: "left-[34%]", delay: "2.6s" },
];

const waNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567"
).replace(/\D/g, "");
const mapLocation =
  process.env.NEXT_PUBLIC_MAP_LOCATION ||
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3498.108502575005!2d77.19453617550505!3d28.74616675603734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDQ0JzQ2LjIiTiA3N8KwMTEnNDkuNiJF!5e0!3m2!1sen!2sin!4v1745403061619!5m2!1sen!2sin";

const CARDS = [
  {
    icon: <BuildingIcon />,
    label: "Shop",
    value: process.env.NEXT_PUBLIC_ADDRESS
      ? process.env.NEXT_PUBLIC_ADDRESS
      : "Kh no 793/1 Budh bazar road kamalpur Burari Delhi 110084",
    iconBg: "bg-[#fff0f4]",
    iconColor: "text-[#f74872]",
  },
  {
    icon: <MailIcon />,
    label: "Email Address",
    value: process.env.EMAIL_FROM || "toysforkidsdelhi@gmail.com",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: <PhoneIcon />,
    label: "Phone Number",
    value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSend = () => {
    const { name, email, phone, subject, message } = form;
    if (!name || !email || !message) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    const text = encodeURIComponent(
      `👋 *New Contact Request*\n\n` +
        `*Name:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Phone:* ${phone || "N/A"}\n` +
        `*Subject:* ${subject || "N/A"}\n\n` +
        `*Message:*\n${message}`,
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-[#0f0a0c] font-['DM_Sans',sans-serif]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#ffcf7d] px-12 pb-20 pt-[100px] max-sm:px-6 max-sm:pt-20 max-sm:pb-16">
        {/* noise overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated Stars */}
        <div className="pointer-events-none absolute inset-0">
          {heroStars.map((star, index) => (
            <span
              key={index}
              className={`absolute ${star.size} ${star.top} ${star.left || ""} ${star.right || ""} text-white/90 drop-shadow-[0_0_18px_rgba(255,255,255,0.75)] animate-hero-star`}
              style={{ animationDelay: star.delay }}
            >
              ✦
            </span>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8">
          {/* left copy */}
          <div>
            {/* pill */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: "rgba(247,72,114,0.15)",
                border: "1px solid rgba(247,72,114,0.35)",
                color: "#f74872",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#f74872]"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              Get In Touch
            </div>

            <h1
              className="font-['Playfair_Display',serif] font-black leading-[1.05] text-[#2b1a12]"
              style={{
                fontSize: "clamp(3rem,6vw,5.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Let's <em className="not-italic text-[#f74872]">Talk</em>
              <br />
              Toys &amp; More
            </h1>

            <div className="my-5 h-0.5 w-12 bg-[#f74872]" />

            <p
              className="max-w-[340px] leading-[1.7] text-[#2b1a12] !font-semibold"
              style={{ fontSize: 15, fontWeight: 300 }}
            >
              A question about your order, a partnership idea, or just want to
              say hi — we're here and happy to help.
            </p>
          </div>

          {/* right stats – hidden on mobile */}
          <div className="hidden flex-col items-end gap-3 md:flex ">
            {[
              { num: "2min", suffix: ".", label: "avg. reply time" },
              { num: "98", suffix: "%", label: "satisfaction rate" },
              { num: "24", suffix: "/7", label: "WhatsApp support" },
            ].map(({ num, suffix, label }, i) => (
              <Fragment key={label}>
                {i > 0 && (
                  <div
                    className="self-center "
                    style={{ width: 1, height: 40 }}
                  />
                )}
                <div className="text-right">
                  <div
                    className="font-['Playfair_Display',serif] font-bold leading-none text-white"
                    style={{ fontSize: "3.8rem" }}
                  >
                    {num}
                    <span className="text-[#f74872]">{suffix}</span>
                  </div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#2b1a12] font-semibold">
                    {label}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      <Image
        src="/home page/hero-border-2.png"
        alt="Contact"
        width={1000}
        height={1000}
        className="bottom-0 left-0 right-0 z-0 w-full bg-[#fccf7d]"
      />

      {/* ── INFO CARDS ───────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto -mt-9 grid max-w-6xl grid-cols-2  gap-4 px-12 lg:grid-cols-3 max-sm:grid-cols-1 max-sm:px-6">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={[
              "flex flex-col justify-center items-center gap-4 rounded-2xl bg-white p-7",
              "transition-[transform,box-shadow] duration-[350ms]",
              "hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(15,10,12,0.1)]",
            ].join(" ")}
            style={{
              border: "1px solid #ecdde2",
              boxShadow: "0 2px 12px rgba(15,10,12,0.05)",
              // cubic-bezier for the spring feel:
              transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${card.iconBg} ${card.iconColor}`}
            >
              {card.icon}
            </div>
            <div>
              <div
                className="mb-1 text-[16px] text-center font-semibold uppercase tracking-[0.12em]"
                style={{ color: "#9a7d86" }}
              >
                {card.label}
              </div>
              <div
                className="whitespace-pre-line text-center text-[15px] font-medium leading-[1.65]"
                style={{ color: "#0f0a0c" }}
              >
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto mb-20 mt-16 grid max-w-6xl grid-cols-1 items-start gap-8 px-12 lg:grid-cols-2 max-sm:px-6">
        {/* ── FORM ── */}
        <div
          className="rounded-3xl bg-white p-12 max-sm:p-8"
          style={{
            border: "1px solid #ecdde2",
            boxShadow: "0 4px 24px rgba(15,10,12,0.05)",
          }}
        >
          <div
            className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#f74872" }}
          >
            Send a Message
          </div>
          <h2
            className="mb-8 font-['Playfair_Display',serif] text-[2rem] font-bold leading-tight"
            style={{ color: "#0f0a0c" }}
          >
            We'd love to
            <br />
            hear from you
          </h2>

          {/* Row 1 */}
          <div className="mb-3.5 grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <Field label="Your Name *">
              <input
                name="name"
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                className="contact-input"
              />
            </Field>
            <Field label="Email Address *">
              <input
                name="email"
                type="email"
                placeholder="jane@email.com"
                value={form.email}
                onChange={handleChange}
                className="contact-input"
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="mb-3.5 grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <Field label="Phone Number">
              <input
                name="phone"
                type="text"
                placeholder="+92 300 1234567"
                value={form.phone}
                onChange={handleChange}
                className="contact-input"
              />
            </Field>
            <Field label="Subject">
              <input
                name="subject"
                type="text"
                placeholder="Order enquiry…"
                value={form.subject}
                onChange={handleChange}
                className="contact-input"
              />
            </Field>
          </div>

          {/* Message */}
          <div className="mb-3.5">
            <Field label="Message *">
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us how we can help…"
                value={form.message}
                onChange={handleChange}
                className="contact-input resize-none"
              />
            </Field>
          </div>

          {/* Submit */}
          <button
            onClick={handleSend}
            className={[
              "mt-2 flex w-full items-center justify-center gap-2.5 rounded-[14px]",
              "bg-[#f74872] px-6 py-4 text-sm font-semibold tracking-[0.04em] text-white",
              "transition-[background,transform,box-shadow] duration-[250ms,200ms,250ms]",
              "hover:-translate-y-0.5 hover:bg-[#c9274f]",
              "active:translate-y-0",
            ].join(" ")}
            style={{ boxShadow: "0 8px 24px rgba(247,72,114,0.28)" }}
          >
            <WaIcon />
            Send via WhatsApp
          </button>

          <p className="mt-3.5 text-center text-[11.5px] text-[#2b1a12]">
            ⚡ We typically reply within{" "}
            <strong className="font-semibold text-[#f74872]">2 minutes</strong>{" "}
            · 9 AM – 10 PM
          </p>
        </div>

        {/* ── MAP SIDE ── */}
        <div className="flex flex-col gap-5">
          {/* Map */}
          <div
            className="group overflow-hidden rounded-3xl"
            style={{
              border: "1px solid #ecdde2",
              boxShadow: "0 4px 24px rgba(15,10,12,0.05)",
              height: 420,
            }}
          >
            <iframe
              src={mapLocation}
              loading="lazy"
              title="Store Location"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-full w-full border-0 transition-[filter] duration-[400ms]"
              style={{ filter: "grayscale(20%) saturate(90%)" }}
              // Tailwind can't toggle :hover filter on iframe; inline onMouseEnter/Leave works:
              onMouseEnter={(e) => (e.currentTarget.style.filter = "none")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.filter = "grayscale(20%) saturate(90%)")
              }
            />
          </div>

          {/* Hours card */}
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl px-8 py-7 bg-white shadow-md">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2b1a12]">
                Working Hours
              </div>
              <div className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2b1a12]">
                9 AM – 10 PM
              </div>
            </div>
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2.5"
              style={{
                background: "rgba(247,72,114,0.15)",
                border: "1px solid rgba(247,72,114,0.3)",
              }}
            >
              <span
                className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-[#f74872]"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              <span className="text-xs font-semibold text-[#f74872]">
                We're open today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Global styles (animation + shared input style) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }

        .contact-input {
          background: #f8f5f6;
          border: 1.5px solid #ecdde2;
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #0f0a0c;
          outline: none;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .contact-input::placeholder { color: #c4b2b8; }
        .contact-input:focus {
          border-color: #f74872;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(247,72,114,0.08);
        }
      `}</style>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: "#9a7d86" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
