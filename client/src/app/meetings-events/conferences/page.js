"use client";
import Link from "next/link";
import {
  FaMicrophone,
  FaWifi,
  FaCoffee,
  FaUsers,
  FaCalendarCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { gql, useQuery } from "@apollo/client";

const GET_CONFERENCE_SERVICES = gql`
  query GetConferenceServices {
    getServicesByCategory(category: "Conferences") {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

export default function Conferences() {
  const { data, loading, error } = useQuery(GET_CONFERENCE_SERVICES, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">
          Loading conference services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">
            Unable to load conference services
          </h1>
          <p className="text-slate-600 mb-6">Please try again later.</p>
          <Link
            href="/meetings-events"
            className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800"
          >
            Back to Meetings & Events
          </Link>
        </div>
      </div>
    );
  }

  const conferenceServices = data?.getServicesByCategory || [];
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/meetings-events"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Meetings & Events
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Conference Facilities
            </h1>
            <p className="text-xl mb-8">
              Host successful conferences and seminars in our state-of-the-art
              facilities. From small board meetings to large-scale conferences,
              we provide everything you need for productive and memorable
              events.
            </p>
            <Link
              href="/booking"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition-colors"
            >
              Book Conference Space
            </Link>
          </div>
        </div>
      </div>

      {/* Conference Spaces */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Conference Venues
          </h2>
          <p className="text-lg text-slate-600">
            Choose from multiple flexible spaces designed for different group
            sizes and meeting styles.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {conferenceServices.length > 0 ? (
            conferenceServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-500 text-sm">
                    Conference Service
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>Price: ${service.price?.toFixed(2)}</p>
                    <p>
                      Status:{" "}
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 mb-4">
                No conference services available yet.
              </p>
              <p className="text-sm text-slate-500">
                Check back soon or contact our events team.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Services & Amenities */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Conference Services
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive support to ensure your conference runs smoothly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMicrophone className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">AV Equipment</h3>
              <p className="text-slate-600 text-sm">
                Professional sound systems, projectors, screens, and technical
                support
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaWifi className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">High-Speed WiFi</h3>
              <p className="text-slate-600 text-sm">
                Reliable internet connectivity for all attendees and presenters
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCoffee className="text-amber-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Catering</h3>
              <p className="text-slate-600 text-sm">
                Coffee breaks, working lunches, and full conference catering
                options
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-purple-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Event Staff</h3>
              <p className="text-slate-600 text-sm">
                Professional event coordinators and technical support staff
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Plan Your Conference</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Our events team is ready to help you create a successful conference
            experience. Contact us to discuss your requirements and receive a
            customized proposal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Request Quote
            </Link>
            <a
              href="tel:+1234567890"
              className="border-2 border-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Call Conference Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
