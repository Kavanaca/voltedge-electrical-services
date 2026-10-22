import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { Inbox, FileText, HardHat, Users, Receipt, Sun, FileCheck, LogOut, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-amber-500 text-white' : 'text-slate-300 hover:bg-slate-800'
    }`

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 print:bg-white">
      <aside className="print:hidden md:w-56 bg-slate-900 p-4 md:min-h-screen">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Zap className="text-amber-500" /> RAJA ELECTRICAL WORKS
        </div>
        <nav className="mt-6 flex md:flex-col gap-1 flex-wrap">
          <NavLink to="/admin/enquiries" className={linkClass}>
            <Inbox size={16} /> Enquiries
          </NavLink>
          <NavLink to="/admin/quotations" className={linkClass}>
            <FileText size={16} /> Quotations
          </NavLink>
          <NavLink to="/admin/projects" className={linkClass}>
            <HardHat size={16} /> Projects
          </NavLink>
          <NavLink to="/admin/employees" className={linkClass}>
            <Users size={16} /> Employees
          </NavLink>
          <NavLink to="/admin/invoices" className={linkClass}>
            <Receipt size={16} /> Invoices
          </NavLink>
          <NavLink to="/admin/solar" className={linkClass}>
            <Sun size={16} /> Solar
          </NavLink>
          <NavLink to="/admin/documents" className={linkClass}>
            <FileCheck size={16} /> Documents
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="print:hidden bg-white shadow-sm px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-sm text-slate-500 hover:text-amber-600">View website</Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-700">{user?.name} ({user?.role})</span>
            <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 hover:text-red-700">
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