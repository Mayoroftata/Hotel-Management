"use client";
import Footer from "@/components/Footer";
import Recommendations from "@/components/Recommendations";
import Link from "next/link";
import React from "react";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { useQuery, gql } from "@apollo/client";

const GET_ROOMS_BY_CATEGORY = gql`
  query GetRoomsByCategory($category: String!) {
    getRoomsByCategory(category: $category) {
      id
      name
      number
      price
      description
      images
      amenities
      isAvailable
    }
  }
`;

const Page = () => {
  const { data, loading, error } = useQuery(GET_ROOMS_BY_CATEGORY, {
    variables: { category: "Suite" },
    fetchPolicy: "network-only",
  });

  const rooms = data?.getRoomsByCategory || [];
  const availableRooms = rooms.filter((room) => room.isAvailable);
  const roomCount = availableRooms.length;

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">Error loading rooms: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />

      <div className="container mx-auto my-5 px-4 py-8">
        <h1 className="text-3xl text-gray-800 font-bold mb-4">Suites.</h1>
        <p className="text-gray-600 mb-8">
          Enjoy the ultimate in luxury and privacy with our suite collection,
          ideal for extended stays and special occasions.
        </p>

        {roomCount === 0 ? (
          <div className="rounded-xl bg-white p-8 shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No available space for now
            </h2>
            <p className="text-gray-600">
              All suites are currently unavailable. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {availableRooms.map((room) => (
              <div key={room.id} className="bg-white p-6 rounded-lg shadow-md">
                <Image
                  src={room.images?.[0] || "/img/TopRoom5.jpg"}
                  alt={room.name}
                  width={800}
                  height={500}
                  className="h-96 rounded-lg w-full mb-4 object-cover"
                />
                <h2 className="text-2xl text-gray-800 font-semibold mb-2">
                  {room.name}
                </h2>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-gray-600">${room.price} per night</p>
                  </div>
                  <div>
                    <p className="font-medium">Room Number</p>
                    <p className="text-gray-600">{room.number}</p>
                  </div>
                </div>
                {room.amenities && room.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="font-medium mb-2">Amenities:</p>
                    <ul className="text-gray-600 text-sm">
                      {room.amenities.map((amenity, idx) => (
                        <li key={idx}>• {amenity}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex mt-4 space-x-4">
                  <Link
                    href={`/rooms/suites/${room.id}`}
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                  >
                    EXPLORE
                  </Link>
                  <Link
                    href={`/booking?roomId=${room.id}`}
                    className="inline-flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 transition"
                  >
                    BOOK
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <Recommendations />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
