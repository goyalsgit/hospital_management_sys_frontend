// This is the HOME PAGE — renders at http://localhost:3000/
// No "use client" needed here because there's no useState or useEffect
// It's a simple static page

// In Next.js, every page.tsx file exports a DEFAULT function
// The function name doesn't matter — Next.js just needs "export default"

import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar — reusable component from components/ folder */}
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Book Your Doctor Appointment
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
          Find the best doctors and book appointments online. Fast, easy, and reliable.
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          {/* Primary button */}
          <Link
            href="/doctors"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Find Doctors
          </Link>

          {/* Secondary button */}
          <Link
            href="/login"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50"
          >
            Login
          </Link>
        </div>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-16 max-w-5xl mx-auto">
        
        {/* Feature Card 1 */}
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Find Doctors</h3>
          <p className="text-gray-500 text-sm">Search by specialization and location</p>
        </div>

        {/* Feature Card 2 */}
        <div className="bg-green-50 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Book Appointment</h3>
          <p className="text-gray-500 text-sm">Select your preferred time slot</p>
        </div>

        {/* Feature Card 3 */}
        <div className="bg-purple-50 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">💊</div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Get Prescription</h3>
          <p className="text-gray-500 text-sm">Receive digital prescriptions</p>
        </div>

      </div>

    </div>
  )
}
