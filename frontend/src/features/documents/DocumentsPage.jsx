import { useEffect, useRef, useState } from 'react'
import api from '../../services/api'
import { dateOnly } from '../quotations/format'
import { apiError } from '../projects/format'

const TYPES = ['LICENCE', 'CERTIFICATE', 'PROJECT_APPROVAL', 'INSURANCE', 'OTHER']
const pretty = (s) => s.replaceAll('_', ' ')

const BADGE = {
  VALID: 'bg-green-100 text-green-800',
  EXPIRING_SOON: 'bg-yellow-100 text-yellow-800',
  EXPIRED: 'bg-red-100 text-red-800',
  NO_EXPIRY: 'bg-slate-100 text-slate-600',
}

const empty = {
  docType: 'LICENCE', title: '', issuingAuthority: '', documentNumber: '',
  issueDate: '', expiryDate: '', notes: '',
}

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png']

const size = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`)

export default function DocumentsPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [file, setFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  const load = () =>
    api.get('/api/admin/documents')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load documents.'))

  useEffect(() => { load() }, [])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const reset = () => {
    setEditingId(null)
    setForm(empty)
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const startEdit = (d) => {
    setEditingId(d.id)
    setForm({
      docType: d.docType, title: d.title, issuingAuthority: d.issuingAuthority || '',
      documentNumber: d.documentNumber || '', issueDate: d.issueDate || '',
      expiryDate: d.expiryDate || '', notes: d.notes || '',
    })
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pickFile = (e) => {
    const f = e.target.files[0]
    setError('')
    if (!f) { setFile(null); return }
    if (!ALLOWED.includes(f.type)) {
      setError('Only PDF, JPG and PNG files are allowed.')
      e.target.value = ''
      setFile(null)
      return
    }
    if (f.size > MAX_BYTES) {
      setError('File is too large. Maximum size is 5 MB.')
      e.target.value = ''
      setFile(null)
      return
    }
    setFile(f)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    const payload = { ...form, issueDate: form.issueDate || null, expiryDate: form.expiryDate || null }
    try {
      setSaving(true)
      const { data } = editingId
        ? await api.put(`/api/admin/documents/${editingId}`, payload)
        : await api.post('/api/admin/documents', payload)

      if (file) {
        const body = new FormData()
        body.append('file', file)
        try {
          await api.post(`/api/admin/documents/${data.id}/file`, body)
        } catch (err) {
          setError('Record saved, but the file was not uploaded: ' + apiError(err, 'upload failed.'))
          await load()
          return
        }
      }
      setMessage(editingId ? 'Document updated.' : 'Document added.')
      reset()
      await load()
    } catch (err) {
      setError(apiError(err, 'Could not save the document.'))
    } finally {
      setSaving(false)
    }
  }

  const viewFile = async (d) => {
    const win = window.open('', '_blank')
    try {
      const res = await api.get(`/api/admin/documents/${d.id}/file`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      if (win) win.location.href = url
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch {
      if (win) win.close()
      setError('Could not open the file.')
    }
  }

  const remove = async (d) => {
    if (!window.confirm(`Delete "${d.title}" and its file?`)) return
    setError('')
    setMessage('')
    try {
      await api.delete(`/api/admin/documents/${d.id}`)
      if (editingId === d.id) reset()
      await load()
    } catch (err) {
      setError(apiError(err, 'Could not delete the document.'))
    }
  }

  const expired = items.filter((d) => d.expiryStatus === 'EXPIRED')
  const soon = items.filter((d) => d.expiryStatus === 'EXPIRING_SOON')

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'
  const editingDoc = items.find((d) => d.id === editingId)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Licences and Documents</h1>

      {expired.length > 0 && (
        <p className="bg-red-50 text-red-800 text-sm p-3 rounded-md">
          <strong>{expired.length} expired:</strong> {expired.map((d) => d.title).join(', ')}
        </p>
      )}
      {soon.length > 0 && (
        <p className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-md">
          <strong>{soon.length} expiring within 60 days:</strong>{' '}
          {soon.map((d) => `${d.title} (${d.daysLeft} days)`).join(', ')}
        </p>
      )}

      {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}
      {message && <p className="bg-green-50 text-green-800 text-sm p-3 rounded-md">{message}</p>}

      <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-3xl">
        <h2 className="font-semibold text-slate-900">{editingId ? 'Edit document' : 'Add document'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="text-sm font-medium">Type *</label>
            <select name="docType" value={form.docType} onChange={change} className={input}>
              {TYPES.map((t) => <option key={t} value={t}>{pretty(t)}</option>)}
            </select></div>
          <div><label className="text-sm font-medium">Title *</label>
            <input name="title" value={form.title} onChange={change} className={input}
              placeholder="e.g. Electrical contractor licence" required /></div>
          <div><label className="text-sm font-medium">Issuing authority</label>
            <input name="issuingAuthority" value={form.issuingAuthority} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Document / licence number</label>
            <input name="documentNumber" value={form.documentNumber} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Issue date</label>
            <input type="date" name="issueDate" value={form.issueDate} onChange={change} className={input} /></div>
          <div><label className="text-sm font-medium">Expiry date</label>
            <input type="date" name="expiryDate" value={form.expiryDate} onChange={change} className={input} /></div>
          <div className="md:col-span-2"><label className="text-sm font-medium">Notes</label>
            <input name="notes" value={form.notes} onChange={change} className={input} /></div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              {editingDoc?.hasFile ? 'Replace file (optional)' : 'File (PDF, JPG or PNG, max 5 MB)'}
            </label>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={pickFile} className="mt-1 block w-full text-sm" />
            {editingDoc?.hasFile && (
              <p className="text-xs text-slate-500 mt-1">Current file: {editingDoc.fileName}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-md">
            {saving ? 'Saving...' : editingId ? 'Update' : 'Add document'}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="text-sm text-slate-600 hover:text-slate-900">Cancel</button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-4 text-slate-500">No documents yet.</td></tr>
            )}
            {items.map((d) => (
              <tr key={d.id} className="border-t align-top">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{d.title}</div>
                  {d.issuingAuthority && <div className="text-slate-500">{d.issuingAuthority}</div>}
                </td>
                <td className="px-4 py-3">{pretty(d.docType)}</td>
                <td className="px-4 py-3">{d.documentNumber || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{dateOnly(d.expiryDate)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${BADGE[d.expiryStatus]}`}>
                    {pretty(d.expiryStatus)}
                  </span>
                  {d.daysLeft !== null && d.daysLeft >= 0 && d.expiryStatus === 'EXPIRING_SOON' && (
                    <div className="text-xs text-slate-500 mt-1">{d.daysLeft} days left</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {d.hasFile ? (
                    <button onClick={() => viewFile(d)} className="text-amber-600 font-semibold hover:underline">
                      View ({size(d.fileSize)})
                    </button>
                  ) : <span className="text-slate-400">None</span>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap space-x-3">
                  <button onClick={() => startEdit(d)} className="text-amber-600 font-semibold hover:underline">Edit</button>
                  <button onClick={() => remove(d)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}