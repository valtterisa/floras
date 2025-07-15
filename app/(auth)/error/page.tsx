"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center max-w-md w-full">
        <div className="mb-4">
          <svg
            className="h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="white"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Sorry, we couldn't complete your request.
          <br />
          Please try again or return to the homepage.
        </p>
        <Link href="/">
          <button className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors font-medium">
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}
