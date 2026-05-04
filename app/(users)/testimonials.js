"use client";

import "swiper/css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import GoogleReviewsWidget from "google-reviews-widget";



// const testimonials = [
//   {
//     name: "Rohit Sharma",
//     initials: "RS",
//     date: "23 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Very अच्छा product hai. Quality expected se better nikli. Mere baby ko ye toy bahut pasand aaya, daily use kar raha hai.",
//     product: "Rotating Musical Doll Toy",
//     price: "₹499",
//     avatarBg: "from-pink-400 to-rose-500",
//   },
//   {
//     name: "Priya Verma",
//     initials: "PV",
//     date: "16 June 2024",
//     rating: 4,
//     ratingCount: 4.5,
//     text: "Delivery fast thi aur packaging bhi safe thi. Product bilkul same hai jaise photos mein dikhaya tha. Value for money 👍",
//     product: "3D Musical Doll Toy",
//     price: "₹899",
//     avatarBg: "from-blue-400 to-indigo-500",
//   },
//   {
//     name: "Amit Kumar",
//     initials: "AK",
//     date: "12 June 2024",
//     rating: 5,
//     ratingCount: 4,
//     text: "Build quality strong hai aur sound bhi clear hai. Is price range mein kaafi acha option hai. Definitely recommend.",
//     product: "Rotating Baby Toy",
//     price: "₹699",
//     avatarBg: "from-amber-400 to-orange-500",
//   },
//   {
//     name: "Neha Gupta",
//     initials: "NG",
//     date: "3 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Mere 2 saal ke baby ko bahut pasand aaya. Lights aur music dono ache hain. Worth buying for kids.",
//     product: "Musical Light Toy",
//     price: "₹799",
//     avatarBg: "from-emerald-400 to-teal-500",
//   },
//   {
//     name: "Sandeep Yadav",
//     initials: "SY",
//     date: "8 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Online toys mein usually doubt hota hai but ye product genuine nikla. Delivery bhi time pe ho gayi. Happy with purchase.",
//     product: "Kids Rotating Doll",
//     price: "₹599",
//     avatarBg: "from-purple-400 to-fuchsia-500",
//   },
//   {
//     name: "Rohit Sharma",
//     initials: "RS",
//     date: "23 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Very अच्छा product hai. Quality expected se better nikli. Mere baby ko ye toy bahut pasand aaya, daily use kar raha hai.",
//     product: "Rotating Musical Doll Toy",
//     price: "₹499",
//     avatarBg: "from-pink-400 to-rose-500",
//   },
//   {
//     name: "Priya Verma",
//     initials: "PV",
//     date: "16 June 2024",
//     rating: 4,
//     ratingCount: 4.5,
//     text: "Delivery fast thi aur packaging bhi safe thi. Product bilkul same hai jaise photos mein dikhaya tha. Value for money 👍",
//     product: "3D Musical Doll Toy",
//     price: "₹899",
//     avatarBg: "from-blue-400 to-indigo-500",
//   },
//   {
//     name: "Amit Kumar",
//     initials: "AK",
//     date: "12 June 2024",
//     rating: 5,
//     ratingCount: 4,
//     text: "Build quality strong hai aur sound bhi clear hai. Is price range mein kaafi acha option hai. Definitely recommend.",
//     product: "Rotating Baby Toy",
//     price: "₹699",
//     avatarBg: "from-amber-400 to-orange-500",
//   },
//   {
//     name: "Neha Gupta",
//     initials: "NG",
//     date: "3 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Mere 2 saal ke baby ko bahut pasand aaya. Lights aur music dono ache hain. Worth buying for kids.",
//     product: "Musical Light Toy",
//     price: "₹799",
//     avatarBg: "from-emerald-400 to-teal-500",
//   },
//   {
//     name: "Sandeep Yadav",
//     initials: "SY",
//     date: "8 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Online toys mein usually doubt hota hai but ye product genuine nikla. Delivery bhi time pe ho gayi. Happy with purchase.",
//     product: "Kids Rotating Doll",
//     price: "₹599",
//     avatarBg: "from-purple-400 to-fuchsia-500",
//   },
//   {
//     name: "Rohit Sharma",
//     initials: "RS",
//     date: "23 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Very अच्छा product hai. Quality expected se better nikli. Mere baby ko ye toy bahut pasand aaya, daily use kar raha hai.",
//     product: "Rotating Musical Doll Toy",
//     price: "₹499",
//     avatarBg: "from-pink-400 to-rose-500",
//   },
//   {
//     name: "Priya Verma",
//     initials: "PV",
//     date: "16 June 2024",
//     rating: 4,
//     ratingCount: 4.5,
//     text: "Delivery fast thi aur packaging bhi safe thi. Product bilkul same hai jaise photos mein dikhaya tha. Value for money 👍",
//     product: "3D Musical Doll Toy",
//     price: "₹899",
//     avatarBg: "from-blue-400 to-indigo-500",
//   },
//   {
//     name: "Amit Kumar",
//     initials: "AK",
//     date: "12 June 2024",
//     rating: 5,
//     ratingCount: 4,
//     text: "Build quality strong hai aur sound bhi clear hai. Is price range mein kaafi acha option hai. Definitely recommend.",
//     product: "Rotating Baby Toy",
//     price: "₹699",
//     avatarBg: "from-amber-400 to-orange-500",
//   },
//   {
//     name: "Neha Gupta",
//     initials: "NG",
//     date: "3 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Mere 2 saal ke baby ko bahut pasand aaya. Lights aur music dono ache hain. Worth buying for kids.",
//     product: "Musical Light Toy",
//     price: "₹799",
//     avatarBg: "from-emerald-400 to-teal-500",
//   },
//   {
//     name: "Sandeep Yadav",
//     initials: "SY",
//     date: "8 June 2024",
//     rating: 5,
//     ratingCount: 5,
//     text: "Online toys mein usually doubt hota hai but ye product genuine nikla. Delivery bhi time pe ho gayi. Happy with purchase.",
//     product: "Kids Rotating Doll",
//     price: "₹599",
//     avatarBg: "from-purple-400 to-fuchsia-500",
//   },
// ];

