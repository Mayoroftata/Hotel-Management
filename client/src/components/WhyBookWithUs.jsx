// components/WhyBookWithUs.js
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image component

const WhyBookWithUs = () => {
  const features = [
    {
      id: 1,
      icon: "../img/svg1.svg",
      title: "Luxury & Comfort",
      description: "Enjoy comfort and luxury with our selection of top-rated rooms."
    },
    {
      id: 2,
      icon: "../img/svg2.svg",
      title: "Safety & Security",
      description: "Feel safe and at home with fully furnished apartments with top securities."
    },
    {
      id: 3,
      icon: "../img/svg3.svg",
      title: "Affordable Pricing",
      description: "Save money with our budget-friendly and affordable options."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  return (
    <section className="bg-blue-900 text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">WHY BOOK WITH DEELUCK</h2>

        {/* Carousel Container */}
        <div className="relative max-w-2xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {features.map((feature) => (
              <div key={feature.id} className="min-w-full flex-shrink-0 px-4">
                <div className="bg-blue-800 p-8 rounded-lg shadow-md text-center min-h-[300px] flex flex-col justify-center items-center">
                  <div className="flex justify-center items-center mb-6">
                    <Image src={feature.icon} alt={feature.title} width={80} height={60} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-base leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {/* <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
          >
            ›
          </button> */}

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-blue-700'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBookWithUs;