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

export default function DashboardPage() {
  const [user, setUser]               = useState<User | null>(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)

  const router = useRouter()

  useEffect(() => {
    // Read user from localStorage
    const stored = localStorage.getItem("user")
    const token  = localStorage.getItem("token")

    // If not logged in, redirect to login
    if (!stored || !token) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(stored)
    setUser(parsedUser)

    // Fetch appointments
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
          {
            headers: {
              // Send token in Authorization header
              "Authorization": `Bearer ${token}`,
            },
          }
        )

        if (res.ok) {
          const data = await res.json()
          setAppointments(data.appointments)
        }
      } catch {
        // silently fail — just show empty state
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [router])

  if (!user) return null  // don't render anything while redirecting

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Role: <span className="font-medium text-blue-600">{user.role}</span>
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link
            href="/doctors"
            className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors"
          >
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-bold text-lg">Find Doctors</h3>
            <p className="text-blue-200 text-sm mt-1">Browse all specialists</p>
          </Link>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-bold text-lg text-gray-800">My Appointments</h3>
            <p className="text-gray-500 text-sm mt-1">
              {loading ? "Loading..." : `${appointments.length} total`}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-2">👤</div>
            <h3 className="font-bold text-lg text-gray-800">My Profile</h3>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
        </div>

        {/* Appointments list */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Appointments
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
              <p className="text-gray-400 text-lg">No appointments yet</p>
              <Link
                href="/doctors"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Book Your First Appointment
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {appointments.map((apt: any) => (
                <div
                  key={apt._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {apt.doctorId?.name || "Doctor"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {apt.doctorId?.specialization} •{" "}
                      {new Date(apt.date).toLocaleDateString()} at {apt.slot}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${apt.status === "APPROVED"   ? "bg-green-100 text-green-700"  : ""}
                    ${apt.status === "PENDING"    ? "bg-yellow-100 text-yellow-700": ""}
                    ${apt.status === "COMPLETED"  ? "bg-blue-100 text-blue-700"    : ""}
                    ${apt.status === "CANCELLED"  ? "bg-red-100 text-red-700"      : ""}
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
