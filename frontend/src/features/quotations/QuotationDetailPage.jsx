import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Printer } from 'lucide-react'
import api from '../../services/api'
import { money, dateOnly } from './format'

const STATUSES = ['PENDING', 'SENT', 'APPROVED', 'REJECTED']

export default function QuotationDetailPage() {
  const { id } = useParams()
  const [q, setQ] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/admin/quotations/${id}`)
      .then((res) => setQ(res.data))
      .catch(() => setError('Could not load this quotation.'))
  }, [id])

  const changeStatus = async (status) => {
    try {
      const { data } = await api.patch(`/api/admin/quotations/${id}/status`, { status })
      setQ(data)
    } catch {
      setError('Could not update status.')
    }
  }

  if (error) return <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>
  if (!q) return <p className="text-slate-500">Loading...</p>

  return (
    <div className="max-w-3xl">
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link to="/admin/quotations" className="text-sm text-slate-500 hover:text-amber-600">← All quotations</Link>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Status</label>
          <select value={q.status} onChange={(e) => changeStatus(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => window.print()}
            className="flex items-center gap-1 bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-8 print:shadow-none print:p-0">
        <div className="flex justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Raja Electrical Works</h1>
            <p className="text-sm text-slate-600">N R Extension Behind BESCOM Office , Chintamani - 563125 , Karnataka, India</p>
            <p className="text-sm text-slate-600">Phone: +91 8310193407 | rajaeleworkscmy@gmail.com</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-amber-600">QUOTATION</p>
            <p className="text-sm">{q.quotationNumber}</p>
            <p className="text-sm text-slate-600">Date: {dateOnly(q.createdAt)}</p>
            <p className="text-sm text-slate-600">Valid until: {dateOnly(q.validUntil)}</p>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p className="font-semibold text-slate-900">To:</p>
          <p>{q.customerName}</p>
          <p>{q.customerPhone}{q.customerEmail ? ` | ${q.customerEmail}` : ''}</p>
          <p>{q.location}</p>
          <p className="mt-2"><span className="font-semibold">Subject:</span> {q.service}</p>
        </div>

        <table className="w-full mt-6 text-sm text-left">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Description</th>
              <th className="px-2 py-2 text-right">Qty</th>
              <th className="px-2 py-2 text-right">Rate</th>
              <th className="px-2 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {q.items.map((i, idx) => (
              <tr key={i.id} className="border-b">
                <td className="px-2 py-2">{idx + 1}</td>
                <td className="px-2 py-2">
                  {i.description}
                  <span className="text-xs text-slate-500"> ({i.itemType.toLowerCase()})</span>
                </td>
                <td className="px-2 py-2 text-right">{Number(i.quantity)} {i.unit}</td>
                <td className="px-2 py-2 text-right">{money(i.unitPrice)}</td>
                <td className="px-2 py-2 text-right">{money(i.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto w-64 text-sm space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(q.subtotal)}</span></div>
          {Number(q.discount) > 0 && (
            <div className="flex justify-between"><span>Discount</span><span>- {money(q.discount)}</span></div>
          )}
          <div className="flex justify-between"><span>GST ({Number(q.gstPercent)}%)</span><span>{money(q.gstAmount)}</span></div>
          <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>{money(q.total)}</span></div>
        </div>

        {q.terms && (
          <div className="mt-8 text-sm">
            <p className="font-semibold text-slate-900">Terms and conditions</p>
            <p className="mt-1 whitespace-pre-line text-slate-700">{q.terms}</p>
          </div>
        )}

        <p className="mt-10 text-right text-sm text-slate-700">For Raja Electrical Works</p>
      </div>
    </div>
  )
}