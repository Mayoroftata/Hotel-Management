"use client";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-xl w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-red-700">Unauthorized</h1>
        <p className="mt-4 text-slate-600">
          You do not have permission to access this page. Please sign in with an
          administrator account.
        </p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link
            href="/login"
            className="rounded-full bg-blue-900 px-5 py-3 text-white hover:bg-blue-800"
          >
            Login
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-5 py-3 text-slate-900 hover:bg-slate-100"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
