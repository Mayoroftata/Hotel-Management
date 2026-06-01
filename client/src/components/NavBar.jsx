"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";

const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
    }
  }
`;


export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data, loading, error } = useQuery(GET_ME, {
    fetchPolicy: "network-only",
    skip: !localStorage.getItem("token"), // Only run query if token exists
  });

  const isLoggedIn = !!data?.me || !!localStorage.getItem("token");
  const isAdmin = data?.me?.role === "admin";


  // Toggle dropdown
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Toggle User Dropdown
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <nav className="bg-white p-4 shadow-md flex" ref={dropdownRef}>
      <div className="container flex justify-between items-center mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl text-blue-900 font-bold">
          DEELUCK
        </Link>

        {/* Navigation Links */}
        <div
          className={`
            hidden md:hidden lg:flex space-x-6 items-center
            md:relative md:bg-transparent md:p-0
          `}
        >
          {/* Rooms & Suits Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('rooms')}
              className="text-blue-900 block focus:outline-none hover:text-yellow-500 md:inline"
            >
              ROOMS & SUITES
            </button>
            {activeDropdown === 'rooms' && (
              <div className="md:absolute md:bg-white md:mt-2 md:overflow-hidden md:rounded-md md:shadow-lg md:w-48 md:z-10">
                <Link
                  href="/rooms/standard"
                  className="text-gray-800 block cursor-pointer hover:bg-gray-100 md:border-t md:first:border-t-0 px-4 py-2"
                >
                  Standard Rooms
                </Link>
                <Link
                  href="/rooms/deluxe"
                  className="text-gray-800 block cursor-pointer hover:bg-gray-100 px-4 py-2"
                >
                  Deluxe Rooms
                </Link>
                <Link
                  href="/rooms/suites"
                  className="text-gray-800 block cursor-pointer hover:bg-gray-100 px-4 py-2"
                >
                  Suites
                </Link>
              </div>
            )}
          </div>

          {/* Meetings & Events Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('meetings')}
              className="text-blue-900 block focus:outline-none hover:text-yellow-500 md:inline"
            >
              MEETINGS & EVENTS
            </button>
            {activeDropdown === 'meetings' && (
              <div className="md:absolute md:bg-white md:mt-2 md:overflow-hidden md:rounded-md md:shadow-lg md:w-48 md:z-10">
                <Link
                  href="/meetings-events/conferences"
                  className="text-gray-800 block cursor-pointer hover:bg-gray-100 md:border-t md:first:border-t-0 px-4 py-2"
                >
                  Conferences
                </Link>
                <Link
                  href="/meetings-events/weddings"
                  className="text-gray-800 block cursor-pointer hover:bg-gray-100 px-4 py-2"
                >
                  Weddings
                </Link>
                <Link
                  href="/meetings-events/corporate-events"
                  className="text-gray-800 block cursor-pointer hover:bg-gray-100 px-4 py-2"
                >
                  Corporate Events
                </Link>
              </div>
            )}
          </div>

          {/* Other Links */}
          <Link
            href="/dining"
            className="text-blue-900 block cursor-pointer hover:text-yellow-500 md:inline"
          >
            DINING
          </Link>
          <Link
            href="/recreation-center"
            className="text-blue-900 block cursor-pointer hover:text-yellow-500 md:inline"
          >
            RECREATION CENTER
          </Link>
          <Link
            href="/support"
            className="text-blue-900 block cursor-pointer hover:text-yellow-500 md:inline"
          >
            SUPPORT
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-blue-900 block cursor-pointer hover:text-yellow-500 md:inline"
            >
              ADMIN
            </Link>
          )}
        </div>



        {/* User Profile */}
        {isLoggedIn ? (
          <div className="relative">
            <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
              {userImage ? (
                <Image src={userImage} alt="User" className="h-10 w-10 rounded-full border border-gray-300" />
              ) : (
                <FaUserCircle className="h-10 w-10 text-gray-500" />
              )}
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 bg-white rounded-md shadow-md w-48 mt-2 z-10">
                <Link href="/profile" className="block px-4 py-2 text-blue-600 hover:bg-gray-100">Profile</Link>
                <Link href="/settings" className="block px-4 py-2 text-blue-600 hover:bg-gray-100">Settings</Link>
                {isAdmin && (
                  <Link href="/admin" className="block px-4 py-2 text-blue-600 hover:bg-gray-100">Admin Dashboard</Link>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("userImage");
                    setUserImage(null);
                    setIsUserDropdownOpen(false);
                    window.location.href = "/";
                  }}
                  className="block text-left w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/login" className="bg-white border border-blue-900 rounded px-4 py-2 text-blue-900 hover:bg-blue-900 hover:text-white">LOG-IN</Link>
            <Link href="/register" className="bg-blue-900 text-white rounded px-4 py-2 hover:bg-white hover:text-blue-900">SIGN-UP</Link>
          </div>
        )}
      </div>


      {/* Hamburger Icon (Mobile only) */}
      <div className="md:block lg:hidden sm:block items-center">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-blue-900 focus:outline-none"
        >
          <FontAwesomeIcon icon={faBars} className="text-2xl m-2" />
        </button>
      </div>

      {/* Mobile Slide-out Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
          <div className="bg-white w-3/4 h-full p-6 transform transition-transform duration-300 ease-in-out translate-x-0">

            {/* Close Icon */}
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsMenuOpen(false)} className="text-blue-900 text-2xl focus:outline-none">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleDropdown('rooms')}
                  className="text-blue-900 w-full text-left focus:outline-none hover:text-yellow-500"
                >
                  ROOMS & SUITES
                </button>
                {activeDropdown === 'rooms' && (
                  <div className="pl-4 mt-2 space-y-1">
                    <Link href="/rooms/standard" className="block text-gray-800 hover:text-blue-900">Standard Rooms</Link>
                    <Link href="/rooms/deluxe" className="block text-gray-800 hover:text-blue-900">Deluxe Rooms</Link>
                    <Link href="/rooms/suites" className="block text-gray-800 hover:text-blue-900">Suites</Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleDropdown('meetings')}
                  className="text-blue-900 w-full text-left focus:outline-none hover:text-yellow-500"
                >
                  MEETINGS & EVENTS
                </button>
                {activeDropdown === 'meetings' && (
                  <div className="pl-4 mt-2 space-y-1">
                    <Link href="/meetings-events/conferences" className="block text-gray-800 hover:text-blue-900">Conferences</Link>
                    <Link href="/meetings-events/weddings" className="block text-gray-800 hover:text-blue-900">Weddings</Link>
                    <Link href="/meetings-events/corporate-events" className="block text-gray-800 hover:text-blue-900">Corporate Events</Link>
                  </div>
                )}
              </div>

              <Link href="/dining" className="block text-blue-900 hover:text-yellow-500">DINING</Link>
              <Link href="/recreation" className="block text-blue-900 hover:text-yellow-500">RECREATION CENTER</Link>
              <Link href="/support" className="block text-blue-900 hover:text-yellow-500">SUPPORT</Link>
              {isAdmin && (
                <Link href="/admin" className="block text-blue-900 hover:text-yellow-500">ADMIN</Link>
              )}

              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {userImage ? (
                        <Image src={userImage} alt="User" className="h-8 w-8 rounded-full border border-gray-300" />
                      ) : (
                        <FaUserCircle className="h-8 w-8 text-gray-500" />
                      )}
                      <span className="text-blue-900 font-medium">{data?.me?.name || 'User'}</span>
                    </div>
                    <Link href="/profile" className="block text-blue-900 hover:text-yellow-500">Profile</Link>
                    <Link href="/settings" className="block text-blue-900 hover:text-yellow-500">Settings</Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("userImage");
                        setUserImage(null);
                        setIsUserDropdownOpen(false);
                        setIsMenuOpen(false);
                        window.location.href = "/";
                      }}
                      className="block text-left w-full text-red-600 hover:text-red-800"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="block bg-white border border-blue-900 rounded px-4 py-2 text-blue-900 hover:bg-blue-900 hover:text-white text-center">LOG-IN</Link>
                    <Link href="/register" className="block bg-blue-900 text-white rounded px-4 py-2 hover:bg-white hover:text-blue-900 text-center">SIGN-UP</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clicking outside also closes the menu */}
          <div className="w-1/4" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}


    </nav>
  );
}