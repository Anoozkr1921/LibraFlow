import { useState } from 'react'

export default function AuthModal({ onLogin, onClose }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event) => { event.preventDefault(); setBusy(true); setError(''); try { await onLogin(form) } catch (err) { setError(err.response?.data?.message || err.userMessage || 'Unable to sign in. Check your details.') } finally { setBusy(false) } }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="auth-modal" onSubmit={submit}><button className="modal-close" type="button" onClick={onClose}>×</button><span className="eyebrow">Welcome back</span><h2>Return to your shelf.</h2><p>Sign in to borrow books, track due dates, and ask the library assistant.</p>{error && <div className="form-error">{error}</div>}<label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><button className="primary-button full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form></div>
}
