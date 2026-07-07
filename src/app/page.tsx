"use client"

import { useState, useEffect, useRef } from "react"
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
  const [personLevel, setPersonLevel] = useState<string>("new")
  const [topInterests, setTopInterests] = useState<string[]>([])
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPersonLevel(getPersonalizationLevel())
    setTopInterests(getTopInterests(3))

    const fetchNews = async () => {
      try {
        const interests = getTopInterests(1)
        const category = interests.length > 0 ? mapInterestToCategory(interests[0]) : "health"
        const res = await fetch(`https://saurav.tech/NewsAPI/top-headlines/category/${category}/in.json`)
        const data = await res.json()
        setNews(data.articles?.slice(0, 8) || [])
      } catch { /* */ }
    }
    fetchNews()
  }, [])

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const amount = direction === "left" ? -320 : 320
      carouselRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Your Health,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Simplified!
              </span>
            </h1>
            <p className="text-gray-500 mt-3 text-lg max-w-lg">
              Access to 850+ specialists. Book instantly, pay later.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 text-sm font-medium">Doctors Online Now</span>
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORY CARDS ═══════ */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: "Cardiology", icon: "❤️", color: "from-red-400 to-pink-500" },
            { name: "Neurology", icon: "🧠", color: "from-purple-400 to-indigo-500" },
            { name: "Pediatrics", icon: "👶", color: "from-blue-400 to-cyan-500" },
            { name: "Orthopedics", icon: "🦴", color: "from-amber-400 to-orange-500" },
            { name: "Dermatology", icon: "✨", color: "from-pink-400 to-rose-500" },
            { name: "Dentistry", icon: "🦷", color: "from-green-400 to-emerald-500" },
            { name: "Eye Care", icon: "👁️", color: "from-sky-400 to-blue-500" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/doctors?search=${cat.name}`}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURED CAROUSEL ═══════ */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-600 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-800">Featured</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel("left")}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
            >
              ←
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Card 1 */}
          <div className="flex-shrink-0 w-72 h-80 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white flex flex-col justify-between snap-start shadow-xl shadow-blue-200/50">
            <div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm">New</span>
              <h3 className="text-xl font-bold mt-4 leading-tight">Book Your<br />First Appointment</h3>
              <p className="text-blue-100 text-sm mt-2">Get 50 bonus coins on signup</p>
            </div>
            <Link href="/register" className="bg-white text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold w-fit hover:bg-blue-50 transition-colors">
              Register Now
            </Link>
          </div>

          {/* Card 2 */}
          <div className="flex-shrink-0 w-72 h-80 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 p-6 text-white flex flex-col justify-between snap-start shadow-xl shadow-green-200/50">
            <div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm">Popular</span>
              <h3 className="text-xl font-bold mt-4 leading-tight">50+ Specialists<br />Available 24/7</h3>
              <p className="text-green-100 text-sm mt-2">Consult from home or visit clinic</p>
            </div>
            <Link href="/doctors" className="bg-white text-teal-600 px-5 py-2.5 rounded-xl text-sm font-bold w-fit hover:bg-green-50 transition-colors">
              Find Doctors
            </Link>
          </div>

          {/* Card 3 */}
          <div className="flex-shrink-0 w-72 h-80 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white flex flex-col justify-between snap-start shadow-xl shadow-orange-200/50">
            <div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm">🪙 Rewards</span>
              <h3 className="text-xl font-bold mt-4 leading-tight">Earn Coins on<br />Every Review</h3>
              <p className="text-orange-100 text-sm mt-2">Write reviews → earn coins → get discounts</p>
            </div>
            <Link href="/rewards" className="bg-white text-orange-600 px-5 py-2.5 rounded-xl text-sm font-bold w-fit hover:bg-orange-50 transition-colors">
              View Rewards
            </Link>
          </div>

          {/* Card 4 */}
          <div className="flex-shrink-0 w-72 h-80 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white flex flex-col justify-between snap-start shadow-xl shadow-purple-200/50">
            <div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm">For Doctors</span>
              <h3 className="text-xl font-bold mt-4 leading-tight">Join as a<br />Doctor Today</h3>
              <p className="text-purple-100 text-sm mt-2">Build your practice, reach more patients</p>
            </div>
            <Link href="/register-doctor" className="bg-white text-purple-600 px-5 py-2.5 rounded-xl text-sm font-bold w-fit hover:bg-purple-50 transition-colors">
              Register as Doctor
            </Link>
          </div>

          {/* Card 5 */}
          <div className="flex-shrink-0 w-72 h-80 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 p-6 text-white flex flex-col justify-between snap-start shadow-xl shadow-cyan-200/50">
            <div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm">Smart</span>
              <h3 className="text-xl font-bold mt-4 leading-tight">Personalized<br />Health Feed</h3>
              <p className="text-blue-100 text-sm mt-2">News tailored to your health interests</p>
            </div>
            <Link href="#news" className="bg-white text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold w-fit hover:bg-blue-50 transition-colors">
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-green-500 rounded-full" />
          <h2 className="text-2xl font-bold text-gray-800">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { step: "1", title: "Search", desc: "Find doctors by specialization", icon: "🔍", bg: "bg-blue-50 border-blue-100" },
            { step: "2", title: "Add to Cart", desc: "Pick date & slot, add to cart", icon: "🛒", bg: "bg-green-50 border-green-100" },
            { step: "3", title: "Book & Pay", desc: "Confirm all appointments at once", icon: "💳", bg: "bg-purple-50 border-purple-100" },
            { step: "4", title: "Get Treated", desc: "Visit doctor, write review, earn coins", icon: "⭐", bg: "bg-amber-50 border-amber-100" },
          ].map((item) => (
            <div key={item.step} className={`${item.bg} border rounded-2xl p-6 relative overflow-hidden`}>
              <span className="absolute top-3 right-4 text-5xl font-black text-black/5">{item.step}</span>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ NEWS ═══════ */}
      <section id="news" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-purple-500 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {personLevel === "personalized" ? "For You" : "Health News"}
              </h2>
              <p className="text-gray-400 text-sm">
                {personLevel === "personalized"
                  ? `Based on: ${topInterests.join(", ")}`
                  : "Read articles to get personalized feed"
                }
              </p>
            </div>
          </div>
          {personLevel === "personalized" && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              ✨ Personalized
            </span>
          )}
        </div>

        {news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {news.map((article, i) => (
              <button
                key={i}
                onClick={() => { trackNewsClick("General Medicine"); window.open(article.url, "_blank") }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
              >
                <div className="h-40 overflow-hidden">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">📰</div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">{article.source?.name}</span>
                  <h3 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Ready to book?
            </h2>
            <p className="text-blue-100 mt-2">Get started in under 2 minutes. It&apos;s free.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/doctors" className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
              Find Doctors
            </Link>
            <Link href="/register" className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-gray-900 text-gray-400 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white font-bold text-xl mb-3">🏥 MediBook</h3>
            <p className="text-sm leading-relaxed">Your trusted healthcare partner. Book appointments with top doctors.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/doctors" className="hover:text-white transition-colors">Find Doctors</Link>
              <Link href="/rewards" className="hover:text-white transition-colors">Rewards</Link>
              <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Specializations</h4>
            <div className="flex flex-col gap-3 text-sm">
              <span>Cardiology</span>
              <span>Neurology</span>
              <span>Pediatrics</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm">
              <span>📧 support@medibook.com</span>
              <span>📞 +91 9999 999 999</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-6 text-center text-sm">
          <p>© 2024 MediBook. Built by Devansh Goyal.</p>
        </div>
      </footer>
    </div>
  )
}

function mapInterestToCategory(interest: string): string {
  const map: Record<string, string> = {
    "Cardiology": "health", "Neurology": "science", "Pediatrics": "health",
    "Psychiatry": "health", "General Medicine": "health",
  }
  return map[interest] || "health"
}