// function StarRating({ rating, count }) {
//   return (
//     <div className="flex items-center gap-1.5">
//       <div className="flex">
//         {[1, 2, 3, 4, 5].map((s) => (
//           <svg
//             key={s}
//             className={`w-3.5 h-3.5 ${s <= rating ? "text-amber-400" : "text-gray-200"}`}
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
//           </svg>
//         ))}
//       </div>
//       <span className="text-[11px] font-bold text-gray-400">({count})</span>
//     </div>
//   );
// }

// function TestimonialCard({ t, offset }) {
//   return (
//     <div
//       className={`bg-white border border-gray-100 rounded-2xl p-5 py-10 shadow-sm hover:shadow-xl hover:shadow-pink-100/60 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 w-[260px] ${offset ? "mt-8" : "mt-0"}`}
//     >
//       {/* Top: name + date */}
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-[13px] font-black text-gray-800 leading-tight">
//             {t.name}
//           </p>
//           <p className="text-[11px] text-gray-400 mt-0.5">{t.date}</p>
//         </div>
//         <span className="text-[9px] font-black bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
//           ✓ Verified
//         </span>
//       </div>

//       {/* Stars */}
//       <StarRating rating={t.rating} count={t.ratingCount} />

//       {/* Review text */}
//       <p className="text-[12px] text-gray-500 leading-relaxed italic flex-1">
//         &quot;{t.text}&quot;
//       </p>

//       {/* Divider */}
//       <div className="border-t border-dashed border-gray-100" />

//       {/* Product footer */}
//       <div className="flex items-center gap-2.5">
//         <div
//           className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white text-[11px] font-black shrink-0`}
//         >
//           {t.initials}
//         </div>
//         <div className="min-w-0">
//           <p className="text-[11px] font-bold text-gray-700 leading-tight truncate">
//             {t.product}
//           </p>
//           <p className="text-[12px] font-black text-pink-500 mt-0.5">
//             {t.price}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

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

        {/* Carousel — loop + autoplay work because CSS is imported above */}
        {/* <Swiper
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={16}
            loop={true}
            loopAdditionalSlides={5}
            watchSlidesProgress={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            speed={800}
          >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i} style={{ width: "260px" }}>
              <TestimonialCard t={t} offset={i % 2 !== 0} />
            </SwiperSlide>
          ))}
        </Swiper> */}

        {/* Elfsight Google Reviews | Untitled Google Reviews */}
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <div className="elfsight-app-ebeacab4-832b-4bc2-9dcd-6eeefd1a5511" data-elfsight-app-lazy></div>
      </div>
    </section>
  );
}
