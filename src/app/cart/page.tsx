"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Link from "next/link"

interface CartItem {
  doctorId: string
  doctorName: string
  specialization: string
  date: string
  slot: string
  fees: number
  notes: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    const stored = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(stored)
  }, [router])

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const totalFees = cart.reduce((sum, item) => sum + item.fees, 0)

  const bookAll = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Book each appointment one by one
      for (const item of cart) {
        const res = await fetch(
          "https://hospital-management-sys-at4k.onrender.com/api/appointments",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              doctorId: item.doctorId,
              date: item.date,
              slot: item.slot,
              notes: item.notes,
            }),
          }
        )

        const data = await res.json()
        if (!res.ok) {
          setError(`Failed to book ${item.doctorName}: ${data.message}`)
          setLoading(false)
          return
        }
      }

      // Clear cart
      localStorage.setItem("cart", "[]")
      setCart([])
      window.dispatchEvent(new Event("cartUpdated"))
      setSuccess(true)
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch {
      setError("Could not connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart</h1>
        <p className="text-gray-500 mb-8">Review your appointments before booking</p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
            ✅ All appointments booked! Redirecting to dashboard...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {cart.length === 0 && !success ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/doctors"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700"
            >
              Browse Doctors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.doctorName}</p>
                    <p className="text-sm text-gray-500">
                      {item.specialization} • {new Date(item.date).toLocaleDateString()} at {item.slot}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-gray-400 mt-1">Notes: {item.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-green-600">₹{item.fees}</span>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total ({cart.length} appointment{cart.length > 1 ? "s" : ""})</span>
                <span className="text-2xl font-bold text-gray-800">₹{totalFees}</span>
              </div>
              <button
                onClick={bookAll}
                disabled={loading || cart.length === 0}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Booking all..." : `Book All Appointments — ₹${totalFees}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
