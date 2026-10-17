import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { dateOnly } from '../quotations/format'
import { SOLAR_BADGE, pretty } from './format'

export default function SolarPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/admin/solar')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load installations.'))
      .finally(() => setLoading(false))
  }, [])

  const live = items.filter((i) => i.status !== 'CANCELLED')
  const totalKw = live.reduce((s, i) => s + Number(i.capacityKw), 0)
  const doneKw = live.filter((i) => i.status === 'COMMISSIONED')
    .reduce((s, i) => s + Number(i.capacityKw), 0)
  const inProgress = live.filter((i) => i.status !== 'COMMISSIONED').length

  const cards = [
    { label: 'Installations', value: live.length },
    { label: 'Total capacity', value: `${totalKw.toFixed(2)} kW` },
    { label: 'Commissioned', value: `${doneKw.toFixed(2)} kW` },
    { label: 'In progress', value: inProgress },
  ]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Solar Installations</h1>
          <p className="text-sm text-slate-600 mt-1">{items.length} total</p>
        </div>
        <Link to="/admin/solar/new"
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-md">
          + New installation
        </Link>
      </div>

      {error && <p className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}
      {loading && <p className="mt-4 text-slate-500">Loading...</p>}

      {!loading && !error && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <p className="mt-4 text-slate-500">No installations yet. Click "New installation".</p>
      )}

      {items.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Install date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-t align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{i.customerName}</div>
                    <div className="text-slate-600">{i.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">{i.siteAddress}</td>
                  <td className="px-4 py-3">{pretty(i.systemType)}</td>
                  <td className="px-4 py-3 font-medium">{Number(i.capacityKw)} kW</td>
                  <td className="px-4 py-3 whitespace-nowrap">{dateOnly(i.installDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${SOLAR_BADGE[i.status]}`}>
                      {pretty(i.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/solar/${i.id}/edit`} className="text-amber-600 font-semibold hover:underline">
                      Edit
                    </Link>
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