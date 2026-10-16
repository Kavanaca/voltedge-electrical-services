import { useEffect, useState } from 'react'
import api from '../../services/api'

const STATUSES = ['NEW', 'CONTACTED', 'QUOTED', 'CLOSED']

const badge = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUOTED: 'bg-purple-100 text-purple-800',
  CLOSED: 'bg-green-100 text-green-800',
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Customer Enquiries</h1>
      <p className="text-sm text-slate-600 mt-1">{items.length} total</p>

      {error && <p className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}
      {loading && <p className="mt-4 text-slate-500">Loading...</p>}

      {!loading && items.length === 0 && !error && (
        <p className="mt-4 text-slate-500">No enquiries yet.</p>
      )}

      {items.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-t align-top">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{e.name}</div>
                    <div className="text-slate-600">{e.phone}</div>
                    {e.email && <div className="text-slate-500">{e.email}</div>}
                  </td>
                  <td className="px-4 py-3">{e.service}</td>
                  <td className="px-4 py-3">{e.location}</td>
                  <td className="px-4 py-3 max-w-xs">{e.details || '-'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={e.status}
                      onChange={(ev) => changeStatus(e.id, ev.target.value)}
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${badge[e.status]}`}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}