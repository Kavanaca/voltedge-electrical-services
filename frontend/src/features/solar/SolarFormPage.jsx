import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { apiError } from '../projects/format'
import { SOLAR_STATUSES, SYSTEM_TYPES, pretty } from './format'

const empty = {
  projectId: '', customerName: '', customerPhone: '', siteAddress: '',
  systemType: 'ON_GRID', capacityKw: '', panelBrand: '', panelCount: '', panelWatt: '',
  inverterBrand: '', inverterKw: '', status: 'SURVEY',
  surveyDate: '', installDate: '', commissioningDate: '', warrantyYears: '', notes: '',
}

const num = (v) => (v === '' || v === null ? null : Number(v))
const str = (v) => (v === null || v === undefined ? '' : String(v))

export default function SolarFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/api/admin/projects').then((res) => setProjects(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return
    api.get(`/api/admin/solar/${id}`)
      .then(({ data }) => setForm({
        projectId: str(data.projectId), customerName: data.customerName,
        customerPhone: data.customerPhone, siteAddress: data.siteAddress,
        systemType: data.systemType, capacityKw: str(data.capacityKw),
        panelBrand: str(data.panelBrand), panelCount: str(data.panelCount),
        panelWatt: str(data.panelWatt), inverterBrand: str(data.inverterBrand),
        inverterKw: str(data.inverterKw), status: data.status,
        surveyDate: str(data.surveyDate), installDate: str(data.installDate),
        commissioningDate: str(data.commissioningDate),
        warrantyYears: str(data.warrantyYears), notes: str(data.notes),
      }))
      .catch(() => setError('Could not load this installation.'))
  }, [id])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const pickProject = (e) => {
    const pid = e.target.value
    const p = projects.find((x) => String(x.id) === pid)
    setForm({
      ...form,
      projectId: pid,
      customerName: form.customerName || (p ? p.customerName : ''),
    })
  }

  const panelKw = (Number(form.panelCount) || 0) * (Number(form.panelWatt) || 0) / 1000

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      projectId: num(form.projectId),
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      siteAddress: form.siteAddress,
      systemType: form.systemType,
      capacityKw: num(form.capacityKw),
      panelBrand: form.panelBrand,
      panelCount: num(form.panelCount),
      panelWatt: num(form.panelWatt),
      inverterBrand: form.inverterBrand,
      inverterKw: num(form.inverterKw),
      status: form.status,
      surveyDate: form.surveyDate || null,
      installDate: form.installDate || null,
      commissioningDate: form.commissioningDate || null,
      warrantyYears: num(form.warrantyYears),
      notes: form.notes,
    }
    try {
      setSaving(true)
      if (id) await api.put(`/api/admin/solar/${id}`, payload)
      else await api.post('/api/admin/solar', payload)
      navigate('/admin/solar')
    } catch (err) {
      setError(apiError(err, 'Could not save the installation.'))
    } finally {
      setSaving(false)
    }
  }

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <form onSubmit={submit} className="max-w-4xl space-y-6">
      <div>
        <Link to="/admin/solar" className="text-sm text-slate-500 hover:text-amber-600">← All installations</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {id ? 'Edit Installation' : 'New Installation'}
        </h1>
      </div>
      {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-slate-900">Customer and site</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Linked project (optional)</label>
            <select name="projectId" value={form.projectId} onChange={pickProject} className={input}>
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.projectNumber} - {p.name}</option>
              ))}
            </select>
          </div>
          <div><label className="text-sm font-medium">Customer name *</label>
            <input name="customerName" value={form.customerName} onChange={change} className={input} required /></div>
          <div><label className="text-sm font-medium">Phone *</label>
            <input name="customerPhone" value={form.customerPhone} onChange={change} className={input} required /></div>
          <div className="md:col-span-2"><label className="text-sm font-medium">Site address *</label>
            <input name="siteAddress" value={form.siteAddress} onChange={change} className={input} required /></div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-slate-900">System</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div><label className="text-sm font-medium">System type *</label>
            <select name="systemType" value={form.systemType} onChange={change} className={input}>
              {SYSTEM_TYPES.map((t) => <option key={t} value={t}>{pretty(t)}</option>)}
            </select></div>
          <div><label className="text-sm font-medium">Capacity (kW) *</label>
            <input type="number" min="0.1" step="0.01" name="capacityKw" value={form.capacityKw} onChange={change} className={input} required /></div>
          <div><label className="text-sm font-medium">Warranty (years)</label>
            <input type="number" min="0" max="50" name="warrantyYears" value={form.warrantyYears} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Panel brand</label>
            <input name="panelBrand" value={form.panelBrand} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Number of panels</label>
            <input type="number" min="0" name="panelCount" value={form.panelCount} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Watt per panel</label>
            <input type="number" min="0" name="panelWatt" value={form.panelWatt} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Inverter brand</label>
            <input name="inverterBrand" value={form.inverterBrand} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Inverter size (kW)</label>
            <input type="number" min="0" step="0.01" name="inverterKw" value={form.inverterKw} onChange={change} className={input} /></div>
          <div className="flex items-end pb-2 text-sm text-slate-600">
            {panelKw > 0 && <span>Panels total: <strong>{panelKw.toFixed(2)} kW</strong></span>}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-slate-900">Progress</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><label className="text-sm font-medium">Status *</label>
            <select name="status" value={form.status} onChange={change} className={input}>
              {SOLAR_STATUSES.map((s) => <option key={s} value={s}>{pretty(s)}</option>)}
            </select></div>
          <div />
          <div><label className="text-sm font-medium">Survey date</label>
            <input type="date" name="surveyDate" value={form.surveyDate} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Install date</label>
            <input type="date" name="installDate" value={form.installDate} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Commissioning date</label>
            <input type="date" name="commissioningDate" value={form.commissioningDate} onChange={change} className={input} />
            <p className="text-xs text-slate-500 mt-1">Left empty with status COMMISSIONED, today's date is used.</p></div>
          <div className="md:col-span-2"><label className="text-sm font-medium">Notes</label>
            <textarea name="notes" rows="3" value={form.notes} onChange={change} className={input} /></div>
        </div>
      </section>

      <button type="submit" disabled={saving}
        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-md">
        {saving ? 'Saving...' : id ? 'Update installation' : 'Save installation'}
      </button>
    </form>
  )
}