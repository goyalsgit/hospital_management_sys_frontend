import Link from "next/link"

interface DoctorCardProps {
  id: string
  name: string
  specialization: string
  experience: number
  fees: number
}

export default function DoctorCard({
  id,
  name,
  specialization,
  experience,
  fees,
}: DoctorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all group">

      {/* Avatar */}
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-xl group-hover:scale-105 transition-transform">
        {name.charAt(0)}
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>

      {/* Specialization */}
      <span className="inline-block bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium mb-4">
        {specialization}
      </span>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm mb-5 pb-4 border-b border-gray-100">
        <span className="text-gray-500">⏱ {experience} yrs</span>
        <span className="font-bold text-green-600">₹{fees}</span>
      </div>

      {/* Button */}
      <Link
        href={`/doctors/${id}`}
        className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Book Now →
      </Link>
    </div>
  )
}
