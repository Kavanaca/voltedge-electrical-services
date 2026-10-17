import { useEffect, useState } from 'react'
import api from '../../services/api'
import { money } from '../quotations/format'
import { apiError } from '../projects/format'

const ROLES = ['ENGINEER', 'SUPERVISOR', 'ELECTRICIAN', 'LINEMAN', 'HELPER', 'TECHNICIAN', 'OTHER']
const empty = { fullName: '', phone: '', role: 'ELECTRICIAN', dailyWage: '', joinDate: '', active: true, notes: '' }

export default function EmployeesPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () =>
    api.get('/api/admin/employees')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load employees.'))

  useEffect(() => { load() }, [])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const startEdit = (emp) => {
    setEditingId(emp.id)
    setForm({
      fullName: emp.fullName, phone: emp.phone, role: emp.role,
      dailyWage: String(emp.dailyWage), joinDate: emp.joinDate || '',
      active: emp.active, notes: emp.notes || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => { setEditingId(null); setForm(empty) }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = { ...form, dailyWage: Number(form.dailyWage) || 0, joinDate: form.joinDate || null }
    try {
      setSaving(true)
      if (editingId) await api.put(`/api/admin/employees/${editingId}`, payload)
      else await api.post('/api/admin/employees', payload)
      reset()
      await load()
    } catch (err) {
      setError(apiError(err, 'Could not save the employee.'))
    } finally {
      setSaving(false)
    }
  }

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Employees and Labour</h1>
      {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}

      <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-3xl">
        <h2 className="font-semibold text-slate-900">{editingId ? 'Edit employee' : 'Add employee'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="text-sm font-medium">Full name *</label>
            <input name="fullName" value={form.fullName} onChange={change} className={input} required /></div>
          <div><label className="text-sm font-medium">Phone *</label>
            <input name="phone" value={form.phone} onChange={change} className={input} required /></div>
          <div><label className="text-sm font-medium">Role *</label>
            <select name="role" value={form.role} onChange={change} className={input}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select></div>
          <div><label className="text-sm font-medium">Daily wage (₹) *</label>
            <input type="number" min="0" step="0.01" name="dailyWage" value={form.dailyWage} onChange={change} className={input} required /></div>
          <div><label className="text-sm font-medium">Join date</label>
            <input type="date" name="joinDate" value={form.joinDate} onChange={change} className={input} /></div>
          <div className="flex items-end gap-2 pb-2">
            <input id="active" type="checkbox" checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            <label htmlFor="active" className="text-sm font-medium">Active</label>
          </div>
          <div className="md:col-span-2"><label className="text-sm font-medium">Notes</label>
            <input name="notes" value={form.notes} onChange={change} className={input} /></div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-md">
            {saving ? 'Saving...' : editingId ? 'Update' : 'Add employee'}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="text-sm text-slate-600 hover:text-slate-900">Cancel</button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Daily wage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan="6" className="px-4 py-4 text-slate-500">No employees yet.</td></tr>
            )}
            {items.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="px-4 py-3 font-medium">{emp.fullName}</td>
                <td className="px-4 py-3">{emp.role}</td>
                <td className="px-4 py-3">{emp.phone}</td>
                <td className="px-4 py-3">{money(emp.dailyWage)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${emp.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                    {emp.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => startEdit(emp)} className="text-amber-600 font-semibold hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}