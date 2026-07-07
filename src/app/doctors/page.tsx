"use client"
// "use client" is needed because we use useState and useEffect

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import DoctorCard from "@/components/DoctorCard"

// TypeScript: define what a Doctor object looks like
// This matches what our backend sends back
interface Doctor {
  _id: string
  name: string
  specialization: string
  experience: number
  fees: number
}

export default function DoctorsPage() {

  // State 1: the list of doctors from the API
  const [doctors, setDoctors] = useState<Doctor[]>([])

  // State 2: loading — true while waiting for API response
  const [loading, setLoading] = useState(true)

  // State 3: error message if something goes wrong
  const [error, setError] = useState<string | null>(null)

  // State 4: search filter
  const [search, setSearch] = useState("")

  // useEffect — runs once when the page first loads (empty [] dependency)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)

        // Call our backend API
        // process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000"
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/doctors`
        )

        // If response is not ok (4xx or 5xx), throw an error
        if (!res.ok) {
          throw new Error("Failed to fetch doctors")
        }

        const data = await res.json()
        setDoctors(data.doctors)

      } catch (err) {
        setError("Could not load doctors. Is the backend running?")
      } finally {
        // finally always runs — success or fail
        setLoading(false)
      }
    }

    fetchDoctors()
  }, []) // [] = run once on mount

  // Filter doctors based on search input
  // .filter() keeps only doctors where name or specialization matches
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar component — reused from components/ */}
      <Navbar />

      {/* Page content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Find a Doctor
          </h1>
          <p className="text-gray-500">
            Browse our specialists and book your appointment
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* CONDITIONAL RENDERING — show different UI based on state */}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500 text-lg">Loading doctors...</div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Success state — show doctors grid */}
        {!loading && !error && (
          <>
            {/* Results count */}
            <p className="text-gray-500 text-sm mb-6">
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
            </p>

            {/* If no results from search */}
            {filteredDoctors.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                No doctors found for &quot;{search}&quot;
              </div>
            )}

            {/* Doctors grid — map through array, render one card per doctor */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                // key prop is required when rendering lists
                // React uses it to track which item is which
                <DoctorCard
                  key={doctor._id}
                  id={doctor._id}
                  name={doctor.name}
                  specialization={doctor.specialization}
                  experience={doctor.experience}
                  fees={doctor.fees}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
