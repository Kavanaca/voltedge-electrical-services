import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FilePlus2 } from 'lucide-react'
import api from '../../services/api'

const STATUSES = ['NEW', 'CONTACTED', 'QUOTED', 'CLOSED']

const badge = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUOTED: 'bg-purple-100 text-purple-800',
  CLOSED: 'bg-green-100 text-green-800',
}

const cardColor = {
  NEW: 'border-blue-200 text-blue-700',
  CONTACTED: 'border-yellow-200 text-yellow-700',
  QUOTED: 'border-purple-200 text-purple-700',
  CLOSED: 'border-green-200 text-green-700',
}

export default function EnquiriesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/admin/enquiries')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load enquiries.'))
      .finally(() => setLoading(false))
  }, [])

  const changeStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/api/admin/enquiries/${id}/status`, { status })
      setItems((list) => list.map((e) => (e.id === id ? data : e)))
    } catch {
      setError('Could not update status.')
    }
  }

  const count = (s) => items.filter((e) => e.status === s).length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-950">Customer Enquiries</h1>
          <div className="mt-2 h-1 w-12 rounded bg-orange-500" />
        </div>
        <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-blue-950 shadow-sm">
          {items.length} total
        </span>
      </div>

      {error && <p className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}
      {loading && <p className="mt-4 text-slate-500">Loading...</p>}

      {/* Status counters */}
      {!loading && !error && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUSES.map((s) => (
            <div key={s} className={`rounded-xl border bg-white p-4 shadow-sm ${cardColor[s]}`}>
              <p className="text-xs font-semibold uppercase tracking-wide">{s}</p>
              <p className="mt-1 font-heading text-2xl font-bold text-blue-950">{count(s)}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <p className="mt-4 text-slate-500">No enquiries yet.</p>
      )}

      {items.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-950 text-blue-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {items.map((e) => (
                  <tr key={e.id} className="align-top transition hover:bg-orange-50/50">
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                          {e.name.trim().charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-semibold text-blue-950">{e.name}</div>
                          <div className="text-slate-600">{e.phone}</div>
                          {e.email && <div className="text-slate-500">{e.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">{e.service}</td>
                    <td className="px-4 py-4 text-slate-700">{e.location}</td>
                    <td className="px-4 py-4 max-w-xs text-slate-600">{e.details || '-'}</td>
                    <td className="px-4 py-4">
                      <select
                        value={e.status}
                        onChange={(ev) => changeStatus(e.id, ev.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[e.status]}`}
                      >
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/quotations/new?enquiryId=${e.id}`}
                        className="inline-flex items-center gap-1 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                      >
                        <FilePlus2 size={14} /> Create quotation
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}