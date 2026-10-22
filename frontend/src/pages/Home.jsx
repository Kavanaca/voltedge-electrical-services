import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Zap, Sun, Lightbulb, Building2, Users, Factory, ShieldCheck, Clock, Wrench,
  FileText, ArrowRight, Phone, CheckCircle2, HardHat, ClipboardCheck,
} from 'lucide-react'
import api from '../services/api'

// Edit these with your real details.
const COMPANY = {
  name: 'Raja Electrical Works',
  phone: '+91 8310193407',
  area: 'N.R. Extension Behind BESCOM Office , Chintamani-563 125 , Karnataka, India',
}

const services = [
  { icon: Factory, title: 'HT/LT Lines & Substations', text: 'Overhead lines, cabling and 66 kV / 11 kV substation works.' },
  { icon: Lightbulb, title: 'Streetlights', text: 'LED streetlight supply, installation and maintenance for layouts and roads.' },
  { icon: Building2, title: 'Building Electrification', text: 'Residential, commercial and industrial wiring and installations.' },
  { icon: Sun, title: 'Rooftop Solar', text: 'Solar panel installation for homes, businesses and industries.' },
  { icon: Users, title: 'Technical Manpower', text: 'Qualified electricians and technicians for your projects.' },
  { icon: Zap, title: 'Power Distribution', text: 'Reliable distribution systems from planning to commissioning.' },
]

// Use REAL numbers only. Leave a value as '' to hide that box.
const stats = [
  { value: '', label: 'Projects completed' },
  { value: '', label: 'Years of experience' },
  { value: '', label: 'Qualified team members' },
]

// Sample entries. Replace with your real projects.
const projects = [
  { icon: Lightbulb, type: 'Streetlights', title: 'Layout streetlight installation', place: 'Karnataka' },
  { icon: Factory, type: 'HT/LT & Substation', title: '11 kV line and substation work', place: 'Karnataka' },
  { icon: Sun, type: 'Solar', title: 'Rooftop solar for a factory', place: 'Karnataka' },
]

const reasons = [
  { icon: ShieldCheck, title: 'Safety first', text: 'Safe working practices on every site.' },
  { icon: Wrench, title: 'Skilled professionals', text: 'Experienced engineers, electricians and technicians.' },
  { icon: FileText, title: 'Transparent quotations', text: 'Clear itemised costs with labour, material and GST.' },
  { icon: Clock, title: 'On-time delivery', text: 'Planned schedules and quality workmanship.' },
]

const serviceOptions = [
  'HT/LT Lines & Cabling', 'Substation Work', 'Streetlights', 'Building Electrification',
  'Rooftop Solar', 'Technical Manpower', 'Other',
]

const emptyForm = { name: '', phone: '', location: '', service: '', details: '' }

function Hero() {
  const [imgOk, setImgOk] = useState(true)
  return (
    
<section className="relative min-h-screen overflow-hidden">

  {/* Full-screen background image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/hero.png')",
    }}
  />

  {/* Dark overlay for readable text */}
  <div className="absolute inset-0 bg-slate-950/40" />

  {/* Content displayed above the image */}
  <div className="relative z-10 flex min-h-screen items-center">
    <div className="mx-auto w-full max-w-6xl px-6 py-16">

      <p className="mb-5 font-semibold uppercase tracking-wider text-orange-400">
        ⚡ Licensed Electrical Contractor
      </p>

      <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
        Powering Karnataka with safe, reliable
        <span className="text-orange-400"> electrical solutions</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-white">
        Complete electrical contracting, solar installations and power
        distribution for homes, businesses and industries.
      </p>

      
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/quote"
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 font-semibold text-white shadow hover:bg-orange-600">
              Get a Quote <ArrowRight size={18} />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/70 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white hover:text-blue-950">
              <Phone size={18} /> Contact Us
            </Link>
          </div>
      </div>
    </div>
</section>
  )}

function QuoteForm() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
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
      await api.post('/api/public/enquiries', { ...form, email: '' })
      setDone(true)
      setForm(emptyForm)
    } catch (err) {
      if (err.response?.status === 400 && typeof err.response.data === 'object') {
        setErrors(err.response.data)
      } else if (err.response?.status === 429) {
        setServerError('Too many requests. Please try again later or call us.')
      } else {
        setServerError('Could not send your enquiry. Please try again or call us.')
      }
    } finally {
      setLoading(false)
    }
  }

  const input = 'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
  const err = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <h3 className="font-heading text-xl font-bold text-blue-950">Request a Quotation</h3>
      {done && (
        <p className="mt-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle2 size={18} /> Thank you! We have received your enquiry and will contact you soon.
        </p>
      )}
      {serverError && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Full name *</label>
          <input name="name" value={form.name} onChange={change} className={input} />
          {err('name')}
        </div>
        <div>
          <label className="text-sm font-medium">Phone number *</label>
          <input name="phone" value={form.phone} onChange={change} className={input} />
          {err('phone')}
        </div>
        <div>
          <label className="text-sm font-medium">Project location *</label>
          <input name="location" value={form.location} onChange={change} className={input} />
          {err('location')}
        </div>
        <div>
          <label className="text-sm font-medium">Service required *</label>
          <select name="service" value={form.service} onChange={change} className={input}>
            <option value="">Select a service</option>
            {serviceOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
          {err('service')}
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Project description</label>
          <textarea name="details" rows="3" value={form.details} onChange={change} className={input} />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="mt-5 w-full rounded-md bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
        {loading ? 'Sending...' : 'Submit Enquiry'}
      </button>
    </form>
  )
}

export default function Home() {
  const shownStats = stats.filter((s) => s.value !== '')

  return (
    <>
      <Hero />  

      
{/* Trust numbers: only real values are shown */}
{shownStats.length > 0 && (
  <section className="bg-[#BFDBFE] text-blue-950">
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
        {shownStats.map((s) => (
          <div key={s.label}>
            <p className="font-heading text-3xl font-extrabold text-orange-500">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-blue-950">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)}



    </>
  )
}