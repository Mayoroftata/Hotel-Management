"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import { toast } from "react-toastify";
import { formatBookingDate } from "@/lib/dateFormat";

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

const CheckoutForm = ({ bookingData, totalPrice }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [createBooking] = useMutation(CREATE_BOOKING, {
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
      setLoading(false);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Demo validation - just check if fields are filled
    if (
      !cardData.cardNumber ||
      !cardData.expiryDate ||
      !cardData.cvv ||
      !cardData.cardName
    ) {
      toast.error("Please fill in all card details");
      setLoading(false);
      return;
    }

    // Simulate payment processing
    toast.info("Processing payment...");

    setTimeout(async () => {
      try {
        // Simulate payment success (for demo)
        toast.success("Payment processed successfully!");

        // Create booking
        await createBooking({
          variables: {
            input: {
              guestFirstName: bookingData.firstName,
              guestLastName: bookingData.lastName,
              guestEmail: bookingData.email,
              phone: bookingData.phone,
              room: bookingData.roomId,
              checkIn: bookingData.arrival,
              checkOut: bookingData.departure,
              status: "CONFIRMED",
            },
          },
        });
      } catch (error) {
        console.error("Booking error:", error);
        toast.error("Booking failed. Please try again.");
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <span className="text-yellow-600 text-sm font-medium">Demo Mode</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          This is a demo payment form. Enter any card details to proceed.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Card Holder Name *
        </label>
        <input
          type="text"
          name="cardName"
          value={cardData.cardName}
          onChange={handleInputChange}
          placeholder="John Doe"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Card Number *
        </label>
        <input
          type="text"
          name="cardNumber"
          value={cardData.cardNumber}
          onChange={handleInputChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Expiry Date *
          </label>
          <input
            type="text"
            name="expiryDate"
            value={cardData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            CVV *
          </label>
          <input
            type="text"
            name="cvv"
            value={cardData.cvv}
            onChange={handleInputChange}
            placeholder="123"
            maxLength="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin mr-2">⟳</span>
            Processing Payment...
          </>
        ) : (
          `Pay $${(totalPrice * 1.1).toFixed(2)}`
        )}
      </button>
    </form>
  );
};

const Page = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (data) {
      const parsed = JSON.parse(data);
      setBookingData(parsed);
      // In a real app, you'd fetch room details here
      // For now, we'll assume room data is available
    } else {
      toast.error("No booking data found. Please start over.");
      router.push("/rooms");
    }
  }, [router]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="text-white text-xl">Loading payment details...</div>
      </div>
    );
  }

  const totalPrice = bookingData.totalPrice;
  const tax = totalPrice * 0.1;
  const finalTotal = totalPrice + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-white hover:text-blue-200 transition group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition">←</span>
          <span>Back to Booking Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">
              Payment Details
            </h1>

            <CheckoutForm bookingData={bookingData} totalPrice={totalPrice} />
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              Booking Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Guest Name:</span>
                <span className="font-medium text-gray-900">
                  {bookingData.firstName} {bookingData.lastName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Email:</span>
                <span className="font-medium text-gray-900">
                  {bookingData.email}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Phone:</span>
                <span className="font-medium text-gray-900">
                  {bookingData.phone}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Check-in:</span>
                <span className="font-medium text-gray-900">
                  {formatBookingDate(bookingData.arrival)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Check-out:</span>
                <span className="font-medium text-gray-900">
                  {formatBookingDate(bookingData.departure)}
                </span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between">
                <span className="text-gray-700">Room Rate:</span>
                <span className="font-medium text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Tax (10%):</span>
                <span className="font-medium text-gray-900">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-blue-900 pt-2 border-t">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
