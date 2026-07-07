// Simple Recommendation Engine
// Tracks user interests and personalizes content

// Interest categories mapped to news search terms
const INTEREST_MAP: Record<string, string[]> = {
  "Cardiology": ["heart health", "cardiac", "blood pressure"],
  "Neurology": ["brain health", "neurological", "mental health"],
  "Pediatrics": ["child health", "pediatric", "infant care"],
  "Orthopedics": ["bone health", "joint pain", "orthopedic"],
  "Dermatology": ["skin care", "dermatology", "skin health"],
  "Psychiatry": ["mental health", "depression", "anxiety"],
  "Gynecology": ["women health", "pregnancy", "maternal"],
  "Ophthalmology": ["eye health", "vision", "eye care"],
  "General Medicine": ["health tips", "wellness", "immunity"],
  "Dentistry": ["dental health", "oral care", "teeth"],
}

// Track a user action (click, view, book)
export function trackInterest(category: string, weight: number = 1) {
  if (typeof window === "undefined") return

  const interests = JSON.parse(localStorage.getItem("userInterests") || "{}")

  // Increment the score for this category
  interests[category] = (interests[category] || 0) + weight

  localStorage.setItem("userInterests", JSON.stringify(interests))
}

// Track news click
export function trackNewsClick(topic: string) {
  trackInterest(topic, 2) // news clicks have higher weight
}

// Track doctor view
export function trackDoctorView(specialization: string) {
  trackInterest(specialization, 1)
}

// Track appointment booking (strongest signal)
export function trackBooking(specialization: string) {
  trackInterest(specialization, 5)
}

// Get top interests sorted by score
export function getTopInterests(limit: number = 3): string[] {
  if (typeof window === "undefined") return []

  const interests = JSON.parse(localStorage.getItem("userInterests") || "{}")

  return Object.entries(interests)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, limit)
    .map(([key]) => key)
}

// Get recommended news categories based on interests
export function getRecommendedTopics(): string[] {
  const topInterests = getTopInterests(3)

  if (topInterests.length === 0) {
    return ["health"] // default for new users
  }

  const topics: string[] = []
  for (const interest of topInterests) {
    const mapped = INTEREST_MAP[interest]
    if (mapped) {
      topics.push(...mapped)
    } else {
      topics.push(interest.toLowerCase())
    }
  }

  return topics.slice(0, 5)
}

// Get personalization score (how much data we have)
export function getPersonalizationLevel(): "new" | "learning" | "personalized" {
  if (typeof window === "undefined") return "new"

  const interests = JSON.parse(localStorage.getItem("userInterests") || "{}")
  const totalScore = Object.values(interests).reduce((sum: number, val) => sum + (val as number), 0)

  if (totalScore === 0) return "new"
  if (totalScore < 10) return "learning"
  return "personalized"
}
