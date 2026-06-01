// components/HeroSection.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './HeroSection.css';

const slides = [
  {
    title: 'Stay in Style',
    subtitle: 'Luxurious rooms with unmatched comfort',
    description:
      'Explore our curated rooms and suites, designed for every travel style — from cozy stays to premium luxury.',
    link: '/rooms/standard',
    cta: 'Explore Rooms',
    image: '/img/TopRoom5.jpg',
  },
  {
    title: 'Dine with Delight',
    subtitle: 'Signature cuisine in a vibrant setting',
    description:
      'Savor handcrafted meals and local favorites at our dining destinations across the hotel.',
    link: '/dining',
    cta: 'View Dining',
    image: '/img/Discover1.jpg',
  },
  {
    title: 'Meetings & Events',
    subtitle: 'Host memorable gatherings',
    description:
      'Plan weddings, conferences, and celebrations with elegant event spaces and expert support.',
    link: '/meetings-events',
    cta: 'Book an Event',
    image: '/img/DeluxeRoom1Image1.png',
  },
  {
    title: 'Relax & Recharge',
    subtitle: 'Wellness, recreation, and leisure',
    description:
      'Unwind in our recreation center, spa, and curated leisure experiences for every guest.',
    link: '/recreation-center',
    cta: 'Discover More',
    image: '/img/Penthouse1.jpg',
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[activeIndex];

  return (
    <section id="sectionHero" className="hero-heroSection overflow-hidden relative">
      <div
        className="hero-slide absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${slide.image})`,
        }}
      />
      <div className="hero-overlay absolute inset-0 bg-black/30" />

      <div className="hero-content relative z-10 flex min-h-screen items-center justify-center px-4 py-24 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-200">Showcase</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{slide.title}</h1>
          <p className="mt-4 text-xl text-blue-100 sm:text-2xl">{slide.subtitle}</p>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-100 sm:text-lg">{slide.description}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={slide.link}
              className="hero-cta-btn rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500"
            >
              {slide.cta}
            </Link>
            {/* <button
              type="button"
              onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
              className="rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm text-white transition hover:bg-white/20"
            >
              Next Showcase
            </button> */}
          </div>
        </div>
      </div>

      <div className="hero-indicators absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-indicator ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
