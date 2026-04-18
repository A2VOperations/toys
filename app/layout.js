import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./(users)/navbar";
import Footer from "./(users)/footer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
