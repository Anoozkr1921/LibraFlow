import { useState } from 'react'

export default function AuthModal({ onLogin, onRegister, onClose }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const switchMode = (nextMode) => { setMode(nextMode); setError(''); setNotice('') }
  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.')
          return
        }
        await onRegister(form)
        setMode('login')
        setForm({ ...form, password: '', confirmPassword: '' })
        setNotice('Account created. Verify your email, then sign in to borrow books.')
      } else {
        await onLogin({ email: form.email, password: form.password })
      }
    } catch (err) {
      setError(err.response?.data?.message || err.userMessage || (mode === 'register' ? 'Unable to create your account.' : 'Unable to sign in. Check your details.'))
    } finally { setBusy(false) }
  }
  const registering = mode === 'register'
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="auth-modal" onSubmit={submit}><button className="modal-close" type="button" onClick={onClose}>×</button><span className="eyebrow">{registering ? 'New member' : 'Welcome back'}</span><h2>{registering ? 'Make room for more stories.' : 'Return to your shelf.'}</h2><p>{registering ? 'Create an account, verify your email, then start borrowing.' : 'Sign in to borrow books, track due dates, and ask the library assistant.'}</p>{error && <div className="form-error">{error}</div>}{notice && <div className="form-notice">{notice}</div>}{registering && <label>Name<input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}<label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} minLength={registering ? 8 : undefined} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>{registering && <small>Use at least 8 characters.</small>}</label>{registering && <label>Confirm password<div className="password-field"><input type={showConfirmPassword ? 'text' : 'password'} minLength={8} required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /><button className="password-toggle" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? 'Hide' : 'Show'}</button></div></label>}<button className={`primary-button full${registering ? ' register-button' : ''}`} disabled={busy}>{busy ? (registering ? 'Creating account…' : 'Signing in…') : (registering ? 'Create account' : 'Sign in')}</button><button className="auth-switch" type="button" onClick={() => switchMode(registering ? 'login' : 'register')}>{registering ? 'Already have an account? Sign in' : 'New here? Create an account'}</button></form></div>
}
