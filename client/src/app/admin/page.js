"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { toast } from "react-toastify";
import { formatBookingDate } from "@/lib/dateFormat";

// GraphQL Queries
const ADMIN_DASHBOARD = gql`
  query AdminDashboard {
    me {
      id
      name
      role
    }
    getAllRooms {
      id
      name
      category
      price
      isAvailable
    }
    getAllBookings {
      id
      guestFirstName
      guestLastName
      status
      totalPrice
      createdAt
      room {
        id
        name
      }
    }
    getAllMeetingsEvents {
      id
      title
      description
      type
      capacity
      price
      images
      isAvailable
    }
    getAllDining {
      id
      name
      description
      cuisine
      priceRange
      openingHours
      isAvailable
    }
    getAllRecreationActivities {
      id
      name
      description
      category
      price
      duration
      maxCapacity
      isAvailable
    }
    getAllServiceBookings {
      id
      customerName
      serviceType
      bookingDate
      numberOfPeople
      status
      totalPrice
    }
  }
`;

// Mutations
const DELETE_ROOM = gql`
  mutation DeleteRoom($id: ID!) {
    deleteRoom(id: $id)
  }
`;

const DELETE_MEETING_EVENT = gql`
  mutation DeleteMeetingEvent($id: ID!) {
    deleteMeetingEvent(id: $id)
  }
`;

const DELETE_DINING = gql`
  mutation DeleteDining($id: ID!) {
    deleteDining(id: $id)
  }
`;

const DELETE_RECREATION = gql`
  mutation DeleteRecreationActivity($id: ID!) {
    deleteRecreationActivity(id: $id)
  }
`;

