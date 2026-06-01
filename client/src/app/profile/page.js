"use client";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      phone
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      phone
      role
    }
  }
`;

const successToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

const errorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data, loading, error } = useQuery(GET_ME, {
    fetchPolicy: "network-only",
  });

  const [updateProfile, { loading: updating, error: updateError }] =
    useMutation(UPDATE_PROFILE, {
      refetchQueries: [{ query: GET_ME }],
      awaitRefetchQueries: true,
    });

  const [activeModal, setActiveModal] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile({
        variables: {
          input: {
            name: profileForm.name,
            email: profileForm.email,
            phone: profileForm.phone,
          },
        },
      });
      closeModal();
      successToast("Profile updated successfully");
    } catch (err) {
      errorToast("Failed to update profile");
      console.error("Profile update failed:", err);
    }
  };

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const user = data?.me;

  useEffect(() => {
    if (error) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [error, pathname, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="flex min-h-[60vh] items-center justify-center">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <section
        className="relative flex min-h-[430px] items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: "url('/img/TopRoom5.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/55" />

        <div className="relative w-full max-w-4xl rounded-md bg-white/65 px-6 py-10 text-center shadow-sm backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-[#0f315f]">My Account</h1>
          <p className="mt-3 text-sm text-[#0f315f]">
            Welcome back, {user.name}. Manage your reservations, profile,
            preferences, and more.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Manage Your Bookings Section */}
        <section className="mx-auto max-w-5xl rounded-lg bg-white px-6 py-8 shadow-md mb-10">
          <h2 className="mb-7 text-center text-2xl font-bold uppercase text-[#0f315f]">
            Manage Your Bookings
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              className="profile-card text-left"
              onClick={() => openModal("allBookings")}
            >
              <div>
                <h3 className="font-bold text-lg mb-2">My Bookings</h3>
                <p className="text-sm text-gray-700">
                  View and manage all your bookings and reservations.
                </p>
              </div>
            </button>

            <button
              type="button"
              className="profile-card text-left"
              onClick={() => openModal("upcoming")}
            >
              <div>
                <h3 className="font-bold text-lg mb-2">Upcoming Stays</h3>
                <p className="text-sm text-gray-700">
                  Review your upcoming hotel stays and arrival details.
                </p>
              </div>
            </button>

            <button
              type="button"
              className="profile-card text-left"
              onClick={() => openModal("past")}
            >
              <div>
                <h3 className="font-bold text-lg mb-2">Past Stays</h3>
                <p className="text-sm text-gray-700">
                  View your stay history and completed reservations.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Guest Services Section */}
        <section className="mx-auto max-w-5xl rounded-lg bg-white px-6 py-8 shadow-md">
          <h2 className="mb-7 text-center text-2xl font-bold uppercase text-[#0f315f]">
            Manage Your Guest Experience
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              className="profile-card text-left"
              onClick={() => openModal("profile")}
            >
              <div>
                <h3 className="font-bold text-md mb-2">Profile Settings</h3>
                <p className="text-xs text-gray-700">
                  Edit your personal profile information.
                </p>
              </div>
            </button>

            <button
              type="button"
              className="profile-card text-left"
              onClick={() => openModal("payment")}
            >
              <div>
                <h3 className="font-bold text-md mb-2">Payment Methods</h3>
                <p className="text-xs text-gray-700">
                  Manage your card payment options.
                </p>
              </div>
            </button>

            <button
              type="button"
              className="profile-card text-left"
              onClick={() => openModal("notifications")}
            >
              <div>
                <h3 className="font-bold text-md mb-2">
                  Notifications & Alerts
                </h3>
                <p className="text-xs text-gray-700">
                  Stay in touch with your account activity.
                </p>
              </div>
            </button>

            <button
              type="button"
              className="profile-card text-left"
              onClick={() => openModal("preferences")}
            >
              <div>
                <h3 className="font-bold text-md mb-2">Room Preferences</h3>
                <p className="text-xs text-gray-700">
                  Set your room and amenity preferences.
                </p>
              </div>
            </button>

            <button
              type="button"
              className="profile-card text-left"
              onClick={() => openModal("saved")}
            >
              <div>
                <h3 className="font-bold text-md mb-2">Saved Rooms</h3>
                <p className="text-xs text-gray-700">
                  Quickly access saved room selections.
                </p>
              </div>
            </button>

            <Link href="/support" className="profile-card text-left">
              <div>
                <h3 className="font-bold text-md mb-2">Guest Support</h3>
                <p className="text-xs text-gray-700">
                  Need assistance with your stay?
                </p>
              </div>
            </Link>

            <button
              className="profile-card text-left"
              onClick={() => openModal("logout")}
            >
              <div>
                <h3 className="font-bold text-md mb-2">Logout</h3>
                <p className="text-xs text-gray-700">
                  Log out of your account.
                </p>
              </div>
            </button>
          </div>
        </section>
      </main>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h3 className="text-2xl font-semibold text-[#0f315f]">
                  {activeModal === "profile" && "Edit Profile"}
                  {activeModal === "payment" && "Payment Methods"}
                  {activeModal === "notifications" && "Notifications & Alerts"}
                  {activeModal === "preferences" && "Room Preferences"}
                  {activeModal === "saved" && "Saved Rooms"}
                  {activeModal === "support" && "Guest Support"}
                  {activeModal === "allBookings" && "All Reservations"}
                  {activeModal === "upcoming" && "Upcoming Stays"}
                  {activeModal === "past" && "Past Stays"}
                  {activeModal === "logout" && "Logout"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-lg font-bold text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-6">
              {activeModal === "profile" && (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-900 focus:outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-900 focus:outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-900 focus:outline-none text-gray-900"
                    />
                  </div>
                  {updateError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      Failed to save profile. Please check your input and try
                      again.
                    </div>
                  )}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-xl border border-gray-300 px-5 py-2 text-black hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="rounded-xl bg-blue-900 px-5 py-2 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
              {activeModal === "payment" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Manage saved credit cards, billing addresses, and payment
                    preferences.
                  </p>
                  <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <p className="font-semibold">Visa ending in 1234</p>
                    <p className="text-sm text-gray-600">Expires 08/2026</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <p className="font-semibold">Mastercard ending in 5678</p>
                    <p className="text-sm text-gray-600">Expires 03/2027</p>
                  </div>
                </div>
              )}
              {activeModal === "notifications" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Choose how you want to receive updates about your
                    reservations and hotel offers.
                  </p>
                  <label className="flex items-center justify-between rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <span>Email notifications</span>
                    <input type="checkbox" className="h-5 w-5 rounded" />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <span>SMS alerts</span>
                    <input type="checkbox" className="h-5 w-5 rounded" />
                  </label>
                </div>
              )}
              {activeModal === "preferences" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Save your preferred room type, view, and amenities for
                    future stays.
                  </p>
                  <label className="block">
                    <span className="text-sm font-medium text-black">
                      Preferred room type
                    </span>
                    <select className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-900 focus:outline-none">
                      <option>Deluxe Room</option>
                      <option>King Suite</option>
                      <option>Standard Room</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-black">
                      Preferred bed type
                    </span>
                    <select className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-900 focus:outline-none">
                      <option>King</option>
                      <option>Queen</option>
                      <option>Two Doubles</option>
                    </select>
                  </label>
                </div>
              )}
              {activeModal === "saved" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Review your favorite rooms and keep them ready for your next
                    visit.
                  </p>
                  <ul className="space-y-3">
                    <li className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                      <p className="font-semibold">Ocean View Suite</p>
                      <p className="text-sm text-gray-600">
                        King bed, balcony, room 502
                      </p>
                    </li>
                    <li className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                      <p className="font-semibold">Deluxe City Room</p>
                      <p className="text-sm text-gray-600">
                        Queen bed, city view, room 314
                      </p>
                    </li>
                  </ul>
                </div>
              )}
              {activeModal === "support" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Our guest support team is here to help with room requests,
                    billing, and special arrangements.
                  </p>
                  <p className="text-sm">
                    Call:{" "}
                    <span className="font-semibold">+1 (555) 123-4567</span>
                  </p>
                  <p className="text-sm">
                    Email:{" "}
                    <span className="font-semibold">
                      support@deeluckhotel.com
                    </span>
                  </p>
                </div>
              )}
              {activeModal === "allBookings" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Quickly access your booking summary and manage reservations
                    from one place.
                  </p>
                  <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <p className="font-semibold">Current reservation</p>
                    <p className="text-sm text-gray-600">
                      Deluxe Room · May 15 - May 18
                    </p>
                  </div>
                </div>
              )}
              {activeModal === "upcoming" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Review your next scheduled stay and arrival details.
                  </p>
                  <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <p className="font-semibold">Deluxe Room</p>
                    <p className="text-sm text-gray-600">May 15 - May 18</p>
                    <p className="text-sm text-gray-600">Check-in: 3:00 PM</p>
                  </div>
                </div>
              )}
              {activeModal === "past" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Review your previous stays and reservation history.
                  </p>
                  <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <p className="font-semibold">King Suite</p>
                    <p className="text-sm text-gray-600">Apr 10 - Apr 12</p>
                  </div>
                </div>
              )}
              {activeModal === "logout" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    You can log out safely from your account. This will clear
                    your session and return you to the home page.
                  </p>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-xl border border-gray-300 px-5 py-2 text-black hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("userImage");
                        closeModal();
                        window.location.href = "/";
                      }}
                      className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Page;
