import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { money, STATUS_BADGE } from './format'

export default function QuotationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/admin/quotations')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load quotations.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotations</h1>
          <p className="text-sm text-slate-600 mt-1">{items.length} total</p>
        </div>
        <Link
          to="/admin/quotations/new"
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
        >
          + New quotation
        </Link>
      </div>

      {error && <p className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}
      {loading && <p className="mt-4 text-slate-500">Loading...</p>}
      {!loading && items.length === 0 && !error && (
        <p className="mt-4 text-slate-500">
          No quotations yet. Open an enquiry and click "Create quotation".
        </p>
      )}

      {items.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((q) => (
                <tr key={q.id} className="border-t">
                  <td className="px-4 py-3">
                    <Link to={`/admin/quotations/${q.id}`} className="font-medium text-amber-600 hover:underline">
                      {q.quotationNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{q.customerName}</td>
                  <td className="px-4 py-3">{q.service}</td>
                  <td className="px-4 py-3 font-medium">{money(q.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${STATUS_BADGE[q.status]}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(q.createdAt).toLocaleDateString('en-IN')}
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