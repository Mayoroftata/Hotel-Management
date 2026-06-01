"use client";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import React, { useState } from "react";

const SupportPage = () => {
  //   const [searchQuery, setSearchQuery] = useState("");

  //   const handleSearch = (e) => {
  //     e.preventDefault();

  //     console.log("Searching for:", searchQuery);
  //   };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <section
        className="relative flex min-h-[400px] items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: "url('/img/TopRoom5.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative w-full max-w-4xl text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">
            We&apos;re here to help, every step of the way.
          </h1>
          <p className="mx-auto max-w-2xl text-lg">
            Whether you need help with a reservation, your stay, or hotel
            services, our support team is ready to assist.
          </p>
        </div>
      </section>

      {/* Search Section */}
      {/* <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-8 text-xl text-black">
              Find answers quickly or reach out directly for personalized
              support.
            </p>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search support topics"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 py-4 pl-6 pr-20 text-gray-900 shadow-sm focus:border-[#0f315f] focus:outline-none focus:ring-2 focus:ring-[#0f315f]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0f315f] px-6 py-2 text-white transition hover:bg-[#1a4a8a]"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section> */}

      {/* How Can We Assist You Section */}
      <main className="container mx-auto px-4 py-12">
        <section className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-[#0f315f]">
            HOW CAN WE ASSIST YOU?
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-[#0f315f]">
                Reservations
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Modify your booking</li>
                <li>• Check-in / check-out help</li>
                <li>• Room upgrade requests</li>
                <li>• Special accommodation needs</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-[#0f315f]">
                Hotel Services
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Spa and wellness</li>
                <li>• Dining reservations</li>
                <li>• Housekeeping requests</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-[#0f315f]">
                Local Assistance
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Local recommendations</li>
                <li>• Transportation help</li>
                <li>• Activity planning</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-[#0f315f]">
                Amenities
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Pool and gym access</li>
                <li>• Business center support</li>
                <li>• Event space inquiries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mx-auto mt-16 max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#0f315f]">
            NEED TO TALK TO US DIRECTLY?
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-3xl">📞</div>
              <h3 className="mb-2 text-lg font-bold text-[#0f315f]">Phone</h3>
              <p className="text-gray-600">+44 (0)20 800 0000</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-3xl">✉️</div>
              <h3 className="mb-2 text-lg font-bold text-[#0f315f]">Email</h3>
              <p className="text-gray-600">support@deeluckhotel.com</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-3xl">💬</div>
              <h3 className="mb-2 text-lg font-bold text-[#0f315f]">Chat</h3>
              <p className="text-gray-600">Live chat available in-app</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-3xl">🕒</div>
              <h3 className="mb-2 text-lg font-bold text-[#0f315f]">
                Opening hours
              </h3>
              <p className="text-gray-600">
                Monday – Friday: 9am – 5pm
                <br />
                Saturday: 10am – 4pm
              </p>
            </div>
          </div>
        </section>

        {/* Thank You Message */}
        <section className="mx-auto mt-16 max-w-3xl text-center">
          <div className="rounded-lg bg-[#0f315f] p-8 text-white">
            <p className="text-lg">
              Thank you for choosing DeeLuck Hotel. We&apos;re dedicated to
              making your stay comfortable and memorable. If you have any
              questions or need assistance, don&apos;t hesitate to reach out.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SupportPage;
