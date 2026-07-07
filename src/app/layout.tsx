// This is a SERVER component by default (no "use client" needed here)
// It wraps every single page in your app

// Metadata is for SEO — sets the browser tab title and description
import type { Metadata } from "next"
import "./globals.css"

// export metadata — Next.js reads this and puts it in <head> tag
export const metadata: Metadata = {
  title: "Hospital Booking",
  description: "Book doctor appointments online",
}

// RootLayout receives {children} — this is whatever page is currently active
// Every page.tsx renders inside {children}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode   // TypeScript: children must be React elements
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* 
          children = the current page being visited
          If user is on /doctors → DoctorsPage renders here
          If user is on /login   → LoginPage renders here
        */}
        {children}
      </body>
    </html>
  )
}
