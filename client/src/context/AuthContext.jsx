import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('libraflow_token')))

  useEffect(() => {
    if (!localStorage.getItem('libraflow_token')) return
    authApi.me().then(setUser).catch(() => localStorage.removeItem('libraflow_token')).finally(() => setLoading(false))
  }, [])

  const login = async (payload) => {
    const result = await authApi.login(payload)
    localStorage.setItem('libraflow_token', result.token)
    setUser(result.user)
    return result.user
  }

  const logout = async () => {
    try { await authApi.logout() } finally {
      localStorage.removeItem('libraflow_token')
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
