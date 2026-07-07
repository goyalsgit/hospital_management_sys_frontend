"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Link from "next/link"

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

export default function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [doctor, setDoctor]   = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const [booking, setBooking] = useState({ date: "", slot: "", notes: "" })
  const [addedToCart, setAddedToCart] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `https://hospital-management-sys-at4k.onrender.com/api/doctors/${id}`
        )
        if (!res.ok) { setError("Doctor not found"); return }
        const data = await res.json()
        setDoctor(data.doctor)
      } catch {
        setError("Failed to load doctor details")
      } finally {
        setLoading(false)
      }
    }
    fetchDoctor()
  }, [id])

  const handleAddToCart = () => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }

    if (!booking.date || !booking.slot) {
      setError("Please select a date and time slot")
      return
    }

    if (!doctor) return

    const cartItem = {
      doctorId: doctor._id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      date: booking.date,
      slot: booking.slot,
      fees: doctor.fees,
      notes: booking.notes,
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    cart.push(cartItem)
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    setAddedToCart(true)
    setError(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-red-500">{error || "Doctor not found"}</p>
          <Link href="/doctors" className="text-blue-600 hover:underline">← Back</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/doctors" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          ← Back to Doctors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Doctor Info — 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                {doctor.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
                <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mt-1">
                  {doctor.specialization}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{doctor.experience}</p>
                <p className="text-gray-500 text-xs">Years Exp</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-600">₹{doctor.fees}</p>
                <p className="text-gray-500 text-xs">Per Visit</p>
              </div>
            </div>

            {doctor.bio && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">About</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${doctor.isAvailable ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-gray-600">
                {doctor.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          {/* Booking Form — 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Book Appointment</h2>

            {addedToCart && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-sm">
                ✅ Added to cart!{" "}
                <Link href="/cart" className="underline font-medium">View Cart</Link>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={booking.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => { setBooking({ ...booking, date: e.target.value }); setAddedToCart(false) }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Slots */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {doctor.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => { setBooking({ ...booking, slot }); setAddedToCart(false) }}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all
                        ${booking.slot === slot
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Notes (optional)</label>
                <textarea
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  placeholder="Describe symptoms..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Fee */}
              <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                <span className="text-gray-500 text-sm">Fee</span>
                <span className="font-bold text-green-600">₹{doctor.fees}</span>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!doctor.isAvailable}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                🛒 Add to Cart
              </button>

              <Link
                href="/cart"
                className="block w-full text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Go to Cart →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
