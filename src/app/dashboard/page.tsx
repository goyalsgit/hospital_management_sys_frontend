"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Appointment {
  _id: string
  doctorId?: { name: string; specialization: string }
  date: string
  slot: string
  status: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [coins, setCoins] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!stored || !token) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(stored))

    const fetchData = async () => {
      try {
        const [aptRes, coinRes] = await Promise.all([
          fetch("https://hospital-management-sys-at4k.onrender.com/api/appointments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://hospital-management-sys-at4k.onrender.com/api/reviews/my-coins", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (aptRes.ok) {
          const data = await aptRes.json()
          setAppointments(data.appointments)
        }
        if (coinRes.ok) {
          const data = await coinRes.json()
          setCoins(data.coins)
        }
      } catch {
        /* silently fail */
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (!user) return null

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-10 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Welcome back,</p>
              <h1 className="text-3xl md:text-4xl font-bold mt-1">{user.name} 👋</h1>
              <span className="inline-block bg-white/20 backdrop-blur-sm text-sm px-3 py-1 rounded-full mt-3">
                {user.role}
              </span>
            </div>
            <Link
              href="/rewards"
              className="hidden md:flex flex-col items-center bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-white/25 transition-colors"
            >
              <span className="text-3xl">🪙</span>
              <span className="text-2xl font-bold mt-1">{coins}</span>
              <span className="text-xs text-blue-100">coins</span>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total", value: stats.total, icon: "📅", color: "from-blue-400 to-blue-600" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "from-amber-400 to-orange-500" },
            { label: "Completed", value: stats.completed, icon: "✅", color: "from-green-400 to-emerald-600" },
            { label: "Coins", value: coins, icon: "🪙", color: "from-yellow-400 to-amber-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link href="/doctors" className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-lg">Find Doctors</h3>
            <p className="text-blue-100 text-sm mt-1">Browse all specialists</p>
          </Link>
          <Link href="/cart" className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="font-bold text-lg">My Cart</h3>
            <p className="text-green-100 text-sm mt-1">Review pending bookings</p>
          </Link>
          <Link href="/rewards" className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="text-3xl mb-3">🪙</div>
            <h3 className="font-bold text-lg">Rewards</h3>
            <p className="text-orange-100 text-sm mt-1">{coins} coins available</p>
          </Link>
        </div>

        {/* Appointments */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-7 bg-blue-600 rounded-full" />
            <h2 className="text-xl font-bold text-gray-800">Recent Appointments</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400 text-lg mb-4">No appointments yet</p>
              <Link href="/doctors" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Book Your First Appointment
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {appointments.map((apt) => (
                <div key={apt._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {apt.doctorId?.name?.charAt(0) || "D"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{apt.doctorId?.name || "Doctor"}</p>
                      <p className="text-gray-500 text-sm">
                        {apt.doctorId?.specialization} • {new Date(apt.date).toLocaleDateString()} at {apt.slot}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${apt.status === "APPROVED" ? "bg-green-100 text-green-700" : ""}
                    ${apt.status === "PENDING" ? "bg-amber-100 text-amber-700" : ""}
                    ${apt.status === "COMPLETED" ? "bg-blue-100 text-blue-700" : ""}
                    ${apt.status === "CANCELLED" ? "bg-red-100 text-red-700" : ""}
                  `}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
