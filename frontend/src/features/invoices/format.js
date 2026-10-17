export const PAY_BADGE = {
  UNPAID: 'bg-slate-100 text-slate-800',
  PARTIAL: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-200 text-slate-500',
}

export const METHODS = ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE']

export const methodLabel = (m) => m.replace('_', ' ')

export const todayISO = () => new Date().toISOString().slice(0, 10)