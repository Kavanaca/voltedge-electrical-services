import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { money, dateOnly } from '../quotations/format'
import { PAY_BADGE } from './format'

export default function InvoicesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/admin/invoices')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load invoices.'))
      .finally(() => setLoading(false))
  }, [])

  const active = items.filter((i) => i.paymentStatus !== 'CANCELLED')
  const billed = active.reduce((s, i) => s + Number(i.total), 0)
  const received = active.reduce((s, i) => s + Number(i.paid), 0)
  const outstanding = active.reduce((s, i) => s + Number(i.balance), 0)
  const overdue = active.filter((i) => i.paymentStatus === 'OVERDUE')
  const overdueAmount = overdue.reduce((s, i) => s + Number(i.balance), 0)

  const cards = [
    { label: 'Total billed', value: money(billed) },
    { label: 'Received', value: money(received) },
    { label: 'Outstanding', value: money(outstanding) },
    { label: `Overdue (${overdue.length})`, value: money(overdueAmount) },
  ]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-sm text-slate-600 mt-1">{items.length} total</p>
        </div>
        <Link
          to="/admin/invoices/new"
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
        >
          + New invoice
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
        <p className="mt-4 text-slate-500">
          No invoices yet. Approve a quotation, then click "New invoice".
        </p>
      )}

      {items.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Due date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="px-4 py-3">
                    <Link to={`/admin/invoices/${i.id}`} className="font-medium text-amber-600 hover:underline">
                      {i.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{i.customerName}</td>
                  <td className="px-4 py-3">{money(i.total)}</td>
                  <td className="px-4 py-3">{money(i.paid)}</td>
                  <td className="px-4 py-3 font-medium">{money(i.balance)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{dateOnly(i.dueDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${PAY_BADGE[i.paymentStatus]}`}>
                      {i.paymentStatus}
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