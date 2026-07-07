"use client"
// "use client" required because we use useState, useEffect, localStorage

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// TypeScript: shape of the user object we saved in localStorage
interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function Navbar() {

  // null = not logged in, User object = logged in
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter()

  // useEffect runs after component mounts (first render)
  // We read localStorage here because localStorage is browser-only
  // It doesn't exist on the server — Next.js renders on server first
  useEffect(() => {
    const stored = localStorage.getItem("user")

    // If user data exists in localStorage, parse and set it
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        // If stored value is corrupted JSON, clear it
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }
  }, []) // [] = run once when component mounts

  const handleLogout = () => {
    // Clear everything from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Reset state — this triggers re-render immediately
    setUser(null)

    // Redirect to home
    router.push("/")
  }

  return (
    <nav className="bg-blue-600 px-6 py-4 flex items-center justify-between">

      {/* Left: Brand */}
      <Link href="/" className="text-white text-xl font-bold">
        🏥 Hospital Booking
      </Link>

      {/* Right: Nav links */}
      <div className="flex items-center gap-6">

        <Link href="/" className="text-white hover:text-blue-200 transition-colors text-sm">
          Home
        </Link>
        <Link href="/doctors" className="text-white hover:text-blue-200 transition-colors text-sm">
          Doctors
        </Link>

        {/* Conditional rendering based on auth state */}
        {user ? (
          // LOGGED IN — show user name and logout button
          <div className="flex items-center gap-4">

            {/* User info */}
            <div className="flex items-center gap-2">
              {/* Avatar circle with first letter of name */}
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-white text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-blue-200 text-xs">{user.role}</p>
              </div>
            </div>

            {/* Dashboard link based on role */}
            <Link
              href="/dashboard"
              className="text-white hover:text-blue-200 transition-colors text-sm"
            >
              Dashboard
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Logout
            </button>

          </div>
        ) : (
          // NOT LOGGED IN — show login button
          <Link
            href="/login"
            className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Login
          </Link>
        )}

      </div>
    </nav>
  )
}
