"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DoctorRegisterPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    experience: "",
    fees: "",
    bio: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password ||
        !formData.specialization || !formData.experience || !formData.fees) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register-doctor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            experience: Number(formData.experience),
            fees: Number(formData.fees),
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Registration failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setSuccess(true)
      setTimeout(() => router.push("/dashboard"), 1500)

    } catch {
      setError("Cannot connect to server. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  // List of common specializations
  const specializations = [
    "Cardiology", "Neurology", "Pediatrics", "Orthopedics",
    "Dermatology", "Psychiatry", "Gynecology", "Ophthalmology",
    "ENT", "General Medicine", "Dentistry", "Radiology",
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👨‍⚕️</div>
          <h1 className="text-3xl font-bold text-gray-800">Join as a Doctor</h1>
          <p className="text-gray-500 mt-2">Create your professional profile</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 text-sm">
              ✅ Account created! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── ACCOUNT SECTION ── */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
                Account Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} placeholder="Dr. John Smith"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel" name="phone" value={formData.phone}
                    onChange={handleChange} placeholder="9999999999"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="doctor@hospital.com"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password" name="password" value={formData.password}
                    onChange={handleChange} placeholder="Min 6 characters"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            </div>

            {/* ── PROFESSIONAL SECTION ── */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
                Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  {/* Using select dropdown for specializations */}
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">Select specialization</option>
                    {specializations.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Experience (years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" name="experience" value={formData.experience}
                    onChange={handleChange} placeholder="5" min="0" max="60"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Consultation Fees (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" name="fees" value={formData.fees}
                    onChange={handleChange} placeholder="500" min="0"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1 mt-4">
                <label className="text-sm font-medium text-gray-700">
                  About You
                </label>
                <textarea
                  name="bio" value={formData.bio}
                  onChange={handleChange}
                  placeholder="Briefly describe your expertise and approach to patient care..."
                  rows={3}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Default slots notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              📅 Default time slots will be assigned: 9:00, 10:00, 11:00, 14:00, 15:00.
              You can update them from your dashboard.
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Register as Doctor"}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
            <p>
              Patient?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Register here
              </Link>
            </p>
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
