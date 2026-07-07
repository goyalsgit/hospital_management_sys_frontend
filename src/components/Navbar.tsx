"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }

    // Read cart count
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)

    // Listen for cart updates
    const handleStorage = () => {
      const c = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(c.length)
    }
    window.addEventListener("storage", handleStorage)
    window.addEventListener("cartUpdated", handleStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("cartUpdated", handleStorage)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    setUser(null)
    setCartCount(0)
    router.push("/")
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="font-bold text-lg text-gray-800">MediBook</span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
            Home
          </Link>
          <Link href="/doctors" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
            Doctors
          </Link>
          {user && (
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Cart icon */}
          {user && (
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800 leading-tight">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
