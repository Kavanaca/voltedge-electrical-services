import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  Inbox, FileText, HardHat, Users, Receipt, Sun, FileCheck, UserCog, LogOut, Zap, ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Name shown in the top bar. Change it here.
const OWNER_NAME = 'Welcome Back , Rajanna N!'

const menu = [
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/quotations', label: 'Quotations', icon: FileText },
  { to: '/admin/projects', label: 'Projects', icon: HardHat },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/invoices', label: 'Invoices', icon: Receipt },
  { to: '/admin/solar', label: 'Solar', icon: Sun },
  { to: '/admin/documents', label: 'Documents', icon: FileCheck },
  { to: '/admin/users', label: 'Users', icon: UserCog },
]

export default function DashboardLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
        : 'text-blue-100 hover:bg-white/10 hover:text-white'
    }`

  const initial = OWNER_NAME.trim().charAt(0).toUpperCase()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EFF6FF] print:bg-white">
      <aside className="print:hidden md:w-64 bg-gradient-to-b from-blue-950 via-blue-950 to-slate-900 p-5 md:min-h-screen">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-500 p-2 text-white"><Zap size={22} /></div>
          <div className="font-heading text-base font-bold uppercase leading-tight text-white">
            Raja Electrical Works
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 px-3">
          <span className="h-3 w-1 rounded bg-orange-500" />
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300/70">Navigation</p>
        </div>
        <nav className="mt-2 flex md:flex-col gap-1 flex-wrap">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="print:hidden bg-white border-b border-blue-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
           
            <p className="font-heading text-lg font-bold text-blue-950">{OWNER_NAME}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/"
              className="inline-flex items-center gap-2 rounded-md border border-orange-400 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white">
              <ExternalLink size={16} /> Open Website
            </Link>
            <button onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <main className="p-6 print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}