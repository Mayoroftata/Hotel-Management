"use client";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaRing,
  FaBuilding,
  FaUtensils,
  FaSwimmer,
} from "react-icons/fa";
import { gql, useQuery } from "@apollo/client";
import NavBar from "@/components/NavBar";

const GET_SERVICES_BY_CATEGORIES = gql`
  query GetServicesByCategories {
    conferences: getServicesByCategory(category: "Conferences") {
      id
      name
      description
      price
      category
      isAvailable
    }
    weddings: getServicesByCategory(category: "Weddings") {
      id
      name
      description
      price
      category
      isAvailable
    }
    corporateEvents: getServicesByCategory(category: "Corporate Events") {
      id
      name
      description
      price
      category
      isAvailable
    }
    restaurants: getServicesByCategory(category: "Restaurants") {
      id
      name
      description
      price
      category
      isAvailable
    }
    recreation: getServicesByCategory(category: "Recreation") {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

export default function MeetingsEvents() {
  const { data, loading, error } = useQuery(GET_SERVICES_BY_CATEGORIES, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">
          Loading services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">
            Unable to load services
          </h1>
          <p className="text-slate-600 mb-6">Please try again later.</p>
          <Link
            href="/"
            className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  const conferences = data?.conferences || [];
  const weddings = data?.weddings || [];
  const corporateEvents = data?.corporateEvents || [];
  const restaurants = data?.restaurants || [];
  const recreation = data?.recreation || [];
  return (
    <div className="min-h-screen bg-slate-50">
        <NavBar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Meetings & Events</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Transform your special occasions into unforgettable experiences at
              Dee-Luck Hotel. From intimate weddings to grand corporate
              conferences, we provide exceptional venues and personalized
              service for every event.
            </p>
          </div>
        </div>
      </div>

      {/* Event Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Event Services
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of event spaces and services
            designed to make your occasion perfect.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Conferences */}
          <Link href="/meetings-events/conferences" className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <FaCalendarAlt className="text-white text-6xl" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Conferences ({conferences.length})
                </h3>
                <p className="text-slate-600 mb-4">
                  Professional conference facilities with state-of-the-art AV
                  equipment, flexible seating arrangements, and dedicated event
                  coordination.
                </p>
                <span className="text-blue-600 font-semibold group-hover:text-blue-700">
                  Learn More →
                </span>
              </div>
            </div>
          </Link>

          {/* Weddings */}
          <Link href="/meetings-events/weddings" className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <FaRing className="text-white text-6xl" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                  Weddings ({weddings.length})
                </h3>
                <p className="text-slate-600 mb-4">
                  Create magical wedding moments in our elegant venues. From
                  intimate ceremonies to grand receptions, we handle every
                  detail with care.
                </p>
                <span className="text-pink-600 font-semibold group-hover:text-pink-700">
                  Learn More →
                </span>
              </div>
            </div>
          </Link>

          {/* Corporate Events */}
          <Link href="/meetings-events/corporate-events" className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <FaBuilding className="text-white text-6xl" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                  Corporate Events ({corporateEvents.length})
                </h3>
                <p className="text-slate-600 mb-4">
                  Impress clients and colleagues with sophisticated corporate
                  event spaces, team-building activities, and professional
                  catering services.
                </p>
                <span className="text-green-600 font-semibold group-hover:text-green-700">
                  Learn More →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Additional Amenities
            </h2>
            <p className="text-lg text-slate-600">
              Complement your event with our world-class dining and recreation
              facilities.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Dining */}
            <Link href="/dining" className="group">
              <div className="bg-slate-50 rounded-2xl p-8 hover:bg-slate-100 transition-colors">
                <div className="flex items-center mb-4">
                  <FaUtensils className="text-amber-600 text-3xl mr-4" />
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    Dining ({restaurants.length})
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Elevate your event with our award-winning culinary
                  experiences. From elegant plated dinners to casual buffets,
                  our expert chefs create memorable menus for every occasion.
                </p>
                <span className="text-amber-600 font-semibold group-hover:text-amber-700">
                  Explore Dining →
                </span>
              </div>
            </Link>

            {/* Recreation Center */}
            <Link href="/recreation-center" className="group">
              <div className="bg-slate-50 rounded-2xl p-8 hover:bg-slate-100 transition-colors">
                <div className="flex items-center mb-4">
                  <FaSwimmer className="text-blue-600 text-3xl mr-4" />
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Recreation Center ({recreation.length})
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Add excitement to your event with our comprehensive recreation
                  facilities including swimming pools, fitness centers, and
                  outdoor activities for team building and relaxation.
                </p>
                <span className="text-blue-600 font-semibold group-hover:text-blue-700">
                  Discover Activities →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Event?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Contact our events team to discuss your vision and create a
            customized experience that exceeds your expectations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Book Event Space
            </Link>
            <a
              href="tel:+1234567890"
              className="border-2 border-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Call Events Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
