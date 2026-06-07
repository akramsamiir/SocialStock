import { useState, useEffect } from "react"

interface AuthState {
  token: string | null
  userName: string | null
  isLoggedIn: boolean
}

/**
 * Reads auth state from localStorage and stays in sync with changes
 * made in other tabs (storage event) or within the same tab (custom event).
 */
export function useAuth(): AuthState {
  const read = (): AuthState => {
    const token = localStorage.getItem("token")
    const userName = localStorage.getItem("userName")
    return { token, userName, isLoggedIn: token !== null }
  }

  const [state, setState] = useState<AuthState>(read)

  useEffect(() => {
    const sync = () => setState(read())
    // Cross-tab sync
    window.addEventListener("storage", sync)
    // Same-tab sync (dispatched by login/logout)
    window.addEventListener("auth-change", sync)
    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener("auth-change", sync)
    }
  }, [])

  return state
}
