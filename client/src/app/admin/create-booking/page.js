"use client";

import Link from "next/link";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const GET_ROOMS = gql`
  query GetRoomsForManualBooking {
    getAllRooms {
      id
      name
      number
      price
      category
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
      status
      totalPrice
    }
  }
`;

const initialForm = {
  guestFirstName: "",
  guestLastName: "",
  guestEmail: "",
  phone: "",
  room: "",
  checkIn: "",
  checkOut: "",
};

const dateDiffNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

export default function CreateBookingPage() {
  const [formData, setFormData] = useState(initialForm);
  const { data, loading: roomsLoading } = useQuery(GET_ROOMS, {
    fetchPolicy: "network-only",
  });

  const selectedRoom = useMemo(
    () => data?.getAllRooms?.find((room) => room.id === formData.room),
    [data?.getAllRooms, formData.room],
  );
  const nights = dateDiffNights(formData.checkIn, formData.checkOut);
  const totalPrice = selectedRoom?.price && nights ? selectedRoom.price * nights : 0;

  const [createBooking, { loading }] = useMutation(CREATE_BOOKING, {
    onCompleted: () => {
      toast.success("Booking created successfully");
      setFormData(initialForm);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nights) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    createBooking({
      variables: {
        input: {
          guestFirstName: formData.guestFirstName,
          guestLastName: formData.guestLastName,
          guestEmail: formData.guestEmail,
          phone: formData.phone,
          room: formData.room,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          status: "CONFIRMED",
          totalPrice,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Create Manual Booking</h1>
            <p className="mt-2 text-slate-600">Add a hotel booking on behalf of a guest.</p>
          </div>
          <Link href="/admin" className="rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-white">
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Guest Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["guestFirstName", "First Name", "Ada"],
                ["guestLastName", "Last Name", "Okafor"],
                ["guestEmail", "Email", "guest@example.com"],
                ["phone", "Phone", "+234 800 000 0000"],
              ].map(([field, label, placeholder]) => (
                <label key={field} className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">{label} *</span>
                  <input
                    type={field === "guestEmail" ? "email" : "text"}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                    placeholder={placeholder}
                    required
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Stay Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">Room *</span>
                <select
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  required
                >
                  <option value="">{roomsLoading ? "Loading rooms..." : "Select a room"}</option>
                  {data?.getAllRooms?.map((room) => (
                    <option key={room.id} value={room.id} disabled={!room.isAvailable}>
                      {room.name} ({room.number}) - {room.category} - ${room.price || 0}/night
                      {!room.isAvailable ? " - unavailable" : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Check-in *</span>
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Check-out *</span>
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  required
                />
              </label>
            </div>

            <div className="mt-5 rounded-lg bg-blue-50 p-4 text-blue-950">
              <p className="text-sm">Nights: {nights}</p>
              <p className="mt-1 text-xl font-bold">Total: ${totalPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || roomsLoading}
              className="flex-1 rounded-lg bg-blue-900 px-6 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Booking"}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
