import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Printer, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { money, dateOnly } from '../quotations/format'
import { apiError } from '../projects/format'
import { PAY_BADGE, METHODS, methodLabel, todayISO } from './format'

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const [inv, setInv] = useState(null)
  const [error, setError] = useState('')
  const [pay, setPay] = useState({ amount: '', method: 'UPI', paymentDate: todayISO(), reference: '' })

  useEffect(() => {
    api.get(`/api/admin/invoices/${id}`)
      .then((res) => setInv(res.data))
      .catch(() => setError('Could not load this invoice.'))
  }, [id])

  const run = async (request, fallback) => {
    setError('')
    try {
      const { data } = await request()
      setInv(data)
      return true
    } catch (err) {
      setError(apiError(err, fallback))
      return false
    }
  }

  const addPayment = async (e) => {
    e.preventDefault()
    const ok = await run(() => api.post(`/api/admin/invoices/${id}/payments`, {
      amount: Number(pay.amount),
      method: pay.method,
      paymentDate: pay.paymentDate || null,
      reference: pay.reference,
    }), 'Could not record the payment.')
    if (ok) setPay({ amount: '', method: 'UPI', paymentDate: todayISO(), reference: '' })
  }

  const removePayment = (paymentId) => {
    if (window.confirm('Delete this payment record?')) {
      run(() => api.delete(`/api/admin/invoices/${id}/payments/${paymentId}`), 'Could not delete the payment.')
    }
  }

  const cancelInvoice = () => {
    if (window.confirm('Cancel this invoice? This cannot be undone.')) {
      run(() => api.patch(`/api/admin/invoices/${id}/cancel`), 'Could not cancel the invoice.')
    }
  }

  if (!inv) {
    return error
      ? <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>
      : <p className="text-slate-500">Loading...</p>
  }

  const cancelled = inv.paymentStatus === 'CANCELLED'
  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <div className="max-w-3xl space-y-6">
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/invoices" className="text-sm text-slate-500 hover:text-amber-600">← All invoices</Link>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${PAY_BADGE[inv.paymentStatus]}`}>
            {inv.paymentStatus}
          </span>
          {!cancelled && inv.payments.length === 0 && (
            <button onClick={cancelInvoice} className="text-sm text-red-600 hover:underline">Cancel invoice</button>
          )}
          <button onClick={() => window.print()}
            className="flex items-center gap-1 bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {error && <p className="print:hidden bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}

      <div className="bg-white shadow rounded-lg p-8 print:shadow-none print:p-0">
        <div className="flex justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">VoltEdge Electricals</h1>
            <p className="text-sm text-slate-600">Karnataka, India</p>
            <p className="text-sm text-slate-600">Phone: +91 00000 00000 | info@example.com</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-amber-600">INVOICE</p>
            <p className="text-sm">{inv.invoiceNumber}</p>
            <p className="text-sm text-slate-600">Date: {dateOnly(inv.createdAt)}</p>
            <p className="text-sm text-slate-600">Due date: {dateOnly(inv.dueDate)}</p>
            <p className="text-sm text-slate-600">Ref: {inv.quotationNumber}</p>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p className="font-semibold text-slate-900">Bill to:</p>
          <p>{inv.customerName}</p>
          <p>{inv.customerPhone}{inv.customerEmail ? ` | ${inv.customerEmail}` : ''}</p>
          <p>{inv.location}</p>
          <p className="mt-2"><span className="font-semibold">Work:</span> {inv.service}</p>
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
            {inv.items.map((i, idx) => (
              <tr key={i.id} className="border-b">
                <td className="px-2 py-2">{idx + 1}</td>
                <td className="px-2 py-2">{i.description}</td>
                <td className="px-2 py-2 text-right">{Number(i.quantity)} {i.unit}</td>
                <td className="px-2 py-2 text-right">{money(i.unitPrice)}</td>
                <td className="px-2 py-2 text-right">{money(i.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto w-72 text-sm space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(inv.subtotal)}</span></div>
          {Number(inv.discount) > 0 && (
            <div className="flex justify-between"><span>Discount</span><span>- {money(inv.discount)}</span></div>
          )}
          <div className="flex justify-between"><span>GST ({Number(inv.gstPercent)}%)</span><span>{money(inv.gstAmount)}</span></div>
          <div className="flex justify-between border-t pt-2 font-bold"><span>Total</span><span>{money(inv.total)}</span></div>
          <div className="flex justify-between text-green-700"><span>Paid</span><span>{money(inv.paid)}</span></div>
          <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Balance due</span><span>{money(inv.balance)}</span></div>
        </div>

        {inv.payments.length > 0 && (
          <div className="mt-6 text-sm">
            <p className="font-semibold text-slate-900">Payments received</p>
            <table className="w-full mt-1 text-left">
              <tbody>
                {inv.payments.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="py-1">{dateOnly(p.paymentDate)}</td>
                    <td className="py-1">{methodLabel(p.method)}</td>
                    <td className="py-1">{p.reference || '-'}</td>
                    <td className="py-1 text-right">{money(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {inv.notes && (
          <div className="mt-6 text-sm">
            <p className="font-semibold text-slate-900">Notes</p>
            <p className="mt-1 whitespace-pre-line text-slate-700">{inv.notes}</p>
          </div>
        )}

        <p className="mt-10 text-right text-sm text-slate-700">For VoltEdge Electricals</p>
      </div>

      {!cancelled && (
        <div className="print:hidden bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-slate-900">Record a payment</h2>

          {Number(inv.balance) <= 0 ? (
            <p className="mt-2 text-sm text-green-700">This invoice is fully paid.</p>
          ) : (
            <form onSubmit={addPayment} className="mt-4 grid gap-3 md:grid-cols-12 items-end">
              <div className="md:col-span-3">
                <label className="text-xs text-slate-500">Amount (₹) *</label>
                <input type="number" min="0.01" step="0.01" value={pay.amount}
                  onChange={(e) => setPay({ ...pay, amount: e.target.value })} className={input} required />
                <button type="button" onClick={() => setPay({ ...pay, amount: String(inv.balance) })}
                  className="text-xs text-amber-600 hover:underline mt-1">
                  Pay full balance ({money(inv.balance)})
                </button>
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-slate-500">Method</label>
                <select value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })} className={input}>
                  {METHODS.map((m) => <option key={m} value={m}>{methodLabel(m)}</option>)}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-slate-500">Date</label>
                <input type="date" max={todayISO()} value={pay.paymentDate}
                  onChange={(e) => setPay({ ...pay, paymentDate: e.target.value })} className={input} />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-slate-500">Reference (UPI / cheque no.)</label>
                <input value={pay.reference} onChange={(e) => setPay({ ...pay, reference: e.target.value })} className={input} />
              </div>
              <div className="md:col-span-12">
                <button type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2 rounded-md">
                  Add payment
                </button>
              </div>
            </form>
          )}

          {inv.payments.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Method</th>
                    <th className="px-3 py-2">Reference</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {inv.payments.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-3 py-2">{dateOnly(p.paymentDate)}</td>
                      <td className="px-3 py-2">{methodLabel(p.method)}</td>
                      <td className="px-3 py-2">{p.reference || '-'}</td>
                      <td className="px-3 py-2 text-right">{money(p.amount)}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => removePayment(p.id)} className="text-red-600" aria-label="Delete payment">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}