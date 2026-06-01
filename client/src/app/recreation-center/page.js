"use client";
import Link from "next/link";
import {
  FaSwimmer,
  FaDumbbell,
  FaSpa,
  FaTableTennis,
  FaGolfBall,
  FaSkiing,
} from "react-icons/fa";
import { gql, useQuery } from "@apollo/client";
import NavBar from "@/components/NavBar";

const GET_RECREATION_SERVICES = gql`
  query GetRecreationServices {
    getServicesByCategory(category: "Recreation") {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

export default function RecreationCenter() {
  const { data, loading, error } = useQuery(GET_RECREATION_SERVICES, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">
          Loading recreation services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">
            Unable to load recreation services
          </h1>
          <p className="text-slate-600 mb-6">Please try again later.</p>
          <Link
            href="/"
            className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  const recreationServices = data?.getServicesByCategory || [];

  return (
    <div className="min-h-screen bg-slate-50">
        <NavBar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Recreation Center</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Discover wellness and recreation at its finest. Our comprehensive
              recreation center offers world-class facilities for fitness,
              relaxation, and adventure. Whether you&apos;re training for a
              marathon or simply unwinding after a busy day, we have everything
              you need.
            </p>
          </div>
        </div>
      </div>

      {/* Recreation Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Recreation Services
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Browse our active recreation and wellness services.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recreationServices.length > 0 ? (
            recreationServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-cyan-50 flex items-center justify-center">
                  <FaDumbbell className="text-cyan-600 text-4xl" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <p>
                      Status:{" "}
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </p>
                    <p>Category: {service.category}</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    ${service.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 mb-4">
                No recreation services are available right now.
              </p>
              <p className="text-sm text-slate-500">
                Please check back soon or contact our recreation team.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Facilities Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            World-Class Facilities
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience premium recreation and wellness amenities designed for
            your comfort and enjoyment.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Swimming Pool */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
              <FaSwimmer className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Olympic Swimming Pool
              </h3>
              <p className="text-slate-600 mb-4">
                Temperature-controlled Olympic-size pool with lap lanes, diving
                area, and underwater lighting for evening swims.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• 50m Olympic pool</p>
                <p>• 10 lap lanes</p>
                <p>• Diving platform</p>
                <p>• Poolside cabanas</p>
              </div>
            </div>
          </div>

          {/* Fitness Center */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-center">
              <FaDumbbell className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                State-of-the-Art Fitness Center
              </h3>
              <p className="text-slate-600 mb-4">
                Fully equipped gym with the latest cardio and strength training
                equipment, free weights, and personal training services.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Cardiovascular machines</p>
                <p>• Weight training equipment</p>
                <p>• Personal training</p>
                <p>• Group fitness classes</p>
              </div>
            </div>
          </div>

          {/* Spa & Wellness */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
              <FaSpa className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Spa & Wellness Center
              </h3>
              <p className="text-slate-600 mb-4">
                Rejuvenate with our full-service spa offering massages, facials,
                body treatments, and relaxation therapies in a serene
                environment.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Swedish & deep tissue massage</p>
                <p>• Aromatherapy treatments</p>
                <p>• Facial services</p>
                <p>• Meditation rooms</p>
              </div>
            </div>
          </div>

          {/* Tennis Courts */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
              <FaTableTennis className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Tennis & Sports Courts
              </h3>
              <p className="text-slate-600 mb-4">
                Professional-grade tennis courts, basketball courts, and
                multi-purpose sports facilities for recreational and competitive
                play.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• 4 tennis courts</p>
                <p>• Basketball court</p>
                <p>• Equipment rental</p>
                <p>• Professional coaching</p>
              </div>
            </div>
          </div>

          {/* Golf */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-green-500 to-lime-500 flex items-center justify-center">
              <FaGolfBall className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Golf Facilities
              </h3>
              <p className="text-slate-600 mb-4">
                Championship golf course with driving range, putting green, and
                golf instruction. Clubhouse with pro shop and locker rooms.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• 18-hole championship course</p>
                <p>• Driving range & practice area</p>
                <p>• Golf instruction</p>
                <p>• Clubhouse amenities</p>
              </div>
            </div>
          </div>

          {/* Winter Sports */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <FaSkiing className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Adventure Activities
              </h3>
              <p className="text-slate-600 mb-4">
                Year-round adventure activities including skiing, snowboarding,
                hiking trails, and outdoor recreational programs for all skill
                levels.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Ski & snowboard slopes</p>
                <p>• Hiking trails</p>
                <p>• Outdoor adventures</p>
                <p>• Equipment rentals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership & Hours */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Membership Options
              </h2>
              <div className="space-y-6">
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Day Pass
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Perfect for visitors and occasional use
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    $25 per day
                  </p>
                </div>
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Monthly Membership
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Full access to all facilities
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    $99 per month
                  </p>
                </div>
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Annual Membership
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Best value with premium benefits
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    $999 per year
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Operating Hours
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">
                    Fitness Center
                  </span>
                  <span className="text-slate-600">24/7</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">
                    Swimming Pool
                  </span>
                  <span className="text-slate-600">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">
                    Spa & Wellness
                  </span>
                  <span className="text-slate-600">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">
                    Tennis Courts
                  </span>
                  <span className="text-slate-600">7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">
                    Golf Course
                  </span>
                  <span className="text-slate-600">6:00 AM - 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Experience Wellness & Recreation
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of members who choose Dee-Luck Hotel&apos;s
            recreation center for their fitness and wellness needs. Start your
            journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Book Facilities
            </Link>
            <a
              href="tel:+1234567890"
              className="border-2 border-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Call Recreation Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
