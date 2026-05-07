import Script from "next/script";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

export const metadata = {
  title: {
    default: "Toys for Kids | Buy Toys, Stationery & Return Gifts Online India",
    template: "%s | Toys for Kids India",
  },
  description:
    "Shop kids' toys, educational toys, school stationery, school bags & return gifts online. Wholesale & retail prices. Trusted supplier in Delhi. Pan-India delivery available.",
  keywords: [
    // National high-volume
    "toys for kids",
    "buy toys online India",
    "kids toys online India",
    "educational toys for children",
    "best toys for kids India",
    "wholesale toys India",
    "cheap toys online India",
    "toys for 3 year old",
    "toys for 5 year old",
    "soft toys for kids",
    "STEM toys India",
    "learning toys for toddlers",
    // Return gifts
    "return gifts for kids birthday",
    "birthday return gifts India",
    "return gifts wholesale",
    "cheap return gifts for kids",
    "return gifts under 50 rupees",
    "return gifts under 100 rupees",
    "bulk return gifts India",
    "goody bag gifts for kids",
    // Stationery
    "school stationery India",
    "kids stationery online",
    "school bags India",
    "kids school bags wholesale",
    "pencil box for kids",
    "art and craft supplies India",
    // Local/Delhi
    "toys shop Burari Delhi",
    "wholesale toys Burari",
    "toys wholesale market Delhi",
    "return gifts shop Delhi",
    "Sant Nagar toys shop",
    // Seasonal
    "Diwali gifts for kids",
    "Children's Day gifts India",
    "school opening stationery",
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
    title: "Toys for Kids | Buy Toys, Stationery & Return Gifts Online India",
    description:
      "Shop kids' toys, educational toys, school stationery & return gifts at wholesale prices. Pan-India delivery from Delhi.",
    url: "https://toysforkids.co.in",  // ✅ changed to https
    siteName: "Toys for Kids",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toys for Kids | Toys, Stationery & Return Gifts India",
    description:
      "Shop kids' toys, educational toys, stationery & return gifts at wholesale prices. Pan-India delivery.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://www.toysforkids.co.in",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Toys for Kids",
    image: "https://toysforkids.co.in/Kids For Toy footer.png",
    "@id": "https://toysforkids.co.in/",
    url: "https://toysforkids.co.in/",
    telephone: "9643399433",
    address: {
      "@type": "PostalAddress",
      streetAddress: "A3 793/1, Vijay Colony, Block B, Kamal Pur, Burari",
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
        {/* Elfsight Platform Script - loaded before hydration */}
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DJMZ5G9764"
        />
        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-DJMZ5G9764');
            `}
        </Script>
        {children}
      </body>
    </html>
  );
}
