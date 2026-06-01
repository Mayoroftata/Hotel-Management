// components/Toprooms.js
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image component


const TopRoom = () => {
  const room = [
    {
      id: 1,
      name: 'suites Penthouse',
      rating: 4.7,
      reviews: 5704,
      price: 584353,
      image: '/img/TopRoom1.jpg'
    },
    {
      id: 2,
      name: 'standard Suite 2',
      rating: 4.7,
      reviews: 3335,
      price: 565467,
      image: '/img/TopRoom2.jpg'
    },
    {
      id: 3,
      name: 'Executive Suite 1',
      rating: 4.6,
      reviews: 28118,
      price: 1005426,
      image: '/img/TopRoom3.jpg'
    },
    {
      id: 4,
      name: 'Executive Suite 2',
      rating: 4.3,
      reviews: 1685,
      price: 74798,
      image: '/img/TopRoom4.jpg'
    }
  ];

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">TOP ROOMS</h2>
        <p className="text-center mb-8">Most popular choices for our Clients</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center items-stretch">
          {room.map((roomItem) => (
            <div key={roomItem.id} className="bg-blue-800 p-6 rounded-lg shadow-md border border-amber-50 text-center">
              <Image
                src={roomItem.image}
                alt={roomItem.name}
                className="w-full h-48 object-cover mb-4 rounded"
                width={400}
                height={200}
              />
              <h3 className="text-lg font-semibold mb-2">{roomItem.name}</h3>
              <div className="flex items-center justify-center mb-2">
                <span className="mr-2 text-yellow-400">{roomItem.rating} ⭐</span>
                <span className="text-sm">({roomItem.reviews} reviews)</span>
              </div>
              <p className="text-xl font-bold text-amber-400">₦{roomItem.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRoom;