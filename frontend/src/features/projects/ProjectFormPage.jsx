import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { money } from '../quotations/format'
import { apiError } from './format'

export default function ProjectFormPage() {
  const navigate = useNavigate()
  const [approved, setApproved] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    quotationId: '', name: '', startDate: '', endDate: '', contractorName: '', notes: '',
  })

  useEffect(() => {
    api.get('/api/admin/quotations')
      .then((res) => setApproved(res.data.filter((q) => q.status === 'APPROVED')))
      .catch(() => setError('Could not load quotations.'))
      .finally(() => setLoading(false))
  }, [])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const pick = (e) => {
    const id = e.target.value
    const q = approved.find((x) => String(x.id) === id)
    setForm({ ...form, quotationId: id, name: q ? `${q.service} - ${q.customerName}` : '' })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setSaving(true)
      const { data } = await api.post('/api/admin/projects', {
        quotationId: Number(form.quotationId),
        name: form.name,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        contractorName: form.contractorName,
        notes: form.notes,
      })
      navigate(`/admin/projects/${data.id}`)
    } catch (err) {
      setError(apiError(err, 'Could not create the project.'))
    } finally {
      setSaving(false)
    }
  }

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <form onSubmit={submit} className="max-w-2xl bg-white rounded-lg shadow p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">New Project</h1>
      {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}

      <div>
        <label className="text-sm font-medium">Approved quotation *</label>
        <select value={form.quotationId} onChange={pick} className={input} required>
          <option value="">{loading ? 'Loading...' : 'Select a quotation'}</option>
          {approved.map((q) => (
            <option key={q.id} value={q.id}>
              {q.quotationNumber} - {q.customerName} - {money(q.total)}
            </option>
          ))}
        </select>
        {!loading && approved.length === 0 && (
          <p className="text-xs text-slate-500 mt-1">
            No approved quotations. Open a quotation and set its status to APPROVED first.{' '}
            <Link to="/admin/quotations" className="text-amber-600">Go to quotations</Link>
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Project name *</label>
        <input name="name" value={form.name} onChange={change} className={input} required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Start date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={change} className={input} />
        </div>
        <div>
          <label className="text-sm font-medium">End date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={change} className={input} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Contractor / Project manager</label>
        <input name="contractorName" value={form.contractorName} onChange={change} className={input} />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea name="notes" rows="3" value={form.notes} onChange={change} className={input} />
      </div>

      <button type="submit" disabled={saving}
        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-md">
        {saving ? 'Creating...' : 'Create project'}
      </button>
    </form>
  )
}