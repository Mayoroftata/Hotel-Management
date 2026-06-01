"use client";
import Link from "next/link";
import Footer from "@/components/Footer";
import React from "react";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "next/navigation";

const GET_ROOM_BY_ID = gql`
  query GetRoomById($id: ID!) {
    getRoomById(id: $id) {
      id
      name
      number
      price
      description
      category
      images
      amenities
      isAvailable
    }
  }
`;

const Page = () => {
  const params = useParams();
  const roomId = params?.roomId;

  const { data, loading, error } = useQuery(GET_ROOM_BY_ID, {
    variables: { id: roomId },
    skip: !roomId,
    fetchPolicy: "network-only",
  });

  const room = data?.getRoomById;

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p>Room not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />

      {/* Header with Back Button */}
      <header className="flex bg-white justify-between p-4 shadow-md items-center">
        <Link href="/rooms/deluxe" className="text-blue-600 font-bold">
          ← Back to Deluxe Rooms
        </Link>
        <h1 className="text-2xl text-gray-800 font-bold">
          {room.name} Details
        </h1>
        <div />
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-8 md:grid-cols-2">
          {room.images && room.images.length > 0 ? (
            room.images.map((image, idx) => (
              <Image
                key={idx}
                src={image}
                alt={`${room.name} view ${idx + 1}`}
                width={800}
                height={600}
                className="h-64 rounded-lg shadow-md w-full object-cover"
              />
            ))
          ) : (
            <Image
              src="/img/TopRoom5.jpg"
              alt={room.name}
              width={800}
              height={600}
              className="h-64 rounded-lg shadow-md w-full object-cover"
            />
          )}
        </div>

        {/* Hotel Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-gray-800 text-xl font-semibold mb-2">
            {room.name}
          </h2>
          <p className="text-gray-600 mb-4">{room.description}</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-4">
            <div>
              <p className="font-medium">Room Number</p>
              <p className="text-gray-600">{room.number}</p>
            </div>
            <div>
              <p className="font-medium">Category</p>
              <p className="text-gray-600">{room.category}</p>
            </div>
            <div>
              <p className="font-medium">Price</p>
              <p className="text-gray-600">${room.price}/night</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p
                className={room.isAvailable ? "text-green-600" : "text-red-600"}
              >
                {room.isAvailable ? "Available" : "Unavailable"}
              </p>
            </div>
          </div>

          {/* Amenities Section */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-black text-lg font-medium mb-4">Amenities</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {room.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 rounded-md text-gray-800 px-4 py-3"
                  >
                    ✓ {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="mt-6 bg-blue-600 rounded-md text-white duration-300 hover:bg-blue-700 px-6 py-3 transition font-semibold">
            <Link href={`/booking?roomId=${room.id}`}>Book This Room</Link>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
