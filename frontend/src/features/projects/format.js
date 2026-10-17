export const PROJECT_STATUSES = ['PLANNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

export const PROJECT_BADGE = {
  PLANNED: 'bg-slate-100 text-slate-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  ON_HOLD: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export const TASK_BADGE = {
  TODO: 'bg-slate-100 text-slate-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
}

export const label = (s) => s.replace('_', ' ')

export const apiError = (err, fallback) => {
  const d = err.response?.data
  if (d && typeof d === 'object') return d.message || Object.values(d).join(', ') || fallback
  return fallback
}