import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./navbar";
// import Footer from "./footer";

export default function RootLayout({ children }) {
  return (
    <>
    <Navbar/>
    {children}
    {/* <Footer /> */}
    </>  
  );
}
