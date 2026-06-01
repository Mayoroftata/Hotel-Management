"use client";
import Link from "next/link";
import {
  FaHandshake,
  FaTrophy,
  FaUsers,
  FaMicrophone,
  FaArrowLeft,
  FaCalendarAlt,
} from "react-icons/fa";
import { gql, useQuery } from "@apollo/client";

const GET_CORPORATE_SERVICES = gql`
  query GetCorporateServices {
    getServicesByCategory(category: "Corporate Events") {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

export default function CorporateEvents() {
  const { data, loading, error } = useQuery(GET_CORPORATE_SERVICES, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">
          Loading corporate services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">
            Unable to load corporate services
          </h1>
          <p className="text-slate-600 mb-6">Please try again later.</p>
          <Link
            href="/meetings-events"
            className="inline-block rounded-full bg-green-900 px-6 py-3 text-white hover:bg-green-800"
          >
            Back to Meetings & Events
          </Link>
        </div>
      </div>
    );
  }

  const corporateServices = data?.getServicesByCategory || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/meetings-events"
            className="inline-flex items-center text-green-600 hover:text-green-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Meetings & Events
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Corporate Events
            </h1>
            <p className="text-xl mb-8">
              Elevate your corporate gatherings with our professional event
              spaces and comprehensive services. From executive retreats to
              product launches, we create memorable experiences that impress
              clients and inspire teams.
            </p>
            <Link
              href="/booking"
              className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition-colors"
            >
              Plan Corporate Event
            </Link>
          </div>
        </div>
      </div>

      {/* Corporate Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Corporate Services
          </h2>
          <p className="text-lg text-slate-600">
            Choose from our current corporate event services below.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {corporateServices.length > 0 ? (
            corporateServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-green-50 flex items-center justify-center">
                  <FaHandshake className="text-green-500 text-4xl" />
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
                  <p className="text-2xl font-bold text-green-600">
                    ${service.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 mb-4">
                No corporate event services are available yet.
              </p>
              <p className="text-sm text-slate-500">
                Contact our events team to discuss custom corporate solutions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Event Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Corporate Event Solutions
          </h2>
          <p className="text-lg text-slate-600">
            Specialized venues and services for every type of corporate
            gathering.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Executive Retreats */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
              <FaHandshake className="text-blue-500 text-4xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Executive Retreats
              </h3>
              <p className="text-slate-600 mb-4">
                Exclusive venues for strategic planning, team building, and
                executive development. Private dining rooms and breakout spaces
                available.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>Capacity: 20-100 executives</p>
                <p>Private meeting spaces</p>
                <p>Team building activities</p>
                <p>Business amenities</p>
              </div>
            </div>
          </div>

          {/* Product Launches */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
              <FaTrophy className="text-purple-500 text-4xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Product Launches
              </h3>
              <p className="text-slate-600 mb-4">
                Impressive spaces for product unveilings, press events, and
                client presentations. Full AV support and catering services
                included.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>Capacity: 50-300 guests</p>
                <p>Professional AV equipment</p>
                <p>Press kit preparation</p>
                <p>Premium catering</p>
              </div>
            </div>
          </div>

          {/* Team Building */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center">
              <FaUsers className="text-green-500 text-4xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Team Building Events
              </h3>
              <p className="text-slate-600 mb-4">
                Energize your team with our comprehensive team building packages
                including activities, workshops, and recreational facilities.
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>Capacity: 20-200 participants</p>
                <p>Custom activity packages</p>
                <p>Professional facilitators</p>
                <p>Recreation center access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Services */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Corporate Services
            </h2>
            <p className="text-lg text-slate-600">
              Professional support for successful corporate events.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMicrophone className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">AV Production</h3>
              <p className="text-slate-600 text-sm">
                State-of-the-art audio-visual equipment and technical support
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Event Planning</h3>
              <p className="text-slate-600 text-sm">
                Full-service event coordination and project management
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-purple-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Registration</h3>
              <p className="text-slate-600 text-sm">
                Online registration systems and on-site check-in services
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-amber-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">VIP Services</h3>
              <p className="text-slate-600 text-sm">
                Special accommodations for executives and VIP guests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Elevate Your Corporate Events
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Partner with Dee-Luck Hotel for professional corporate events that
            leave a lasting impression. Contact our corporate events team to
            discuss your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Request Proposal
            </Link>
            <a
              href="tel:+1234567890"
              className="border-2 border-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Call Corporate Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
