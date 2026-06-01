"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { formatBookingDate } from "@/lib/dateFormat";

const Page = () => {
  const searchParams = useSearchParams();
  const fullname = searchParams.get("fullname");
  const email = searchParams.get("email");
  const arrival = searchParams.get("arrival");
  const departure = searchParams.get("departure");

  return (
    <div className="justify-center pt-20 min-h-screen bg-blue-900">
      <div className="space-y-5 text-white">
        <Image
          className="px-7 md:px-0 mx-auto"
          src="/images/bro.png"
          width={400}
          height={0}
          alt="book"
        />
        <p className="text-center text-2xl font-bold">Booking Successful</p>
        <p className="text-center px-4 text-lg">
          Thank you for choosing Deeluck Hotel, a receipt has been sent to your email.
        </p>

        <div className="bg-white/10 mx-auto p-5 rounded-lg max-w-md text-white space-y-2">
          <h3 className="text-xl font-bold text-center underline">Booking Summary</h3>
          <p><span className="font-semibold">Full Name:</span> {fullname}</p>
          <p><span className="font-semibold">Email:</span> {email}</p>
          <p><span className="font-semibold">Arrival Date:</span> {formatBookingDate(arrival)}</p>
          <p><span className="font-semibold">Departure Date:</span> {formatBookingDate(departure)}</p>
        </div>

        <div className="text-center">
          <Link
            href={"/"}
            className="bg-blue-900 text-white font-base rounded border border-white px-5 py-2 mt-3"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
