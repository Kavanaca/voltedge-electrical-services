import { useEffect, useState } from 'react'
import { UserPlus, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { apiError } from '../projects/format'
import { useAuth } from '../../context/AuthContext'

const empty = { fullName: '', email: '', password: '' }

export default function UsersPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () =>
    api.get('/api/admin/users')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load users.'))

  useEffect(() => { load() }, [])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      setSaving(true)
      await api.post('/api/admin/users', form)
      setForm(empty)
      setMessage('Admin account created. Share the password with them privately and ask them to keep it safe.')
      await load()
    } catch (err) {
      setError(apiError(err, 'Could not create the user.'))
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (u) => {
    setError('')
    setMessage('')
    try {
      await api.patch(`/api/admin/users/${u.id}/enabled`, { enabled: !u.enabled })
      await load()
    } catch (err) {
      setError(apiError(err, 'Could not update the user.'))
    }
  }

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.fullName} (${u.email})? This cannot be undone.`)) return
    setError('')
    setMessage('')
    try {
      await api.delete(`/api/admin/users/${u.id}`)
      setMessage('Admin deleted.')
      await load()
    } catch (err) {
      setError(apiError(err, 'Could not delete the user.'))
    }
  }

  const isMe = (u) => u.email.toLowerCase() === (user?.email || '').toLowerCase()

  const input = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-950">Users</h1>
        <div className="mt-2 h-1 w-12 rounded bg-orange-500" />
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</p>}

      <form onSubmit={submit} autoComplete="off" className="max-w-3xl rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-blue-950">Add a new admin</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div><label className="text-sm font-medium">Full name *</label>
            <input name="fullName" value={form.fullName} onChange={change} className={input} required /></div>
          <div><label className="text-sm font-medium">Email *</label>
            <input type="email" name="email" value={form.email} onChange={change}
              autoComplete="off" className={input} required /></div>
          <div><label className="text-sm font-medium">Password * (min 8)</label>
            <input type="password" name="password" value={form.password} onChange={change}
              className={input} minLength={8} required autoComplete="new-password" /></div>
        </div>
        <button type="submit" disabled={saving}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
          <UserPlus size={16} /> {saving ? 'Creating...' : 'Create admin'}
        </button>
        <p className="mt-3 text-xs text-slate-500">
          Admins can see all customer, financial and employee data. Only add people you trust.
        </p>
      </form>

      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-950 text-blue-100">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-orange-50/50">
                  <td className="px-4 py-3 font-medium text-blue-950">{u.fullName}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.enabled ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                      {u.enabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {isMe(u) ? (
                      <span className="text-xs font-semibold text-slate-400">You</span>
                    ) : (
                      <div className="flex items-center justify-end gap-4">
                        <button onClick={() => toggle(u)}
                          className={u.enabled ? 'text-amber-600 hover:underline' : 'text-green-700 hover:underline'}>
                          {u.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => remove(u)}
                          className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}