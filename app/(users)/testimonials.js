"use client";

export default function Testimonials() {
  return (
    <section className="py-20 overflow-visible relative">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #f2608a 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-6xl md:text-7xl font-normal font-['Arial'] text-gray-800 tracking-wider pb-2">
            <span className="text-[#0f72f1ff]">G</span>
            <span className="text-[#f61111ff]">o</span>
            <span className="text-[#f8c51cff]">o</span>
            <span className="text-[#0f72f1ff]">g</span>
            <span className="text-[#11d466ff]">l</span>
            <span className="text-[#f61111ff]">e</span>
          </h2>
          <h2 className="text-3xl md:text-4xl font-medium font-['Arial'] text-gray-400 tracking-wider">
            Reviews
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-semibold">
            ⭐ ⭐ ⭐ ⭐ ⭐
          </p>
        </div>

        {/* Elfsight Google Reviews Widget Container */}
        <div className="elfsight-app-ebeacab4-832b-4bc2-9dcd-6eeefd1a5511"></div>
      </div>
    </section>
  );
}
