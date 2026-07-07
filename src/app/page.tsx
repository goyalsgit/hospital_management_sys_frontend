"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "https://saurav.tech/NewsAPI/top-headlines/category/health/in.json"
        )
        const data = await res.json()
        setNews(data.articles?.slice(0, 6) || [])
      } catch {
        // silently fail
      }
    }
    fetchNews()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section — Modern gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-sm px-4 py-1.5 rounded-full mb-6">
              ✨ Trusted by 10,000+ patients
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your Health,<br />Our Priority
            </h1>
            <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              Book appointments with top specialists. Get prescriptions, track your health — all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/doctors"
                className="bg-white text-blue-700 px-8 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20"
              >
                Find Doctors →
              </Link>
              <Link
                href="/register"
                className="border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Join Free
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-blue-200 text-sm">Specialists</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-blue-200 text-sm">Appointments</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.9⭐</p>
              <p className="text-blue-200 text-sm">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              Book your appointment in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
              <div className="w-16 h-16 mx-auto mb-5 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🔍
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Search Doctor</h3>
              <p className="text-gray-500 text-sm">Browse specialists by category, experience, or rating</p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-green-100/50 transition-all group">
              <div className="w-16 h-16 mx-auto mb-5 bg-green-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Book Slot</h3>
              <p className="text-gray-500 text-sm">Pick a date and time that works for you</p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all group">
              <div className="w-16 h-16 mx-auto mb-5 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                ✅
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Get Confirmation</h3>
              <p className="text-gray-500 text-sm">Receive instant booking confirmation and reminders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Health News Section */}
      {news.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Health News</h2>
                <p className="text-gray-500 mt-1">Stay updated with latest health trends</p>
              </div>
              <span className="text-sm text-gray-400">Powered by NewsAPI</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
                >
                  {article.urlToImage && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {article.source?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-relaxed">
                      {article.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 md:p-16 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to book your appointment?
          </h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Join thousands of patients who trust us for their healthcare needs.
          </p>
          <Link
            href="/doctors"
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">🏥 Hospital Booking</h3>
            <p className="text-sm">Your trusted healthcare partner since 2024.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/doctors" className="hover:text-white transition-colors">Find Doctors</Link>
              <Link href="/register" className="hover:text-white transition-colors">Register</Link>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Specializations</h4>
            <div className="flex flex-col gap-2 text-sm">
              <span>Cardiology</span>
              <span>Neurology</span>
              <span>Pediatrics</span>
              <span>Orthopedics</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="flex flex-col gap-2 text-sm">
              <span>support@hospital.com</span>
              <span>+91 9999 999 999</span>
              <span>Jaipur, India</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-sm">
          © 2024 Hospital Booking System. Built for learning.
        </div>
      </footer>
    </div>
  )
}
