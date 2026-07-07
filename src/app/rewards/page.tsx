"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

interface CoinsData {
  coins: number
  name: string
  reviewsWritten: number
  coinsPerReview: number
  redemptionOptions: { name: string; cost: number }[]
}

export default function RewardsPage() {
  const [data, setData]       = useState<CoinsData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }

    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://hospital-management-sys-at4k.onrender.com/api/reviews/my-coins",
          { headers: { "Authorization": `Bearer ${token}` } }
        )
        if (res.ok) {
          const d = await res.json()
          setData(d)
        }
      } catch { /* */ } finally { setLoading(false) }
    }
    fetchCoins()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">🪙 Rewards & Coins</h1>
          <p className="text-gray-500 mt-2">Earn coins by writing reviews. Redeem for discounts.</p>
        </div>

        {/* Coins Balance Card */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-3xl p-8 md:p-12 text-center mb-10 shadow-xl shadow-yellow-200/50">
          <p className="text-white/80 text-sm font-medium mb-2">Your Balance</p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">🪙</span>
            <span className="text-6xl md:text-7xl font-black text-white">
              {data?.coins || 0}
            </span>
          </div>
          <p className="text-white/80 font-medium">
            {data?.reviewsWritten || 0} reviews written • {data?.coinsPerReview || 10} coins per review
          </p>
        </div>

        {/* How to Earn */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">How to Earn Coins</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-bold text-gray-800 mb-1">Write Review</h3>
              <p className="text-sm text-gray-500 mb-2">Review a doctor you visited</p>
              <span className="inline-block bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-bold">
                +10 coins
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold text-gray-800 mb-1">First Review Bonus</h3>
              <p className="text-sm text-gray-500 mb-2">Extra coins on your first review</p>
              <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-bold">
                +20 coins
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-bold text-gray-800 mb-1">Book Appointment</h3>
              <p className="text-sm text-gray-500 mb-2">Earn coins every time you book</p>
              <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-bold">
                +5 coins
              </span>
            </div>
          </div>
        </div>

        {/* Redeem Options */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-5">Redeem Coins</h2>
          <div className="space-y-4">
            {data?.redemptionOptions?.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
                    🎁
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{option.name}</p>
                    <p className="text-sm text-gray-400">{option.cost} coins required</p>
                  </div>
                </div>
                <button
                  disabled={(data?.coins || 0) < option.cost}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    (data?.coins || 0) >= option.cost
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {(data?.coins || 0) >= option.cost ? "Redeem" : "Not enough"}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
