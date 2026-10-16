import { useState } from 'react'
import api from '../services/api'

const serviceOptions = [
  'HT/LT Lines & Cabling',
  'Substation Work',
  'Streetlights',
  'Building Electrification',
  'Rooftop Solar',
  'Technical Manpower',
  'Other',
]

const empty = { name: '', phone: '', email: '', location: '', service: '', details: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.service) e.service = 'Please select a service'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    setSubmitted(false)
    setServerError('')
    if (Object.keys(e).length > 0) return

    try {
      setLoading(true)
      await api.post('/api/public/enquiries', form)
      setSubmitted(true)
      setForm(empty)
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data)
      } else {
        setServerError('Could not send your enquiry. Please try again or call us.')
      }
    } finally {
      setLoading(false)
    }
  }

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'
  const err = (k) => errors[k] && <p className="text-xs text-red-600 mt-1">{errors[k]}</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        <p className="mt-3 text-slate-600">
          Tell us about your project and we will get back to you with a quotation.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-slate-700">
          <li>Phone: +91 00000 00000</li>
          <li>Email: info@example.com</li>
          <li>Address: Karnataka, India</li>
        </ul>
        <a
          href="https://wa.me/910000000000"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold"
        >
          Chat on WhatsApp
        </a>
      </div>

      <div className="border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Request a Quotation</h2>

        {submitted && (
          <p className="mt-4 bg-green-50 text-green-800 text-sm p-3 rounded-md">
            Thank you! Your enquiry has been received. We will contact you soon.
          </p>
        )}

        {serverError && (
          <p className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-md">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium">Full name *</label>
            <input name="name" value={form.name} onChange={handleChange} className={input} />
            {err('name')}
          </div>
          <div>
            <label className="text-sm font-medium">Phone number *</label>
            <input name="phone" value={form.phone} onChange={handleChange} className={input} />
            {err('phone')}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className={input} />
            {err('email')}
          </div>
          <div>
            <label className="text-sm font-medium">Project location *</label>
            <input name="location" value={form.location} onChange={handleChange} className={input} />
            {err('location')}
          </div>
          <div>
            <label className="text-sm font-medium">Service required *</label>
            <select name="service" value={form.service} onChange={handleChange} className={input}>
              <option value="">Select a service</option>
              {serviceOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
            {err('service')}
          </div>
          <div>
            <label className="text-sm font-medium">Project details</label>
            <textarea name="details" rows="4" value={form.details} onChange={handleChange} className={input} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-md"
          >
            {loading ? 'Sending...' : 'Submit Enquiry'}
          </button>
        </form>
      </div>
    </div>
  )
}