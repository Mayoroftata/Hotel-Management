"use client";
import Link from "next/link";
import {
  FaHeart,
  FaCamera,
  FaMusic,
  FaGlassCheers,
  FaArrowLeft,
  FaCalendarAlt,
} from "react-icons/fa";
import { gql, useQuery } from "@apollo/client";

const GET_WEDDING_SERVICES = gql`
  query GetWeddingServices {
    getServicesByCategory(category: "Weddings") {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

export default function Weddings() {
  const { data, loading, error } = useQuery(GET_WEDDING_SERVICES, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">
          Loading wedding services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">
            Unable to load wedding services
          </h1>
          <p className="text-slate-600 mb-6">Please try again later.</p>
          <Link
            href="/meetings-events"
            className="inline-block rounded-full bg-pink-900 px-6 py-3 text-white hover:bg-pink-800"
          >
            Back to Meetings & Events
          </Link>
        </div>
      </div>
    );
  }

  const weddingServices = data?.getServicesByCategory || [];
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/meetings-events"
            className="inline-flex items-center text-pink-600 hover:text-pink-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Meetings & Events
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Wedding Venues
            </h1>
            <p className="text-xl mb-8">
              Create your dream wedding at Dee-Luck Hotel. From intimate
              ceremonies to grand celebrations, our elegant venues and dedicated
              wedding specialists will make your special day unforgettable.
            </p>
            <Link
              href="/booking"
              className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition-colors"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </div>

      {/* Wedding Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Wedding Services
          </h2>
          <p className="text-lg text-slate-600">
            Choose from our current wedding offerings and services below.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {weddingServices.length > 0 ? (
            weddingServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-pink-50 flex items-center justify-center">
                  <FaHeart className="text-pink-500 text-4xl" />
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
                  <p className="text-2xl font-bold text-pink-600">
                    ${service.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 mb-4">
                No wedding services are available at the moment.
              </p>
              <p className="text-sm text-slate-500">
                Contact our team to learn about upcoming wedding packages.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wedding Services */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Wedding Services
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive wedding planning and coordination services.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-pink-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Wedding Planning
              </h3>
              <p className="text-slate-600 text-sm">
                Full-service wedding coordination from engagement to honeymoon
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCamera className="text-purple-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Photography</h3>
              <p className="text-slate-600 text-sm">
                Professional wedding photography and videography services
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMusic className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Entertainment</h3>
              <p className="text-slate-600 text-sm">
                DJs, live bands, ceremony music, and entertainment coordination
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGlassCheers className="text-amber-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Catering</h3>
              <p className="text-slate-600 text-sm">
                Custom menus, cake design, and beverage service for your
                reception
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Begin Your Love Story</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Let us help you create the wedding of your dreams. Contact our
            wedding specialists to discuss your vision and start planning your
            perfect day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Schedule Consultation
            </Link>
            <a
              href="tel:+1234567890"
              className="border-2 border-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Call Wedding Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
