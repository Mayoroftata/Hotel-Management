"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image component

const Recommendations = () => {
    // Sample data for recommendations
    const hotels = [
        {
            id: 1,
            image: '/images/hotel-1.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
        {
            id: 2,
            image: '/images/hotel-2.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
        {
            id: 3,
            image: '/images/hotel-3.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
        {
            id: 4,
            image: '/images/hotel-4.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
        {
            id: 5,
            image: '/images/hotel-5.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
        {
            id: 6,
            image: '/images/hotel-6.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
        {
            id: 7,
            image: '/images/hotel-7.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
        {
            id: 8,
            image: '/images/hotel-8.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
        {
            id: 9,
            image: '/images/hotel-9.jpg',
            name: 'Lagos Marriott Hotel Ikeja',
            rating: 4.7,
            reviews: 5704,
            price: '#584,353',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerSlide = 3; // Show 3 items at a time on desktop
    const totalSlides = Math.ceil(hotels.length / itemsPerSlide);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
        }, 6000);
        return () => clearInterval(interval);
    }, [totalSlides]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    };

    const getVisibleHotels = () => {
        const startIndex = currentIndex * itemsPerSlide;
        return hotels.slice(startIndex, startIndex + itemsPerSlide);
    };

    return (
        <div className="bg-gray-300 shadow-md rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-300 text-blue-900 text-3xl p-4 text-center font-bold uppercase">
                Recommendations
            </div>

            {/* Carousel Container */}
            <div className="relative p-4">
                <div className="overflow-hidden rounded-lg">
                    <div className="flex transition-transform duration-500 ease-in-out">
                        {Array.from({ length: totalSlides }, (_, slideIndex) => (
                            <div key={slideIndex} className="min-w-full flex-shrink-0">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {hotels.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((hotel) => (
                                        <div
                                            key={hotel.id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {/* Image */}
                                            <Image
                                                width={500}
                                                src={hotel.image}
                                                height={300}
                                                alt={hotel.name}
                                                className="w-full h-48 object-cover"
                                            />

                                            {/* Content */}
                                            <div className="p-4">
                                                {/* Name */}
                                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{hotel.name}</h3>

                                                {/* Rating and Reviews */}
                                                <div className="flex items-center mb-2">
                                                    <span className="text-yellow-500 mr-1 text-lg">⭐</span>
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {hotel.rating} ({hotel.reviews} reviews)
                                                    </span>
                                                </div>

                                                {/* Price */}
                                                <p className="text-blue-600 font-semibold text-lg">From {hotel.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition-colors z-10"
                >
                    ‹
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition-colors z-10"
                >
                    ›
                </button>

                {/* Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalSlides }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-900' : 'bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;