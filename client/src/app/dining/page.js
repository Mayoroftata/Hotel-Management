"use client";
import Link from "next/link";
import {
  FaUtensils,
  FaWineGlass,
  FaClock,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { gql, useQuery } from "@apollo/client";
import NavBar from "@/components/NavBar";

const GET_RESTAURANT_SERVICES = gql`
  query GetRestaurantServices {
    getServicesByCategory(category: "Restaurants") {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

export default function Dining() {
  const { data, loading, error } = useQuery(GET_RESTAURANT_SERVICES, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">
          Loading dining options...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">
            Unable to load dining options
          </h1>
          <p className="text-slate-600 mb-6">Please try again later.</p>
          <Link
            href="/"
            className="inline-block rounded-full bg-amber-900 px-6 py-3 text-white hover:bg-amber-800"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  const restaurantServices = data?.getServicesByCategory || [];

  return (
    <div className="min-h-screen bg-slate-50">
        <NavBar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Culinary Excellence</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Experience world-class dining at Dee-Luck Hotel. From fine dining
              restaurants to casual cafes, our culinary team creates memorable
              experiences with fresh, locally-sourced ingredients and innovative
              cuisine.
            </p>
          </div>
        </div>
      </div>

      {/* Dining Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Dining Experiences
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover our current dining venues and menus.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {restaurantServices.length > 0 ? (
            restaurantServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-64 bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-600 text-lg font-semibold">
                    Dining Service
                  </span>
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <FaStar className="text-amber-500 text-xl mr-2" />
                    <span className="text-amber-600 font-semibold">
                      {service.name}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-6">{service.description}</p>
                  <div className="space-y-3 mb-6 text-slate-600 text-sm">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-3" />
                      <span>Category: {service.category}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-3" />
                      <span>
                        Status: {service.isAvailable ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-600">
                      ${service.price.toFixed(2)}
                    </span>
                    <Link
                      href="/booking"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                    >
                      Reserve Table
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 mb-4">
                No dining options are available at the moment.
              </p>
              <p className="text-sm text-slate-500">
                Please check back soon or contact our restaurant team.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Special Dining Experiences */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Special Dining Experiences
            </h2>
            <p className="text-lg text-slate-600">
              Unique culinary events and private dining options.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Chef&apos;s Table Experience
              </h3>
              <p className="text-slate-600 mb-4">
                Intimate dining experience where our executive chef prepares a
                personalized multi-course menu featuring the finest seasonal
                ingredients.
              </p>
              <p className="text-amber-600 font-bold">$150 per person</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Wine Tasting Dinner
              </h3>
              <p className="text-slate-600 mb-4">
                Exclusive wine pairings with each course, led by our sommelier.
                Perfect for special occasions and wine enthusiasts.
              </p>
              <p className="text-amber-600 font-bold">$120 per person</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Private Dining Rooms
              </h3>
              <p className="text-slate-600 mb-4">
                Elegant private dining spaces for intimate gatherings, business
                dinners, or special celebrations up to 20 guests.
              </p>
              <p className="text-amber-600 font-bold">From $500</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Reserve Your Dining Experience
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re planning a romantic dinner, business meeting, or
            special celebration, our team is ready to create an unforgettable
            dining experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-amber-600 hover:bg-amber-700 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Make Reservation
            </Link>
            <a
              href="tel:+1234567890"
              className="border-2 border-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Call Restaurant
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
