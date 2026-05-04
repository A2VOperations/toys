import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

export const metadata = {
  title: {
    default: "Toys for Kids | Best Toys, Stationery & Return Gifts in Delhi",
    template: "%s | Toys for Kids",
  },
  description:
    "Discover a wide range of high-quality kids' toys, educational stationery, school bags, and unique return gifts at Toys for Kids. Wholesale and retail prices available in Sant Nagar Burari, Delhi.",
  keywords: [
    "toys for kids",
    "kids toys Delhi",
    "educational toys",
    "school stationery",
    "return gifts",
    "wholesale toys Burari",
    "kids essentials",
    "Jyoti Agrawal toys",
  ],
  authors: [{ name: "Jyoti Agrawal" }],
  creator: "Jyoti Agrawal",
  publisher: "Toys for Kids",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Toys for Kids | Best Toys, Stationery & Return Gifts in Delhi",
    description:
      "Quality kids' essentials including toys, stationery, and return gifts at affordable prices.",
    url: "http://toysforkids.co.in", // Replace with actual domain if known
    siteName: "Toys for Kids",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toys for Kids | Best Toys, Stationery & Return Gifts",
    description:
      "Quality kids' essentials including toys, stationery, and return gifts at affordable prices.",
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
    name: "Toys for Kids",
    image: "http://toysforkids.co.in/Kids For Toy footer.png",
    "@id": "http://toysforkids.co.in/",
    url: "http://toysforkids.co.in/",
    telephone: "9643399433",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kh no 793/1 Budh bazar road kamalpur Burari",
      addressLocality: "Delhi",
      postalCode: "110084",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "22:00",
    },
    sameAs: [
      "https://www.facebook.com/people/Toys-for-kids/61560423274946/?rdid=FVWBSZ0jg6g1tcUF&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DuTiFczCU%2F",
      "https://www.instagram.com/toys_for_kids_wholeseller?utm_source=qr&igsh=MW10b29jMHpmbjV6eg%3D%3D",
    ],
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VKMJH81W82"
        />
        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-VKMJH81W82');
            `}
        </Script>
        {children}
      </body>
    </html>
  );
}
