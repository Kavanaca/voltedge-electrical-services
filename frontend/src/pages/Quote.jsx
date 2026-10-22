import { useState } from 'react'
import { CheckCircle2, FileText, HardHat, ShieldCheck } from 'lucide-react'
import api from '../services/api'
import { useSearchParams } from 'react-router-dom'

const serviceOptions = [
  'HT/LT Lines & Cabling', 'Substation Work', 'Streetlights', 'Building Electrification',
  'Rooftop Solar', 'Technical Manpower', 'Other',
]

const empty = { name: '', phone: '', email: '', location: '', service: '', details: '' }

export default function Quote() {
    const [searchParams] = useSearchParams()
  const preset = searchParams.get('service') || ''
  const [form, setForm] = useState({ ...empty, service: serviceOptions.includes(preset) ? preset : '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.service) e.service = 'Please select a service'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    setDone(false)
    setServerError('')
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    try {
      setLoading(true)
      await api.post('/api/public/enquiries', form)
      setDone(true)
      setForm(empty)
    } catch (err) {
      if (err.response?.status === 400 && typeof err.response.data === 'object') {
        setErrors(err.response.data)
      } else if (err.response?.status === 429) {
        setServerError('Too many requests. Please try again later.')
      } else {
        setServerError('Could not send your request. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const input = 'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
  const err = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <div className="bg-gradient-to-br from-sky-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">Free quotation</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-blue-950 md:text-4xl">
            Get a Quote
          </h1>
          <p className="mt-3 text-slate-600">
            Tell us about your project. We will review it and send you a clear, itemised quotation.
          </p>
          <ul className="mt-6 space-y-3 text-slate-700">
            <li className="flex items-center gap-2"><HardHat size={18} className="text-orange-500" /> Qualified electrical professionals</li>
            <li className="flex items-center gap-2"><FileText size={18} className="text-orange-500" /> Itemised labour, material and GST</li>
            <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-orange-500" /> Safe, on-time work</li>
          </ul>
        </div>

        <form onSubmit={submit} noValidate className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="font-heading text-xl font-bold text-blue-950">Request a Quotation</h2>

          {done && (
            <p className="mt-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle2 size={18} /> Thank you! We have received your request and will contact you soon.
            </p>
          )}
          {serverError && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Full name *</label>
              <input name="name" value={form.name} onChange={change} className={input} />{err('name')}</div>
            <div><label className="text-sm font-medium">Phone number *</label>
              <input name="phone" value={form.phone} onChange={change} className={input} />{err('phone')}</div>
            <div><label className="text-sm font-medium">Email</label>
              <input name="email" value={form.email} onChange={change} className={input} />{err('email')}</div>
            <div><label className="text-sm font-medium">Project location *</label>
              <input name="location" value={form.location} onChange={change} className={input} />{err('location')}</div>
            <div className="sm:col-span-2"><label className="text-sm font-medium">Service required *</label>
              <select name="service" value={form.service} onChange={change} className={input}>
                <option value="">Select a service</option>
                {serviceOptions.map((s) => <option key={s}>{s}</option>)}
              </select>{err('service')}</div>
            <div className="sm:col-span-2"><label className="text-sm font-medium">Project description</label>
              <textarea name="details" rows="4" value={form.details} onChange={change} className={input} /></div>
          </div>

          <button type="submit" disabled={loading}
            className="mt-5 w-full rounded-md bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
            {loading ? 'Sending...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}