"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Navbar from "@/components/Navbar"
import DoctorCard from "@/components/DoctorCard"

interface Doctor {
  _id: string
  name: string
  specialization: string
  experience: number
  fees: number
}

export default function DoctorsPage() {
  const [doctors, setDoctors]       = useState<Doctor[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [search, setSearch]         = useState("")
  const [page, setPage]             = useState(1)
  const [hasMore, setHasMore]       = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const observerRef = useRef<HTMLDivElement>(null)

  const fetchDoctors = useCallback(async (pageNum: number, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const res = await fetch(
        `https://hospital-management-sys-at4k.onrender.com/api/doctors?page=${pageNum}&limit=6${search ? `&search=${search}` : ""}`
      )

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()

      if (reset) {
        setDoctors(data.doctors)
      } else {
        setDoctors((prev) => [...prev, ...data.doctors])
      }

      setHasMore(pageNum < data.pages)
    } catch {
      setError("Could not load doctors. Is the backend running?")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [search])

  // Initial load and search
  useEffect(() => {
    setPage(1)
    fetchDoctors(1, true)
  }, [fetchDoctors])

  // Infinite scroll — Intersection Observer
  useEffect(() => {
    if (!hasMore || loadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prev) => {
            const next = prev + 1
            fetchDoctors(next)
            return next
          })
        }
      },
      { threshold: 0.1 }
    )

    const el = observerRef.current
    if (el) observer.observe(el)

    return () => { if (el) observer.unobserve(el) }
  }, [hasMore, loadingMore, fetchDoctors])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a Doctor</h1>
          <p className="text-gray-500">Browse our specialists and book your appointment</p>
        </div>

        {/* Search */}
        <div className="mb-8 flex gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-blue-500 bg-white shadow-sm"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-400">Loading doctors...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && !error && (
          <>
            {doctors.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-400 text-lg">No doctors found</p>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-6">
                  {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
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

                {/* Infinite scroll trigger */}
                {hasMore && (
                  <div ref={observerRef} className="flex justify-center py-8">
                    {loadingMore && (
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
