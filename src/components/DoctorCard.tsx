// DoctorCard component
// Receives doctor data as props and displays a card

import Link from "next/link"

// TypeScript interface — defines what props this component accepts
// Think of it like a contract: "whoever uses this component MUST pass these"
interface DoctorCardProps {
  id: string
  name: string
  specialization: string
  experience: number
  fees: number
}

// Destructure props directly in the function parameter
export default function DoctorCard({
  id,
  name,
  specialization,
  experience,
  fees,
}: DoctorCardProps) {
  return (
    // Card container
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">

      {/* Doctor avatar placeholder */}
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">👨‍⚕️</span>
      </div>

      {/* Doctor name */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {name}
      </h3>

      {/* Specialization badge */}
      <span className="inline-block bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full mb-3">
        {specialization}
      </span>

      {/* Details row */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>⏱ {experience} years exp</span>
        <span className="font-semibold text-green-600">₹{fees}</span>
      </div>

      {/* Book button — links to doctor detail page */}
      <Link
        href={`/doctors/${id}`}
        className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Book Appointment
      </Link>

    </div>
  )
}
