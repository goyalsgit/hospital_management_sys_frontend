"use client"
// "use client" required — we use useState, useEffect, event handlers

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {

  // ── STATE ──────────────────────────────────────────
  // formData holds both email and password in one object
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // useRouter — used to redirect after login
  const router = useRouter()

  // ── HANDLERS ───────────────────────────────────────

  // Single handler for ALL inputs
  // e.target.name  = the name attribute of the input ("email" or "password")
  // e.target.value = what the user typed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,                    // keep existing values
      [e.target.name]: e.target.value // update only the changed field
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()  // REQUIRED — stops page refresh

    // Basic validation before calling API
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError(null)   // clear previous errors

      // Call our backend API
      const res = await fetch(
        `https://hospital-management-sys-at4k.onrender.com/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",  // tells server we're sending JSON
          },
          body: JSON.stringify(formData),  // converts JS object to JSON string
        }
      )

      // Parse JSON response
      const data = await res.json()

      // res.ok = true if status is 200-299
      // res.ok = false if status is 400, 401, 500 etc
      if (!res.ok) {
        setError(data.message || "Login failed")
        return
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token)

      // Save user info too (useful for showing name in navbar etc)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirect to home page after login
      router.push("/")

    } catch (err) {
      // This runs if fetch itself fails (network error, server down)
      setError("Cannot connect to server. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  // ── RENDER ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      {/* Card container */}
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏥</div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Login to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"               // matches formData key
              value={formData.email}     // controlled input
              onChange={handleChange}    // updates state on every keystroke
              placeholder="john@gmail.com"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}
