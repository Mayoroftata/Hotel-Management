"use client";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_ALL_ROOMS = gql`
  query GetAllRooms {
    getAllRooms {
      id
      category
      isAvailable
    }
  }
`;

const Page = () => {
  const { data, loading, error } = useQuery(GET_ALL_ROOMS, {
    fetchPolicy: "network-only",
  });

  const rooms = data?.getAllRooms || [];
  const availableRooms = rooms.filter((room) => room.isAvailable);
  const categoryCounts = availableRooms.reduce((acc, room) => {
    acc[room.category] = (acc[room.category] || 0) + 1;
    return acc;
  }, {});

  const categories = [
    {
      label: "Standard Rooms",
      description:
        "Comfortable, smartly styled rooms for guests who want value without compromising on quality.",
      path: "/rooms/standard",
      count: categoryCounts.Standard || 0,
    },
    {
      label: "Deluxe Rooms",
      description:
        "Spacious rooms with premium furnishings, scenic views and upgraded amenities.",
      path: "/rooms/deluxe",
      count: categoryCounts.Deluxe || 0,
    },
    {
      label: "Suites",
      description:
        "Lavish suites with separate living areas, premium services and exceptional privacy.",
      path: "/rooms/suites",
      count: categoryCounts.Suite || 0,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto my-8 px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Rooms & Suites
        </h1>
        <p className="text-gray-600 mb-8">
          Explore our complete room collection and select the category that fits
          your stay.
        </p>

        {loading && <p className="text-black">Loading room categories…</p>}
        {error && (
          <p className="text-red-600">
            Unable to load room counts: {error.message}
          </p>
        )}

        {availableRooms.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No available space for now
            </h2>
            <p className="text-gray-600">
              We’re sorry, but there are no rooms available at the moment.
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.label}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {category.label}
                </h2>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <p className="text-blue-700 font-semibold mb-6">
                  {category.count} room{category.count === 1 ? "" : "s"}{" "}
                  available
                </p>
                <Link
                  href={category.path}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                >
                  View {category.label}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
