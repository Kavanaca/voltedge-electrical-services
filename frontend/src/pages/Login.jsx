import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import {
  Zap, Mail, Lock, Eye, EyeOff, Home, ShieldCheck, FileText, HardHat, Receipt, LogIn,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: FileText, text: 'Enquiries and quotations in one place' },
  { icon: HardHat, text: 'Projects, tasks and employees' },
  { icon: Receipt, text: 'Invoices, payments and documents' },
]

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Already signed in: do not show the login form again
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/'} replace />
  }

  const askBrowserToSave = (name) => {
    try {
      if (window.PasswordCredential && navigator.credentials) {
        const cred = new window.PasswordCredential({ id: email, password, name })
        navigator.credentials.store(cred).catch(() => {})
      }
    } catch {
      // The browser does not support it, nothing else to do.
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await login(email, password)
      askBrowserToSave(u.name)
      navigate(u.role === 'ADMIN' ? '/admin' : '/', { replace: true })
    } catch (err) {
      const status = err.response?.status
      if (status === 401) setError('Invalid email or password')
      else if (status === 429) setError('Too many attempts. Please wait 15 minutes and try again.')
      else setError('Could not connect to the server')
      setLoading(false)
    }
  }

  const input =
    'w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300'

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-950">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-950/85 to-blue-900/70" />
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
        <div className="text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-500 p-2.5 shadow-lg shadow-orange-500/30">
              <Zap size={26} />
            </div>
            <span className="font-heading text-xl font-bold uppercase tracking-wide">
              Raja Electrical Works
            </span>
          </div>

          <h2 className="mt-8 font-heading text-4xl font-extrabold leading-tight md:text-5xl">
            Run your business <span className="text-orange-400">from one dashboard</span>
          </h2>
          <p className="mt-4 max-w-md text-blue-100">
            Sign in to manage customers, work and payments.
          </p>

          <ul className="mt-8 hidden space-y-3 lg:block">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-blue-50">
                <span className="rounded-lg bg-white/10 p-2 text-orange-300 backdrop-blur">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <p className="mt-10 hidden items-center gap-2 text-sm text-blue-200 lg:flex">
            <ShieldCheck size={16} className="text-orange-400" /> Authorised staff access only
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-400 to-amber-300 opacity-60 blur-lg" />
          <div className="relative rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30">
              <LogIn size={26} />
            </div>

            <h1 className="mt-5 font-heading text-3xl font-bold text-blue-950">Welcome</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to open your dashboard.</p>

            {error && (
              <p className="mt-5 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <form id="login-form" method="post" onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="username" className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative mt-1">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="username" name="username" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username" className={input}
                    placeholder="you@example.com" required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="current-password" className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative mt-1">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="current-password" name="password" type={show ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password" className={`${input} pr-11`}
                    placeholder="Your password" required
                  />
                  <button
                    type="button" onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-md border border-orange-400 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
              >
                <Home size={16} /> Go to Home page
              </Link>
              <p className="mt-4 text-xs text-slate-500">
                Need an account? Ask an existing admin to add you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}