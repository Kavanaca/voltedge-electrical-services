import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'ADMIN' ? '/admin' : '/')
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Invalid email or password'
          : 'Could not connect to the server'
      )
    } finally {
      setLoading(false)
    }
  }

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Zap className="text-amber-500" /> VoltEdge Login
        </div>

        {error && <p className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} required />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} required />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-md"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link to="/" className="block mt-4 text-center text-sm text-slate-500 hover:text-amber-600">
          ← Back to website
        </Link>
      </div>
    </div>
  )
}