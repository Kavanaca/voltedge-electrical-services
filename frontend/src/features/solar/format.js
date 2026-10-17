export const SOLAR_STATUSES = [
  'SURVEY', 'DESIGN', 'APPROVAL_PENDING', 'MATERIAL_ORDERED',
  'INSTALLING', 'COMMISSIONED', 'CANCELLED',
]

export const SYSTEM_TYPES = ['ON_GRID', 'OFF_GRID', 'HYBRID']

export const SOLAR_BADGE = {
  SURVEY: 'bg-slate-100 text-slate-800',
  DESIGN: 'bg-slate-100 text-slate-800',
  APPROVAL_PENDING: 'bg-yellow-100 text-yellow-800',
  MATERIAL_ORDERED: 'bg-purple-100 text-purple-800',
  INSTALLING: 'bg-blue-100 text-blue-800',
  COMMISSIONED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export const pretty = (s) => s.replaceAll('_', ' ')