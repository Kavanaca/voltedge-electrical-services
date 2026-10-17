import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { money, dateOnly } from '../quotations/format'
import { PROJECT_BADGE, label } from './format'

export default function ProjectsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/admin/projects')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load projects.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-600 mt-1">{items.length} total</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
        >
          + New project
        </Link>
      </div>

      {error && <p className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}
      {loading && <p className="mt-4 text-slate-500">Loading...</p>}
      {!loading && items.length === 0 && !error && (
        <p className="mt-4 text-slate-500">
          No projects yet. Approve a quotation, then click "New project".
        </p>
      )}

      {items.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">End date</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">
                    <Link to={`/admin/projects/${p.id}`} className="font-medium text-amber-600 hover:underline">
                      {p.projectNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.customerName}</td>
                  <td className="px-4 py-3">{money(p.budget)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{dateOnly(p.endDate)}</td>
                  <td className="px-4 py-3 w-40">
                    <div className="h-2 bg-slate-200 rounded">
                      <div className="h-2 bg-amber-500 rounded" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{p.progress}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${PROJECT_BADGE[p.status]}`}>
                      {label(p.status)}
                    </span>
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