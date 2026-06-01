import DiscoverExplore from "@/components/DiscoverExplore";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import TopRoom from "@/components/TopRoom";
import WhyBookWithUs from "@/components/WhyBookWithUs";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div>
      <NavBar/>
      <HeroSection/>
      <WhyBookWithUs/>
      <TopRoom/>
      <DiscoverExplore/>
      <Footer/>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