const UPDATE_ROOM_AVAILABILITY = gql`
  mutation UpdateRoomAvailability($id: ID!, $isAvailable: Boolean!) {
    updateRoomAvailability(id: $id, isAvailable: $isAvailable) {
      id
      isAvailable
    }
  }
`;

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [meetingsEvents, setMeetingsEvents] = useState([]);
  const [dining, setDining] = useState([]);
  const [recreation, setRecreation] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [roomToDelete, setRoomToDelete] = useState(null);
  
  const client = useApolloClient();
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const { data, loading, error, refetch } = useQuery(ADMIN_DASHBOARD, {
    fetchPolicy: "network-only",
    skip: !token,
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    onCompleted: (data) => {
      if (data) {
        setRooms(data.getAllRooms || []);
        setBookings(data.getAllBookings || []);
        setMeetingsEvents(data.getAllMeetingsEvents || []);
        setDining(data.getAllDining || []);
        setRecreation(data.getAllRecreationActivities || []);
        setServiceBookings(data.getAllServiceBookings || []);
      }
    },
  });

  const [deleteRoom] = useMutation(DELETE_ROOM, {
    onCompleted: () => {
      toast.success("Room deleted successfully");
      setRoomToDelete(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteMeetingEvent] = useMutation(DELETE_MEETING_EVENT, {
    onCompleted: () => {
      toast.success("Meeting/Event deleted successfully");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteDining] = useMutation(DELETE_DINING, {
    onCompleted: () => {
      toast.success("Dining option deleted successfully");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteRecreation] = useMutation(DELETE_RECREATION, {
    onCompleted: () => {
      toast.success("Recreation activity deleted successfully");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateRoomAvailability] = useMutation(UPDATE_ROOM_AVAILABILITY, {
    onCompleted: () => {
      toast.success("Room availability updated");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const isAdmin = data?.me?.role === "admin";

  // Calculate statistics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.isAvailable).length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalServiceBookingsCount = serviceBookings.length;
  const totalServiceRevenue = serviceBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  // Chart data
  const roomStatusData = [
    { name: "Available", value: availableRooms, color: "#10b981" },
    { name: "Occupied", value: totalRooms - availableRooms, color: "#ef4444" },
  ];

  const bookingStatusData = bookings.reduce((acc, booking) => {
    const status = booking.status || "PENDING";
    const existing = acc.find(item => item.name === status);
    if (existing) existing.value++;
    else acc.push({ name: status, value: 1 });
    return acc;
  }, []);

  const recentBookings = [...bookings].reverse().slice(0, 5);
  const handleDeleteRoom = () => {
    if (!roomToDelete) return;
    deleteRoom({ variables: { id: roomToDelete.id } });
  };

  // Check authentication
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-blue-900">Authentication Required</h1>
          <p className="text-slate-600 mb-6">Please log in to access the admin dashboard.</p>
          <Link href="/login?redirect=/admin" className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">Error Loading Dashboard</h1>
          <p className="text-slate-600 mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-3 text-red-700">Access Denied</h1>
          <p className="text-slate-600 mb-6">You must be signed in as an administrator to view this page.</p>
          <Link href="/" className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "rooms", name: "Rooms", icon: "🏨" },
    { id: "bookings", name: "Hotel Bookings", icon: "📅", href: "/admin/bookings" },
    { id: "meetings", name: "Meetings & Events", icon: "🎉" },
    { id: "dining", name: "Dining", icon: "🍽️" },
    { id: "recreation", name: "Recreation Center", icon: "🎮" },
    { id: "service-bookings", name: "Service Bookings", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap gap-2 py-4">
            {tabs.map((tab) => {
              const className = `px-6 py-2 rounded-full font-medium transition flex items-center gap-2
                ${activeTab === tab.id
                  ? "bg-blue-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"}`;

              if (tab.href) {
                return (
                  <Link key={tab.id} href={tab.href} className={className}>
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={className}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-10">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome back, {data.me.name}</h1>
              <p className="text-slate-600 mt-2">Here&apos;s what&apos;s happening with your hotel today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Rooms</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalRooms}</p>
                    <p className="text-sm text-green-600 mt-1">{availableRooms} Available</p>
                  </div>
                  <div className="text-4xl">🏨</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Hotel Bookings</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalBookings}</p>
                    <p className="text-sm text-blue-600 mt-1">This month</p>
                  </div>
                  <div className="text-4xl">📅</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Hotel Revenue</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">${totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Service Bookings</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalServiceBookingsCount}</p>
                    <p className="text-sm text-purple-600 mt-1">${totalServiceRevenue.toLocaleString()} revenue</p>
                  </div>
                  <div className="text-4xl">🎯</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Room Occupancy</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={roomStatusData} cx="50%" cy="50%" labelLine={false} 
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80} dataKey="value">
                        {roomStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Booking Status</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/admin/addRoom" className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100">
                    ➕ Add New Room
                  </Link>
                  <Link href="/admin/create-booking" className="block w-full text-left px-4 py-2 bg-green-50 text-green-900 rounded-lg hover:bg-green-100">
                    📝 Create Manual Booking
                  </Link>
                  <Link href="/admin/add-meeting-event" className="block w-full text-left px-4 py-2 bg-purple-50 text-purple-900 rounded-lg hover:bg-purple-100">
                    🎉 Add Meeting/Event
                  </Link>
                  <Link href="/admin/add-dining" className="block w-full text-left px-4 py-2 bg-orange-50 text-orange-900 rounded-lg hover:bg-orange-100">
                    🍽️ Add Dining Option
                  </Link>
                  <Link href="/admin/add-recreation" className="block w-full text-left px-4 py-2 bg-pink-50 text-pink-900 rounded-lg hover:bg-pink-100">
                    🎮 Add Recreation Activity
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-900">Recent Hotel Bookings</h3>
                  <Link href="/admin/bookings" className="text-sm text-blue-900 hover:underline">View All →</Link>
                </div>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{booking.guestFirstName} {booking.guestLastName}</p>
                        <p className="text-sm text-slate-600">{booking.room?.name || "No room"} • {booking.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-900">${booking.totalPrice}</p>
                        <p className="text-xs text-slate-500">{formatBookingDate(booking.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Management Tab */}
        {activeTab === "rooms" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Room Management</h2>
              <Link href="/admin/addRoom" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800">
                + Add New Room
              </Link>
            </div>
            <div className="grid gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900">{room.name}</h3>
                      <p className="text-slate-600 mt-1">Category: {room.category} • ${room.price}/night</p>
                      <div className="flex gap-2 mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {room.isAvailable ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/edit-room/${room.id}`} className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200">
                        Edit
                      </Link>
                      <button
                        onClick={() => setRoomToDelete(room)}
                        className="px-4 py-2 bg-red-100 text-red-900 rounded-lg hover:bg-red-200"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => updateRoomAvailability({ variables: { id: room.id, isAvailable: !room.isAvailable } })}
                        className="px-4 py-2 bg-yellow-100 text-yellow-900 rounded-lg hover:bg-yellow-200"
                      >
                        Toggle Availability
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meetings & Events Tab */}
        {activeTab === "meetings" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Meetings & Events</h2>
              <Link href="/admin/add-meeting-event" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800">
                + Add New Event
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetingsEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
                    <p className="text-sm text-blue-900 mt-1 capitalize">{event.type}</p>
                    <p className="text-slate-600 mt-2 text-sm line-clamp-2">{event.description}</p>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm"><strong>Capacity:</strong> {event.capacity} people</p>
                      <p className="text-sm"><strong>Price:</strong> ${event.price}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/admin/edit-meeting-event/${event.id}`} className="flex-1 text-center px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200">
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm("Delete this event?")) deleteMeetingEvent({ variables: { id: event.id } });
                        }}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-900 rounded-lg hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dining Tab */}
        {activeTab === "dining" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Dining Options</h2>
              <Link href="/admin/add-dining" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800">
                + Add Dining Option
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dining.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-blue-900 mt-1">{item.cuisine} Cuisine</p>
                  <p className="text-slate-600 mt-2 text-sm">{item.description}</p>
                  <div className="mt-4">
                    <p className="text-sm"><strong>Price Range:</strong> {item.priceRange}</p>
                    <p className="text-sm"><strong>Hours:</strong> {item.openingHours}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/admin/edit-dining/${item.id}`} className="flex-1 text-center px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200">
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Delete this dining option?")) deleteDining({ variables: { id: item.id } });
                      }}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-900 rounded-lg hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recreation Tab */}
        {activeTab === "recreation" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Recreation Center</h2>
              <Link href="/admin/add-recreation" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800">
                + Add Activity
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recreation.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{activity.name}</h3>
                  <p className="text-sm text-blue-900 mt-1 capitalize">{activity.category}</p>
                  <p className="text-slate-600 mt-2 text-sm">{activity.description}</p>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm"><strong>Duration:</strong> {activity.duration}</p>
                    <p className="text-sm"><strong>Price:</strong> ${activity.price}</p>
                    <p className="text-sm"><strong>Max Capacity:</strong> {activity.maxCapacity} people</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/admin/edit-recreation/${activity.id}`} className="flex-1 text-center px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200">
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Delete this activity?")) deleteRecreation({ variables: { id: activity.id } });
                      }}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-900 rounded-lg hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Bookings Tab */}
        {activeTab === "service-bookings" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Service Bookings</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Service Type</th>
                    <th className="text-left p-4">Booking Date</th>
                    <th className="text-left p-4">People</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-medium text-slate-900">{booking.customerName}</p>
                      </td>
                      <td className="p-4 capitalize">{booking.serviceType}</td>
                      <td className="p-4">{formatBookingDate(booking.bookingDate)}</td>
                      <td className="p-4">{booking.numberOfPeople}</td>
                      <td className="p-4 font-semibold text-blue-900">${booking.totalPrice}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${booking.status === "CONFIRMED" ? "bg-green-100 text-green-800" : 
                            booking.status === "CANCELLED" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"}`}>
                          {booking.status || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">Delete Room</h2>
            <p className="mt-3 text-sm text-slate-600">
              This will permanently delete{" "}
              <span className="font-semibold text-slate-900">{roomToDelete.name}</span>
              . Any existing booking references may no longer show full room details.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setRoomToDelete(null)}
                className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
              >
                Keep Room
              </button>
              <button
                type="button"
                onClick={handleDeleteRoom}
                className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
