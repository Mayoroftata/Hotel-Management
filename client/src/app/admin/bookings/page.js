"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { formatBookingDate, toDateInputValue } from "@/lib/dateFormat";

const GET_ALL_BOOKINGS = gql`
  query GetAllBookings {
    getAllBookings {
      id
      guestFirstName
      guestLastName
      guestEmail
      phone
      status
      checkIn
      checkOut
      totalPrice
      cancellationReason
      cancelledAt
      room {
        id
        name
        category
        price
      }
    }
    getAllRooms {
      id
      name
      number
      category
      price
      isAvailable
    }
  }
`;

const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $input: BookingUpdateInput!) {
    updateBooking(id: $id, input: $input) {
      id
      guestFirstName
      guestLastName
      guestEmail
      phone
      status
      checkIn
      checkOut
      totalPrice
      cancellationReason
      cancelledAt
      room {
        id
        name
        category
        price
      }
    }
  }
`;

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id)
  }
`;

const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!, $reason: String!) {
    cancelBooking(id: $id, reason: $reason) {
      id
      status
      cancellationReason
      cancelledAt
    }
  }
`;

const statusClassName = (status) => {
  switch (status) {
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800";
    case "ERROR":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-green-100 text-green-800";
  }
};

const isBeforeCheckout = (booking) => {
  if (!booking?.checkOut) return false;
  const checkOut = new Date(booking.checkOut);
  return !Number.isNaN(checkOut.getTime()) && new Date() < checkOut;
};

export default function AdminBookings() {
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data, loading, error, refetch } = useQuery(GET_ALL_BOOKINGS, {
    fetchPolicy: "network-only",
  });

  const rooms = data?.getAllRooms || [];
  const bookings = data?.getAllBookings || [];
  const bookingStats = useMemo(
    () => ({
      ALL: bookings.length,
      CONFIRMED: bookings.filter((booking) => booking.status === "CONFIRMED").length,
      CANCELLED: bookings.filter((booking) => booking.status === "CANCELLED").length,
      ERROR: bookings.filter((booking) => booking.status === "ERROR").length,
      COMPLETED: bookings.filter((booking) => booking.status === "COMPLETED").length,
    }),
    [bookings],
  );
  const visibleBookings = useMemo(
    () =>
      statusFilter === "ALL"
        ? bookings
        : bookings.filter((booking) => booking.status === statusFilter),
    [bookings, statusFilter],
  );

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === formData?.room),
    [rooms, formData?.room],
  );

  const [updateBooking, { loading: updating }] = useMutation(UPDATE_BOOKING, {
    onCompleted: () => {
      toast.success("Booking updated successfully");
      setEditingBooking(null);
      setFormData(null);
      refetch();
    },
    onError: (mutationError) => toast.error(mutationError.message),
  });

  const [deleteBooking, { loading: deleting }] = useMutation(DELETE_BOOKING, {
    onCompleted: () => {
      toast.success("Booking deleted successfully");
      setBookingToDelete(null);
      refetch();
    },
    onError: (mutationError) => toast.error(mutationError.message),
  });

  const [cancelBooking, { loading: cancelling }] = useMutation(CANCEL_BOOKING, {
    onCompleted: () => {
      toast.success("Booking cancelled successfully");
      setBookingToCancel(null);
      setCancellationReason("");
      refetch();
    },
    onError: (mutationError) => toast.error(mutationError.message),
  });

  const openEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      guestFirstName: booking.guestFirstName || "",
      guestLastName: booking.guestLastName || "",
      guestEmail: booking.guestEmail || "",
      phone: booking.phone || "",
      room: booking.room?.id || "",
      checkIn: toDateInputValue(booking.checkIn),
      checkOut: toDateInputValue(booking.checkOut),
      status: booking.status || "CONFIRMED",
      totalPrice: booking.totalPrice?.toString() || "",
    });
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!editingBooking || !formData) return;

    updateBooking({
      variables: {
        id: editingBooking.id,
        input: {
          guestFirstName: formData.guestFirstName,
          guestLastName: formData.guestLastName,
          guestEmail: formData.guestEmail,
          phone: formData.phone,
          room: formData.room,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          status: formData.status,
          totalPrice: formData.totalPrice ? parseFloat(formData.totalPrice) : 0,
        },
      },
    });
  };

  const handleDelete = () => {
    if (!bookingToDelete) return;
    deleteBooking({ variables: { id: bookingToDelete.id } });
  };

  const openCancel = (booking) => {
    setBookingToCancel(booking);
    setCancellationReason(booking.cancellationReason || "");
  };

  const handleCancelBooking = () => {
    if (!bookingToCancel) return;
    if (isBeforeCheckout(bookingToCancel) && !cancellationReason.trim()) {
      toast.error("Please enter a cancellation reason");
      return;
    }
    cancelBooking({
      variables: {
        id: bookingToCancel.id,
        reason: cancellationReason.trim() || "Cancelled after check-out date",
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-xl rounded-xl bg-white p-8 text-center shadow">
          <h1 className="mb-3 text-2xl font-bold text-red-700">Unable to load bookings</h1>
          <p className="mb-6 text-slate-600">Please make sure you are logged in as an administrator.</p>
          <Link href="/admin" className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Bookings</h1>
            <p className="mt-2 text-slate-600">View, edit, or delete hotel reservations.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/create-booking" className="rounded-full bg-green-700 px-5 py-3 text-white hover:bg-green-800">
              Create Booking
            </Link>
            <Link href="/admin" className="rounded-full bg-blue-900 px-5 py-3 text-white hover:bg-blue-800">
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-5">
          {[
            ["ALL", "Total", "bg-slate-900 text-white"],
            ["CONFIRMED", "Confirmed", "bg-green-700 text-white"],
            ["CANCELLED", "Cancelled", "bg-red-700 text-white"],
            ["ERROR", "Error", "bg-amber-600 text-white"],
            ["COMPLETED", "Completed", "bg-blue-700 text-white"],
          ].map(([status, label, activeClass]) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl border border-slate-200 p-4 text-left shadow-sm transition ${
                statusFilter === status ? activeClass : "bg-white text-slate-900 hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-medium opacity-80">{label} Bookings</p>
              <p className="mt-2 text-3xl font-bold">{bookingStats[status]}</p>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["Guest", "Room", "Dates", "Status", "Total", "Email", "Actions"].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visibleBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                    {booking.guestFirstName} {booking.guestLastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                    {booking.room?.name || "No room"} {booking.room?.category ? `(${booking.room.category})` : ""}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                    {formatBookingDate(booking.checkIn)} - {formatBookingDate(booking.checkOut)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                    <span className={`rounded-full px-2 py-1 text-xs ${statusClassName(booking.status)}`}>
                      {booking.status}
                    </span>
                    {booking.cancellationReason && (
                      <p className="mt-1 max-w-56 truncate text-xs font-normal text-slate-500" title={booking.cancellationReason}>
                        {booking.cancellationReason}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-blue-900">
                    ${(booking.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{booking.guestEmail}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(booking)}
                        className="rounded-lg bg-blue-100 px-3 py-2 font-medium text-blue-900 hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openCancel(booking)}
                        disabled={booking.status === "CANCELLED"}
                        className="rounded-lg bg-amber-100 px-3 py-2 font-medium text-amber-900 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setBookingToDelete(booking)}
                        disabled={deleting}
                        className="rounded-lg bg-red-100 px-3 py-2 font-medium text-red-900 hover:bg-red-200 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-slate-500">
                    No bookings match this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingBooking && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Booking</h2>
              <p className="mt-1 text-sm text-slate-600">
                {editingBooking.guestFirstName} {editingBooking.guestLastName}
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["guestFirstName", "First Name", "Ada"],
                  ["guestLastName", "Last Name", "Okafor"],
                  ["guestEmail", "Email", "guest@example.com"],
                  ["phone", "Phone", "+234 800 000 0000"],
                ].map(([field, label, placeholder]) => (
                  <label key={field} className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                    <input
                      type={field === "guestEmail" ? "email" : "text"}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                      required={field !== "phone"}
                    />
                  </label>
                ))}

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Room</span>
                  <select
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} ({room.number}) - {room.category} - ${room.price || 0}/night
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Check-in</span>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Check-out</span>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ERROR">ERROR</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Total Price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                    placeholder={selectedRoom ? `${selectedRoom.price || 0}` : "0.00"}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBooking(null);
                    setFormData(null);
                  }}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-lg bg-blue-900 px-6 py-3 font-medium text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900">Cancel Booking</h2>
              <p className="mt-1 text-sm text-slate-600">
                {bookingToCancel.guestFirstName} {bookingToCancel.guestLastName} · {formatBookingDate(bookingToCancel.checkIn)} - {formatBookingDate(bookingToCancel.checkOut)}
              </p>
            </div>
            <div className="space-y-4 p-6">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Cancellation reason {isBeforeCheckout(bookingToCancel) ? "*" : ""}
                </span>
                <textarea
                  value={cancellationReason}
                  onChange={(event) => setCancellationReason(event.target.value)}
                  rows="5"
                  placeholder="Explain why this booking is being cancelled."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                />
              </label>
              {isBeforeCheckout(bookingToCancel) && (
                <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  This booking is before check-out, so a cancellation reason is required.
                </p>
              )}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setBookingToCancel(null);
                    setCancellationReason("");
                  }}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">Delete Booking</h2>
            <p className="mt-3 text-sm text-slate-600">
              This will permanently delete the booking for{" "}
              <span className="font-semibold text-slate-900">
                {bookingToDelete.guestFirstName} {bookingToDelete.guestLastName}
              </span>
              . This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
