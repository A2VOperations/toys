import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./(users)/navbar";
import Footer from "./(users)/footer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

export const metadata = {
  title: {
    default: "Toys for Kids | Best Toys, Stationery & Return Gifts in Delhi",
    template: "%s | Toys for Kids"
  },
  description: "Discover a wide range of high-quality kids' toys, educational stationery, school bags, and unique return gifts at Toys for Kids. Wholesale and retail prices available in Sant Nagar Burari, Delhi.",
  keywords: ["toys for kids", "kids toys Delhi", "educational toys", "school stationery", "return gifts", "wholesale toys Burari", "kids essentials", "Jyoti Agarwal toys"],
  authors: [{ name: "Jyoti Agarwal" }],
  creator: "Jyoti Agarwal",
  publisher: "Toys for Kids",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Toys for Kids | Best Toys, Stationery & Return Gifts in Delhi",
    description: "Quality kids' essentials including toys, stationery, and return gifts at affordable prices.",
    url: "https://toysforkids.in", // Replace with actual domain if known
    siteName: "Toys for Kids",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toys for Kids | Best Toys, Stationery & Return Gifts",
    description: "Quality kids' essentials including toys, stationery, and return gifts at affordable prices.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Toys for Kids",
    "image": "https://toysforkids.in/Kids For Toy logo.png", // Replace with actual logo/main image
    "@id": "https://toysforkids.in",
    "url": "https://toysforkids.in",
    "telephone": "9643399433",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kh no 793/1 Budh bazar road kamalpur Burari",
      "addressLocality": "Delhi",
      "postalCode": "110084",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "22:00"
    },
    // "sameAs": [
    //   "https://www.facebook.com/toysforkids", // Replace with actual social links
    //   "https://www.instagram.com/toysforkids"
    // ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
