import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import api from '../../services/api'
import { money, dateOnly } from '../quotations/format'
import { PROJECT_STATUSES, TASK_STATUSES, TASK_BADGE, label, apiError } from './format'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [edit, setEdit] = useState(null)
  const [task, setTask] = useState({ title: '', assignee: '', dueDate: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = (data) => {
    setP(data)
    setEdit({
      name: data.name,
      status: data.status,
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      contractorName: data.contractorName || '',
      notes: data.notes || '',
    })
  }

  useEffect(() => {
    api.get(`/api/admin/projects/${id}`)
      .then((res) => load(res.data))
      .catch(() => setError('Could not load this project.'))
  }, [id])

  const run = async (request, fallback, success) => {
    setError('')
    setMessage('')
    try {
      const { data } = await request()
      load(data)
      if (success) setMessage(success)
      return true
    } catch (err) {
      setError(apiError(err, fallback))
      return false
    }
  }

  const saveProject = (e) => {
    e.preventDefault()
    run(() => api.put(`/api/admin/projects/${id}`, {
      ...edit,
      startDate: edit.startDate || null,
      endDate: edit.endDate || null,
    }), 'Could not save the project.', 'Project saved.')
  }

  const addTask = async (e) => {
    e.preventDefault()
    const ok = await run(() => api.post(`/api/admin/projects/${id}/tasks`, {
      title: task.title,
      assignee: task.assignee,
      dueDate: task.dueDate || null,
    }), 'Could not add the task.')
    if (ok) setTask({ title: '', assignee: '', dueDate: '' })
  }

  const setTaskStatus = (taskId, status) =>
    run(() => api.patch(`/api/admin/projects/${id}/tasks/${taskId}/status`, { status }),
      'Could not update the task.')

  const removeTask = (taskId) => {
    if (window.confirm('Delete this task?')) {
      run(() => api.delete(`/api/admin/projects/${id}/tasks/${taskId}`), 'Could not delete the task.')
    }
  }

  if (!p) {
    return error
      ? <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>
      : <p className="text-slate-500">Loading...</p>
  }

  const input = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <div className="max-w-5xl space-y-6">
      <Link to="/admin/projects" className="text-sm text-slate-500 hover:text-amber-600">← All projects</Link>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{p.projectNumber}</p>
            <h1 className="text-2xl font-bold text-slate-900">{p.name}</h1>
            <p className="text-sm text-slate-600 mt-1">
              {p.customerName} | {p.customerPhone} | {p.location}
            </p>
            <p className="text-sm text-slate-600">
              Quotation:{' '}
              <Link to={`/admin/quotations/${p.quotationId}`} className="text-amber-600 hover:underline">
                {p.quotationNumber}
              </Link>
              {' '}| Budget: <span className="font-medium">{money(p.budget)}</span>
            </p>
            <p className="text-sm text-slate-600">
              {dateOnly(p.startDate)} to {dateOnly(p.endDate)}
            </p>
          </div>
          <div className="w-48">
            <p className="text-sm font-medium text-slate-700">Progress: {p.progress}%</p>
            <div className="h-3 bg-slate-200 rounded mt-1">
              <div className="h-3 bg-amber-500 rounded" style={{ width: `${p.progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded-md">{error}</p>}
      {message && <p className="bg-green-50 text-green-800 text-sm p-3 rounded-md">{message}</p>}

      <form onSubmit={saveProject} className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Project details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={input} required />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })} className={input}>
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Start date</label>
            <input type="date" value={edit.startDate} onChange={(e) => setEdit({ ...edit, startDate: e.target.value })} className={input} />
          </div>
          <div>
            <label className="text-sm font-medium">End date</label>
            <input type="date" value={edit.endDate} onChange={(e) => setEdit({ ...edit, endDate: e.target.value })} className={input} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Contractor / Project manager</label>
            <input value={edit.contractorName} onChange={(e) => setEdit({ ...edit, contractorName: e.target.value })} className={input} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea rows="3" value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} className={input} />
          </div>
        </div>
        <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2 rounded-md">
          Save changes
        </button>
      </form>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-slate-900">Tasks ({p.tasks.length})</h2>

        <form onSubmit={addTask} className="mt-4 grid gap-2 md:grid-cols-12 items-end">
          <div className="md:col-span-5">
            <label className="text-xs text-slate-500">Task *</label>
            <input value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} className={input} required />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-slate-500">Assigned to</label>
            <input value={task.assignee} onChange={(e) => setTask({ ...task, assignee: e.target.value })} className={input} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Due date</label>
            <input type="date" value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} className={input} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 rounded-md">
              Add task
            </button>
          </div>
        </form>

        {p.tasks.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No tasks yet. Add the first task above.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2">Task</th>
                  <th className="px-3 py-2">Assigned to</th>
                  <th className="px-3 py-2">Due</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {p.tasks.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-3 py-2">{t.title}</td>
                    <td className="px-3 py-2">{t.assignee || '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{dateOnly(t.dueDate)}</td>
                    <td className="px-3 py-2">
                      <select value={t.status} onChange={(e) => setTaskStatus(t.id, e.target.value)}
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${TASK_BADGE[t.status]}`}>
                        {TASK_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => removeTask(t.id)} className="text-red-600" aria-label="Delete task">
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
    </div>
  )
}