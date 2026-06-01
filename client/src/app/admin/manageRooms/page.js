"use client";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

const GET_ALL_ROOMS = gql`
  query GetAllRooms {
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

export default function ManageRooms() {
  const { data, loading, error } = useQuery(GET_ALL_ROOMS, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">
            Unable to load rooms
          </h1>
          <p className="text-slate-600 mb-6">
            Please make sure you are logged in as an administrator.
          </p>
          <Link
            href="/admin"
            className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800"
          >
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Rooms</h1>
            <p className="mt-2 text-slate-600">
              Review room inventory and prepare each stay.
            </p>
          </div>
          <Link
            href="/admin/addRoom"
            className="rounded-full bg-blue-900 px-5 py-3 text-white hover:bg-blue-800"
          >
            Add New Room
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.getAllRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {room.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {room.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {room.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    ${room.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    {room.isAvailable ? "Available" : "Unavailable"}
                  </td>
                </tr>
              ))}
              {data.getAllRooms.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No rooms available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
