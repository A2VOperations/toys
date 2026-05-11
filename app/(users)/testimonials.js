"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";

const testimonials = [
  {
    name: "Pavithra Sathish",
    time: "a day ago",
    rating: 5,
    text: "Toys for kids have so much collections and the price is reasonable. They deliver with good condition recommended for all the parents for latest collections and birthday return gifts..",
    initial: "P",
    bgColor: "bg-gray-500",
  },
  {
    name: "Sruthi Sairam",
    time: "a day ago",
    rating: 5,
    text: "Been purchasing for more than a year now. Very humble and good people. Shows all the products very clearly. Have best pricing. They pack neatly and dispatch. All products are checked, verified duly and dispatched.",
    initial: "S",
    bgColor: "bg-blue-700",
  },
  {
    name: "Nagalakshmi Pai",
    time: "2 weeks ago",
    rating: 5,
    text: "Very good products, quick reply, customers satisfied with all the products,  reasonable prices too...",
    initial: "N",
    bgColor: "bg-red-700",
  },
  {
    name: "Piyush Sharma",
    time: "1 month ago",
    rating: 5,
    text: "Good Items with affordable prices.",
    initial: "P",
    bgColor: "bg-emerald-700",
  },
  {
    name: "manali rambhiya",
    time: "1 month ago",
    rating: 5,
    text: "Absolutely lovely people both hardworking and frieny... my shopping with then is alqays very smooth and my lil one absolutely loves all the their articles n we are happy as they are superb quality and absolutely affordable",
    initial: "M",
    bgColor: "bg-purple-700",
  },
  {
    name: "Monika Sharma",
    time: "1 month ago",
    rating: 5,
    text: "Lot of varieties in reasonable prices. It's my go to destination for gifting 🙂",
    initial: "M",
    bgColor: "bg-blue-700",
  },
  {
    name: "naureen mustafa",
    time: "1 month ago",
    rating: 5,
    text: "Very nice toys, unique and different at very good prices. Trustworthy. I'm a regular buyer.",
    initial: "n",
    bgColor: "bg-purple-700",
  },
  {
    name: "VLS Eswari",
    time: "1 month ago",
    rating: 5,
    text: "Prices are much lower compared to other platforms. The staff are friendly, and I had an awesome experience",
    initial: "V",
    bgColor: "bg-purple-700",
  },
  {
    name: "Swati Agrawal",
    time: "2 months ago",
    rating: 5,
    text: "Prices are much lower compared to other platforms. The staff are friendly, and I had an awesome experience",
    initial: "S",
    bgColor: "bg-purple-700",
  },
];

const GoogleLogo = () => (
  <div className="flex items-center gap-0.5">
    <span className="text-[#4285F4] font-bold text-lg tracking-tighter">G</span>
    <span className="text-[#EA4335] font-bold text-lg tracking-tighter">o</span>
    <span className="text-[#FBBC05] font-bold text-lg tracking-tighter">o</span>
    <span className="text-[#4285F4] font-bold text-lg tracking-tighter">g</span>
    <span className="text-[#34A853] font-bold text-lg tracking-tighter">l</span>
    <span className="text-[#EA4335] font-bold text-lg tracking-tighter">e</span>
  </div>
);

export default function Testimonials() {
  const [randomTimes, setRandomTimes] = useState([]);
  const [isElfsightLoaded, setIsElfsightLoaded] = useState(true);

  useEffect(() => {
    // Generate random times
    const generateRandomTime = () => {
      const units = ["hour", "day", "week"];
      const unit = units[Math.floor(Math.random() * units.length)];
      if (unit === "hour") {
        const hours = Math.floor(Math.random() * 23) + 1;
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (unit === "day") {
        const days = Math.floor(Math.random() * 6) + 1;
        return `${days} day${days > 1 ? "s" : ""} ago`;
      } else {
        return "1 week ago";
      }
    };
    setRandomTimes(testimonials.map(() => generateRandomTime()));

    // Elfsight ID to monitor
    const elfsightSelector = ".elfsight-app-76cced13-196a-4907-9605-5a5159551101";

    // 1. MutationObserver to detect if Elfsight loads content ANYTIME
    const observer = new MutationObserver(() => {
      const widget = document.querySelector(elfsightSelector);
      if (widget && widget.children.length > 0) {
        setIsElfsightLoaded(true);
      }
    });

    const elfsightWidget = document.querySelector(elfsightSelector);
    if (elfsightWidget) {
      observer.observe(elfsightWidget, { childList: true });
    }

    // 2. Timeout to decide if we should show fallback after initial wait
    const timer = setTimeout(() => {
      const widget = document.querySelector(elfsightSelector);
      // If widget is still empty after 5 seconds, show fallback
      if (!widget || widget.children.length === 0) {
        setIsElfsightLoaded(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="py-20 bg-white overflow-hidden relative group font-sans">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #f2608a 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16 px-4">
          <h2 className="text-5xl md:text-6xl font-normal text-gray-800 tracking-wider pb-2">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </h2>
          <h2 className="text-2xl md:text-3xl font-medium text-gray-400 tracking-wider">
            Reviews
          </h2>
          <div className="flex justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-lg" />
            ))}
          </div>
        </div>

        {/* Elfsight Container */}
        <div 
          className="elfsight-app-ebeacab4-832b-4bc2-9dcd-6eeefd1a5511" 
          data-elfsight-app-lazy
        ></div>

        {/* Fallback Custom Slider */}
        {!isElfsightLoaded && (
          <div className="relative px-4">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              className="testimonials-swiper !pb-12"
            >
              {testimonials.map((item, idx) => (
                <SwiperSlide key={idx} className="h-auto">
                  <div className="bg-[#fcfcfc] rounded-xl p-6 h-full flex flex-col shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`${item.bgColor} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-inner uppercase`}
                      >
                        {item.initial}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold text-gray-800 text-[13px] truncate">
                            {item.name}
                          </h3>
                          <FaCheckCircle className="text-[#f61111ff] text-[10px] shrink-0" />
                        </div>
                        <p className="text-gray-400 text-[11px] font-medium">
                          {randomTimes[idx] || item.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-[15px]" />
                      ))}
                    </div>

                    <p className="text-gray-600 text-[14px] leading-relaxed mb-8 flex-grow font-medium">
                      {item.text}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <GoogleLogo />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-[-10px] top-[45%] -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg hover:bg-[#e84393] hover:text-white hover:border-[#e84393] cursor-pointer">
              <FaChevronLeft size={16} />
            </button>
            <button className="swiper-button-next-custom absolute right-[-10px] top-[45%] -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg hover:bg-[#e84393] hover:text-white hover:border-[#e84393] cursor-pointer">
              <FaChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
