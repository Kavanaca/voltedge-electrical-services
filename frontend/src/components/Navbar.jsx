import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Zap, LogIn, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition ${
      isActive ? 'text-amber-600' : 'text-slate-700 hover:text-amber-600'
    }`

  const accountLink = isAdmin
    ? { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard }
    : { to: '/login', label: 'Login', Icon: LogIn }

  return (
    <header className="sticky top-0 z-50 bg-[#477B9E] shadow-md">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-heading font-bold text-slate-900">
          <Zap className="text-amber-500" />
          RAJA<span className="text-amber-500">ELECTRICAL WORKS</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to={accountLink.to}
            className="ml-2 flex items-center gap-1 border border-slate-300 hover:border-amber-500 hover:text-amber-600 text-slate-700 text-sm font-semibold px-4 py-2 rounded-md transition"
          >
            <accountLink.Icon size={16} /> {accountLink.label}
          </Link>
          <Link
            to="/quote"
            className="ml-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-2 flex flex-col">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to={accountLink.to}
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 flex items-center gap-2"
          >
            <accountLink.Icon size={16} /> {accountLink.label}
          </Link>
        </div>
      )}
    </header>
  )
}