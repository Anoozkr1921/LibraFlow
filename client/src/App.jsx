import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import AuthModal from './components/AuthModal'
import Overview from './views/Overview'
import Catalog from './views/Catalog'
import Loans from './views/Loans'
import Assistant from './views/Assistant'
import Admin from './views/Admin'
import VerificationNotice from './components/VerificationNotice'
import SiteFooter from './components/SiteFooter'

const viewPaths = {
  overview: '/',
  catalog: '/catalog',
  loans: '/loans',
  assistant: '/assistant',
  admin: '/admin',
}

const pathViews = Object.fromEntries(Object.entries(viewPaths).map(([view, path]) => [path, view]))

const viewFromLocation = () => pathViews[window.location.pathname] || 'overview'

function Workspace() {
  const { user, loading, login, register, logout } = useAuth()
  const [active, setActive] = useState(viewFromLocation)
  const [authOpen, setAuthOpen] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('verified') !== 'success') return
    setEmailVerified(true)
    window.history.replaceState({}, document.title, window.location.pathname)
  }, [])
  useEffect(() => {
    const handlePopState = () => setActive(viewFromLocation())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  if (loading) return <div className="loading-screen">Opening your library…</div>
  const refresh = () => setRefreshKey((key) => key + 1)
  const navigate = (view) => {
    const path = viewPaths[view] || viewPaths.overview
    if (window.location.pathname !== path) window.history.pushState({ view }, '', path)
    setActive(view)
  }
  const handleBorrowed = () => { refresh(); toast.success('Your reading record is up to date.') }
  const renderView = () => {
    if (active === 'catalog') return <Catalog user={user} onAuth={() => setAuthOpen(true)} onBorrowed={handleBorrowed} />
    if (active === 'loans') return user ? <Loans refreshKey={refreshKey} /> : <Overview user={user} onNavigate={() => setAuthOpen(true)} />
    if (active === 'assistant') return user ? <Assistant /> : <Overview user={user} onNavigate={() => setAuthOpen(true)} />
    if (active === 'admin' && user?.role === 'admin') return <Admin />
    return <Overview user={user} onNavigate={navigate} />
  }
  return <div className="app-shell"><Sidebar active={active} onNavigate={navigate} user={user} onLogout={logout} /><main className="main-content"><div className="mobile-top"><span className="brand-mark">L</span><strong>LibraFlow</strong>{active === 'overview' && !user && <button onClick={() => setAuthOpen(true)}>Sign in</button>}</div><div className="content-wrap">{renderView()}</div><SiteFooter onNavigate={navigate} /></main>{active === 'overview' && !user && <button className="signin-float" onClick={() => setAuthOpen(true)}>Sign in <span>→</span></button>}{emailVerified && <VerificationNotice onClose={() => setEmailVerified(false)} />}{authOpen && <AuthModal onLogin={async (payload) => { await login(payload); setAuthOpen(false); toast.success('Welcome back.') }} onRegister={register} onClose={() => setAuthOpen(false)} />}<Toaster position="bottom-right" toastOptions={{ style: { borderRadius: 4, background: '#17221f', color: '#f9f7f1' } }} /></div>
}

export default function App() { return <AuthProvider><Workspace /></AuthProvider> }
