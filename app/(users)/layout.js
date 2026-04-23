import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Topbar from "./topbar";
import Navbar from "./navbar";
import Footer from "./footer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

export default function RootLayout({ children }) {
  return (
    <>
    <Topbar/>
    <Navbar/>
    {children}
    <Footer />
    </>  
  );
}
