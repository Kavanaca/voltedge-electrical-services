import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { money } from './format'

const TYPES = ['MATERIAL', 'LABOUR', 'SERVICE']
const newItem = () => ({ itemType: 'MATERIAL', description: '', quantity: '1', unit: 'Nos', unitPrice: '' })

const DEFAULT_TERMS = `1. This quotation is valid until the date shown.
2. Payment terms: advance and balance as agreed before the work starts.
3. Work will be done as per the agreed scope. Extra work will be charged separately.
4. Taxes are applied as shown in this quotation.`

export default function QuotationFormPage() {
  const [params] = useSearchParams()
  const enquiryId = params.get('enquiryId')
  const navigate = useNavigate()

  const [customer, setCustomer] = useState({
    customerName: '', customerPhone: '', customerEmail: '', location: '', service: '',
  })
  const [items, setItems] = useState([newItem()])
  const [gstPercent, setGstPercent] = useState('18')
  const [discount, setDiscount] = useState('0')
  const [validDays, setValidDays] = useState('30')
  const [terms, setTerms] = useState(DEFAULT_TERMS)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!enquiryId) return
    api.get(`/api/admin/enquiries/${enquiryId}`)
      .then(({ data }) =>
        setCustomer({
          customerName: data.name,
          customerPhone: data.phone,
          customerEmail: data.email || '',
          location: data.location,
          service: data.service,
        })
      )
      .catch(() => setError('Could not load the enquiry.'))
  }, [enquiryId])

  // Preview only. The server calculates the final amounts.
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0)
    const disc = Number(discount) || 0
    const taxable = Math.max(subtotal - disc, 0)
    const gst = (taxable * (Number(gstPercent) || 0)) / 100
    return { subtotal, taxable, gst, total: taxable + gst }
  }, [items, discount, gstPercent])

  const setCust = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value })
  const setItem = (idx, field, value) =>
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, [field]: value } : it)))
  const addItem = () => setItems((list) => [...list, newItem()])
  const removeItem = (idx) => setItems((list) => list.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const bad = items.some(
      (i) => !i.description.trim() || !(Number(i.quantity) > 0) || i.unitPrice === '' || Number(i.unitPrice) < 0)
    if (bad) {
      setError('Every item needs a description, a quantity above 0 and a price.')
      return
    }

    const payload = {
      enquiryId: enquiryId ? Number(enquiryId) : null,
      ...customer,
      gstPercent: Number(gstPercent) || 0,
      discount: Number(discount) || 0,
      validDays: Number(validDays) || 30,
      terms,
      items: items.map((i) => ({
        itemType: i.itemType,
        description: i.description.trim(),
        quantity: Number(i.quantity),
        unit: i.unit,
        unitPrice: Number(i.unitPrice),
      })),
    }

    try {
      setSaving(true)
      const { data } = await api.post('/api/admin/quotations', payload)
      navigate(`/admin/quotations/${data.id}`)
    } catch (err) {
      const d = err.response?.data
      if (err.response?.status === 400 && d) {
        setError(typeof d === 'object' ? Object.values(d).join(', ') || d.message || 'Invalid data' : String(d))
      } else {
        setError('Could not save the quotation.')
      }
    } finally {
      setSaving(false)
    }
  }

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">New Quotation</h1>
      {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-slate-900">Customer</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><label className="text-sm font-medium">Name *</label>
            <input name="customerName" value={customer.customerName} onChange={setCust} className={input} required /></div>
          <div><label className="text-sm font-medium">Phone *</label>
            <input name="customerPhone" value={customer.customerPhone} onChange={setCust} className={input} required /></div>
          <div><label className="text-sm font-medium">Email</label>
            <input name="customerEmail" value={customer.customerEmail} onChange={setCust} className={input} /></div>
          <div><label className="text-sm font-medium">Location *</label>
            <input name="location" value={customer.location} onChange={setCust} className={input} required /></div>
          <div className="md:col-span-2"><label className="text-sm font-medium">Service *</label>
            <input name="service" value={customer.service} onChange={setCust} className={input} required /></div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-slate-900">Items</h2>
        <div className="mt-4 space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="grid gap-2 md:grid-cols-12 items-end border-b pb-3">
              <div className="md:col-span-2">
                <label className="text-xs text-slate-500">Type</label>
                <select value={it.itemType} onChange={(e) => setItem(idx, 'itemType', e.target.value)} className={input}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="text-xs text-slate-500">Description</label>
                <input value={it.description} onChange={(e) => setItem(idx, 'description', e.target.value)} className={input} />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-slate-500">Qty</label>
                <input type="number" min="0" step="0.01" value={it.quantity} onChange={(e) => setItem(idx, 'quantity', e.target.value)} className={input} />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-slate-500">Unit</label>
                <input value={it.unit} onChange={(e) => setItem(idx, 'unit', e.target.value)} className={input} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-slate-500">Unit price (₹)</label>
                <input type="number" min="0" step="0.01" value={it.unitPrice} onChange={(e) => setItem(idx, 'unitPrice', e.target.value)} className={input} />
              </div>
              <div className="md:col-span-1 text-sm font-medium py-2">
                {money((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0))}
              </div>
              <div className="md:col-span-1">
                <button type="button" onClick={() => removeItem(idx)} disabled={items.length === 1}
                  className="text-red-600 disabled:opacity-30 py-2" aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem}
          className="mt-4 flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700">
          <Plus size={16} /> Add item
        </button>
      </section>

      <section className="bg-white rounded-lg shadow p-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div><label className="text-sm font-medium">GST (%)</label>
            <input type="number" min="0" max="100" step="0.01" value={gstPercent} onChange={(e) => setGstPercent(e.target.value)} className={input} />
            <p className="text-xs text-slate-500 mt-1">Confirm the correct GST rate for each type of work with your accountant.</p></div>
          <div><label className="text-sm font-medium">Discount (₹)</label>
            <input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} className={input} /></div>
          <div><label className="text-sm font-medium">Valid for (days)</label>
            <input type="number" min="1" max="365" value={validDays} onChange={(e) => setValidDays(e.target.value)} className={input} /></div>
        </div>
        <div className="bg-slate-50 rounded-md p-4 text-sm space-y-2 self-start">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>- {money(Number(discount) || 0)}</span></div>
          <div className="flex justify-between"><span>GST ({gstPercent || 0}%)</span><span>{money(totals.gst)}</span></div>
          <div className="flex justify-between border-t pt-2 font-bold text-base"><span>Total</span><span>{money(totals.total)}</span></div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <label className="font-semibold text-slate-900">Terms and conditions</label>
        <textarea rows="5" value={terms} onChange={(e) => setTerms(e.target.value)} className={input} />
      </section>

      <button type="submit" disabled={saving}
        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-md">
        {saving ? 'Saving...' : 'Save quotation'}
      </button>
    </form>
  )
}