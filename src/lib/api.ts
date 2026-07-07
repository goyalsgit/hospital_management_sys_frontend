// API helper — centralized fetch wrapper
// Instead of writing the full URL and headers every time,
// just call api.get("/doctors") or api.post("/auth/login", body)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Get token from localStorage (only works in browser)
function getToken(): string | null {
  if (typeof window === "undefined") return null // server-side safety
  return localStorage.getItem("token")
}

// Build headers
function buildHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

// API object with methods
export const api = {
  // GET request (no body)
  get: async (path: string, auth = false) => {
    const res = await fetch(`${BASE_URL}/api${path}`, {
      method: "GET",
      headers: buildHeaders(auth),
    })
    const data = await res.json()
    return { res, data, ok: res.ok }
  },

  // POST request (with body)
  post: async (path: string, body: object, auth = false) => {
    const res = await fetch(`${BASE_URL}/api${path}`, {
      method: "POST",
      headers: buildHeaders(auth),
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return { res, data, ok: res.ok }
  },

  // PATCH request (with body)
  patch: async (path: string, body: object, auth = false) => {
    const res = await fetch(`${BASE_URL}/api${path}`, {
      method: "PATCH",
      headers: buildHeaders(auth),
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return { res, data, ok: res.ok }
  },

  // DELETE request (no body)
  delete: async (path: string, auth = false) => {
    const res = await fetch(`${BASE_URL}/api${path}`, {
      method: "DELETE",
      headers: buildHeaders(auth),
    })
    const data = await res.json()
    return { res, data, ok: res.ok }
  },
}
