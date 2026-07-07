"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { getTopInterests, getPersonalizationLevel, trackNewsClick } from "@/lib/recommendations"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  source: { name: string }
  publishedAt: string
}

export default function HomePage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [personLevel, setPersonLevel] = useState<string>("new")
  const [topInterests, setTopInterests] = useState<string[]>([])

  useEffect(() => {
    // Get personalization level
    setPersonLevel(getPersonalizationLevel())
    setTopInterests(getTopInterests(3))

    const fetchNews = async () => {
      try {
        // Use different categories based on user interests
        const interests = getTopInterests(1)
        const category = interests.length > 0
          ? mapInterestToCategory(interests[0])
          : "health"

        const res = await fetch(
          `https://saurav.tech/NewsAPI/top-headlines/category/${category}/in.json`
        )
        const data = await res.json()
        setNews(data.articles?.slice(0, 6) || [])
      } catch {
        // fallback to health news
        try {
          const res = await fetch(
            "https://saurav.tech/NewsAPI/top-headlines/category/health/in.json"
          )
          const data = await res.json()
          setNews(data.articles?.slice(0, 6) || [])
        } catch { /* silently fail */ }
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [])

  const handleNewsClick = (article: NewsArticle) => {
    // Track what the user clicks for future personalization
    trackNewsClick("General Medicine")
    window.open(article.url, "_blank")
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-[10%] w-96 h-96 bg-blue-400 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-indigo-400 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[40%] left-[50%] w-64 h-64 bg-purple-400 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Available 24/7 • Trusted by 10,000+ patients</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Healthcare<br />
              <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-blue-100/80 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Connect with top specialists, book appointments instantly, and take control of your health journey.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/doctors"
                className="group bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/30 flex items-center gap-2"
              >
                Find Doctors
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/register"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Floating stats cards */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "50+", label: "Specialists", icon: "👨‍⚕️" },
              { value: "10K+", label: "Appointments", icon: "📅" },
              { value: "4.9★", label: "Rating", icon: "⭐" },
              { value: "24/7", label: "Available", icon: "🕐" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center hover:bg-white/20 transition-all"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-blue-200/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl font-bold text-gray-800 mt-3">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto">Book your appointment in 3 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "🔍", title: "Search Doctor", desc: "Browse specialists by category, experience, or fees", color: "blue" },
              { step: "02", icon: "📅", title: "Add to Cart", desc: "Pick dates and time slots, add multiple appointments", color: "green" },
              { step: "03", icon: "✅", title: "Book & Confirm", desc: "Confirm all appointments at once from your cart", color: "purple" },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-3xl border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all group bg-white"
              >
                <span className="absolute top-6 right-6 text-6xl font-black text-gray-50 group-hover:text-blue-50 transition-colors">
                  {item.step}
                </span>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 bg-${item.color}-100 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PERSONALIZED NEWS ═══════ */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  {personLevel === "personalized" ? "For You" : "Health News"}
                </h2>
                {personLevel === "personalized" && (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                    ✨ Personalized
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                {personLevel === "new"
                  ? "Latest health news — read articles to get personalized recommendations"
                  : personLevel === "learning"
                  ? `Learning your interests... (${topInterests.join(", ")})`
                  : `Based on your interest in ${topInterests.join(", ")}`
                }
              </p>
            </div>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, index) => (
                <button
                  key={index}
                  onClick={() => handleNewsClick(article)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-blue-50 transition-all text-left group"
                >
                  {article.urlToImage ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                      <span className="text-5xl opacity-50">📰</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-medium">
                        {article.source?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-relaxed group-hover:text-blue-700 transition-colors">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-gray-400 text-xs mt-2 line-clamp-2">{article.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-[2rem] p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Ready to take control<br />of your health?
              </h2>
              <p className="text-blue-100/80 mb-10 max-w-md mx-auto text-lg">
                Join thousands of patients who trust MediBook for their healthcare needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/doctors"
                  className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all shadow-xl"
                >
                  Get Started Free →
                </Link>
                <Link
                  href="/register-doctor"
                  className="border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all"
                >
                  Join as Doctor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏥</span>
                <span className="text-white font-bold text-lg">MediBook</span>
              </div>
              <p className="text-sm leading-relaxed">
                Your trusted healthcare partner. Book appointments with top doctors instantly.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/doctors" className="hover:text-white transition-colors">Find Doctors</Link>
                <Link href="/register" className="hover:text-white transition-colors">Patient Register</Link>
                <Link href="/register-doctor" className="hover:text-white transition-colors">Doctor Register</Link>
                <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Specializations</h4>
              <div className="flex flex-col gap-3 text-sm">
                <span>Cardiology</span>
                <span>Neurology</span>
                <span>Pediatrics</span>
                <span>Orthopedics</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="flex flex-col gap-3 text-sm">
                <span>📧 support@medibook.com</span>
                <span>📞 +91 9999 999 999</span>
                <span>📍 Jaipur, India</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 MediBook. Built by Devansh Goyal.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Helper: map user interest to news category
function mapInterestToCategory(interest: string): string {
  const map: Record<string, string> = {
    "Cardiology": "health",
    "Neurology": "science",
    "Pediatrics": "health",
    "Psychiatry": "health",
    "General Medicine": "health",
    "Dermatology": "health",
    "Orthopedics": "sports",
  }
  return map[interest] || "health"
}
