import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { money } from '../quotations/format'
import { apiError } from '../projects/format'

export default function InvoiceFormPage() {
  const navigate = useNavigate()
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ quotationId: '', dueDays: '15', notes: '' })

  useEffect(() => {
    Promise.all([api.get('/api/admin/quotations'), api.get('/api/admin/invoices')])
      .then(([qs, invs]) => {
        const invoiced = new Set(invs.data.map((i) => i.quotationId))
        setOptions(qs.data.filter((q) => q.status === 'APPROVED' && !invoiced.has(q.id)))
      })
      .catch(() => setError('Could not load quotations.'))
      .finally(() => setLoading(false))
  }, [])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setSaving(true)
      const { data } = await api.post('/api/admin/invoices', {
        quotationId: Number(form.quotationId),
        dueDays: Number(form.dueDays) || 0,
        notes: form.notes,
      })
      navigate(`/admin/invoices/${data.id}`)
    } catch (err) {
      setError(apiError(err, 'Could not create the invoice.'))
    } finally {
      setSaving(false)
    }
  }

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <form onSubmit={submit} className="max-w-2xl bg-white rounded-lg shadow p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">New Invoice</h1>
      {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}

      <div>
        <label className="text-sm font-medium">Approved quotation *</label>
        <select name="quotationId" value={form.quotationId} onChange={change} className={input} required>
          <option value="">{loading ? 'Loading...' : 'Select a quotation'}</option>
          {options.map((q) => (
            <option key={q.id} value={q.id}>
              {q.quotationNumber} - {q.customerName} - {money(q.total)}
            </option>
          ))}
        </select>
        {!loading && options.length === 0 && (
          <p className="text-xs text-slate-500 mt-1">
            No approved quotations without an invoice. Approve a quotation first.{' '}
            <Link to="/admin/quotations" className="text-amber-600">Go to quotations</Link>
          </p>
        )}
        <p className="text-xs text-slate-500 mt-1">
          Items, discount and GST are copied from the quotation.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">Payment due in (days)</label>
        <input type="number" min="0" max="365" name="dueDays" value={form.dueDays} onChange={change} className={input} />
      </div>

      <div>
        <label className="text-sm font-medium">Notes (bank details, payment terms)</label>
        <textarea name="notes" rows="4" value={form.notes} onChange={change} className={input} />
      </div>

      <button type="submit" disabled={saving}
        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-md">
        {saving ? 'Creating...' : 'Create invoice'}
      </button>
    </form>
  )
}