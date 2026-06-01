"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, gql } from "@apollo/client";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatBookingDateLong } from "@/lib/dateFormat";

const GET_ROOM_BY_ID = gql`
  query GetRoomById($id: ID!) {
    getRoomById(id: $id) {
      id
      name
      price
      description
      images
      isAvailable
    }
  }
`;

const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      guestFirstName
      guestLastName
      guestEmail
      phone
      checkIn
      checkOut
      status
    }
  }
`;

const bookingValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]{10,15}$/, "Invalid phone number")
    .required("Phone is required"),
  arrival: Yup.date()
    .required("Arrival date is required")
    .min(new Date(), "Arrival date cannot be in the past"),
  departure: Yup.date()
    .required("Departure date is required")
    .min(Yup.ref("arrival"), "Departure must be after arrival"),
});

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState(null);
  const [user, setUser] = useState(null);

  // Safely get roomId from search params
  useEffect(() => {
    if (searchParams) {
      const id = searchParams.get("roomId");
      setRoomId(id);
    }
  }, [searchParams]);

  const {
    data: roomData,
    loading: roomLoading,
    error: roomError,
  } = useQuery(GET_ROOM_BY_ID, {
    variables: { id: roomId },
    skip: !roomId,
    fetchPolicy: "network-only",
  });

  const [createBooking, { loading: bookingLoading }] = useMutation(
    CREATE_BOOKING,
    {
      onCompleted: (data) => {
        toast.success("Booking confirmed successfully!");
        const booking = data.createBooking;
        setTimeout(() => {
          router.push(
            `/booking-success?fullname=${encodeURIComponent(booking.guestFirstName + " " + booking.guestLastName)}&email=${encodeURIComponent(booking.guestEmail)}&arrival=${booking.checkIn}&departure=${booking.checkOut}`,
          );
        }, 500);
      },
      onError: (error) => {
        toast.error(error.message || "Booking failed. Please try again.");
      },
    },
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Wait for roomId to be available
    if (!roomId) return;

    if (!token) {
      toast.error("Please log in to book a room");
      router.push(
        `/login?redirect=${encodeURIComponent("/booking?roomId=" + roomId)}`,
      );
    } else if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [router, roomId]);

  const formik = useFormik({
    initialValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
      phone: user?.phone || "",
      arrival: "",
      departure: "",
    },
    validationSchema: bookingValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Validate dates before proceeding
      if (values.arrival && values.departure) {
        const checkIn = new Date(values.arrival);
        const checkOut = new Date(values.departure);
        if (checkOut <= checkIn) {
          toast.error("Departure date must be after arrival date");
          return;
        }
      }

      // Store booking details in localStorage and redirect to payment
      const bookingData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        arrival: values.arrival,
        departure: values.departure,
        roomId,
        roomName: room?.name,
        roomPrice: room?.price,
        totalPrice: totalPriceWithTax,
        nights: calculateNights(),
      };
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      router.push("/payment");
    },
  });

  const room = roomData?.getRoomById;
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = formik;

  // Calculate number of nights
  const calculateNights = () => {
    if (!values.arrival || !values.departure) return 0;
    const checkIn = new Date(values.arrival);
    const checkOut = new Date(values.departure);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0;
    if (checkOut <= checkIn) return 1;
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  // Calculate number of nights and total price
  const calculatePrice = () => {
    if (!values.arrival || !values.departure || !room) return 0;
    const checkIn = new Date(values.arrival);
    const checkOut = new Date(values.departure);

    // Check for invalid dates
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0;
    if (checkOut <= checkIn) return room.price;

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return Math.max(nights, 1) * room.price;
  };

  const totalPrice = calculatePrice();
  const totalPriceWithTax = totalPrice * 1.1;
  const nights = calculateNights();

  const handleBack = () => {
    router.back();
  };

  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="text-center">
          <div className="text-white text-xl mb-4">
            Loading booking details...
          </div>
          <button
            onClick={() => router.back()}
            className="text-blue-200 hover:text-white transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="text-white text-xl">Loading room details...</div>
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="text-center">
          <div className="text-white text-xl mb-4">
            {roomError ? "Error loading room details" : "Room not found"}
          </div>
          {roomError && (
            <div className="text-red-300 text-sm mb-4">{roomError.message}</div>
          )}
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!room.isAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800 px-4">
        <div className="max-w-xl rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-10 text-center shadow-2xl">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            No available space for now
          </h1>
          <p className="text-blue-100 mb-6">
            This room is currently unavailable. Please check back later or
            choose a different room from our listings.
          </p>
          <button
            onClick={() => router.push("/rooms")}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-500 transition"
          >
            Browse available rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 py-12 px-4">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-white hover:text-blue-200 transition group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition">←</span>
          <span>Back to Rooms</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Guest Information
              </h1>
              <p className="text-gray-600 mb-6">
                Please fill in your details to complete the booking
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guest Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 ${
                        errors.firstName && touched.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && touched.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 ${
                        errors.lastName && touched.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && touched.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+1 234 567 8900"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 ${
                      errors.phone && touched.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival Date *
                    </label>
                    <input
                      type="date"
                      name="arrival"
                      value={values.arrival}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 ${
                        errors.arrival && touched.arrival
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.arrival && touched.arrival && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.arrival}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      name="departure"
                      value={values.departure}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={
                        values.arrival || new Date().toISOString().split("T")[0]
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 ${
                        errors.departure && touched.departure
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.departure && touched.departure && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.departure}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium transition"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Booking Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                Booking Summary
              </h2>

              {/* Room Details */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {room.name}
                </h3>
                {room.images && room.images.length > 0 && (
                  <div className="relative w-full h-32 mb-2">
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {room.description}
                </p>
                <p className="text-lg font-bold text-blue-900 mt-2">
                  ${room.price}/night
                </p>
              </div>

              {/* Booking Details */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-semibold text-gray-800">
                    {formatBookingDateLong(values.arrival)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-semibold text-gray-800">
                    {formatBookingDateLong(values.departure)}
                  </p>
                </div>
                {values.arrival && values.departure && (
                  <div>
                    <p className="text-sm text-gray-600">Number of Nights</p>
                    <p className="font-semibold text-gray-800">{nights}</p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              {values.arrival && values.departure && (
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({nights} nights × ${room.price})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-900">
                    ${totalPriceWithTax.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-center space-x-4 mb-3">
                  <span className="text-2xl">💳</span>
                  <span className="text-2xl">🔒</span>
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  ✓ Secure checkout powered by our trusted payment gateway
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">
                  We accept Visa, Mastercard, American Express, and PayPal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
