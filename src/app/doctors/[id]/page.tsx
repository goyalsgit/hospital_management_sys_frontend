"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Link from "next/link"

// TypeScript interfaces — shape of data from backend
interface Doctor {
  _id: string
  name: string
  specialization: string
  experience: number
  fees: number
  bio: string
  availableSlots: string[]
  isAvailable: boolean
}

interface BookingForm {
  date: string
  slot: string
  notes: string
}

// In Next.js 16+, params is a Promise — must be unwrapped with React.use()
export default function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // React.use() unwraps the Promise synchronously inside a component
  const { id } = use(params)

  // ── STATE ──────────────────────────────────────────
  const [doctor, setDoctor]   = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  // Booking form state
  const [booking, setBooking] = useState<BookingForm>({
    date: "",
    slot: "",
    notes: "",
  })

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError]     = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const router = useRouter()

  // ── FETCH DOCTOR ───────────────────────────────────

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${id}`
        )

        if (!res.ok) {
          setError("Doctor not found")
          return
        }

        const data = await res.json()
        setDoctor(data.doctor)
      } catch {
        setError("Failed to load doctor details")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [id]) // re-runs if id changes

  // ── BOOKING HANDLER ────────────────────────────────

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is logged in
    const token = localStorage.getItem("token")
    const user  = localStorage.getItem("user")

    if (!token || !user) {
      // Not logged in — redirect to login
      router.push("/login")
      return
    }

    // Check role — only PATIENT can book
    const parsedUser = JSON.parse(user)
    if (parsedUser.role !== "PATIENT") {
      setBookingError("Only patients can book appointments")
      return
    }

    if (!booking.date || !booking.slot) {
      setBookingError("Please select a date and time slot")
      return
    }

    try {
      setBookingLoading(true)
      setBookingError(null)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: id,
            date: booking.date,
            slot: booking.slot,
            notes: booking.notes,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setBookingError(data.message || "Booking failed")
        return
      }

      setBookingSuccess(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => router.push("/dashboard"), 2000)

    } catch {
      setBookingError("Cannot connect to server")
    } finally {
      setBookingLoading(false)
    }
  }

  // ── RENDER ─────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading doctor details...</p>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-red-500">{error || "Doctor not found"}</p>
          <Link href="/doctors" className="text-blue-600 hover:underline">
            ← Back to Doctors
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back link */}
        <Link
          href="/doctors"
          className="text-blue-600 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Doctors
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── LEFT: Doctor Info ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">

            {/* Avatar */}
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">👨‍⚕️</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {doctor.name}
            </h1>

            {/* Specialization badge */}
            <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-6">
              {doctor.specialization}
            </span>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{doctor.experience}</p>
                <p className="text-gray-500 text-sm">Years Experience</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-600">₹{doctor.fees}</p>
                <p className="text-gray-500 text-sm">Consultation Fee</p>
              </div>
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">About</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            {/* Availability */}
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${doctor.isAvailable ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-gray-600">
                {doctor.isAvailable ? "Available for booking" : "Not available"}
              </span>
            </div>
          </div>

          {/* ── RIGHT: Booking Form ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Book Appointment
            </h2>

            {/* Success message */}
            {bookingSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                ✅ Appointment booked! Redirecting to dashboard...
              </div>
            )}

            {/* Error message */}
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                {bookingError}
              </div>
            )}

            {!bookingSuccess && (
              <form onSubmit={handleBook} className="flex flex-col gap-5">

                {/* Date picker */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={booking.date}
                    // min = today's date in YYYY-MM-DD format
                    // prevents booking in the past
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Time slot selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Select Time Slot
                  </label>

                  {doctor.availableSlots.length === 0 ? (
                    <p className="text-gray-400 text-sm">No slots available</p>
                  ) : (
                    // Slot grid — clickable buttons
                    <div className="grid grid-cols-3 gap-2">
                      {doctor.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"   // type="button" prevents form submit
                          onClick={() => setBooking({ ...booking, slot })}
                          className={`
                            py-2 px-3 rounded-lg text-sm font-medium border transition-colors
                            ${booking.slot === slot
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                            }
                          `}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Notes (optional)
                  </label>
                  <textarea
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    placeholder="Describe your symptoms or reason for visit..."
                    rows={3}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Fee summary */}
                <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Consultation Fee</span>
                  <span className="font-bold text-green-600 text-lg">₹{doctor.fees}</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={bookingLoading || !doctor.isAvailable}
                  className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {bookingLoading ? "Booking..." : "Confirm Appointment"}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By booking you agree to our cancellation policy
                </p>

              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
