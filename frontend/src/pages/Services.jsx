import { Link } from 'react-router-dom'
import { Factory, Zap, Lightbulb, Building2, Sun, Users } from 'lucide-react'

const services = [
  {
    icon: Factory,
    title: 'HT/LT Lines, Overhead Lines & Cabling',
    items: ['High-tension and low-tension line work', 'Overhead lines on poles and towers', 'Underground and tray cabling', 'Labour support'],
  },
  {
    icon: Zap,
    title: 'Substations (66 kV / 11 kV)',
    items: ['Substation installation and works', 'Transformer and switchgear connections', 'Testing and commissioning'],
  },
  {
    icon: Lightbulb,
    title: 'Streetlights',
    items: ['Streetlight installation in layouts and roads', 'Pole installation and cabling', 'LED streetlight replacement', 'Maintenance and repair'],
  },
  {
    icon: Building2,
    title: 'Building Electrification',
    items: ['Household wiring and electrification', 'Residential projects', 'Commercial projects', 'Industrial projects and panels'],
  },
  {
    icon: Sun,
    title: 'Rooftop Solar',
    items: ['Residential, commercial and industrial rooftop solar', 'System design and installation', 'Maintenance support'],
  },
  {
    icon: Users,
    title: 'Technical Manpower',
    items: ['Electricians and technicians', 'Engineers for project needs', 'Short-term and long-term supply'],
  },
]

export default function Services() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Our Services</h1>
      <p className="mt-3 text-slate-600">Complete electrical solutions under one roof.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map(({ icon: Icon, title, items }) => (
          <div key={title} className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Icon className="text-amber-500" size={30} />
              <h2 className="font-semibold text-lg text-slate-900">{title}</h2>
            </div>
            <ul className="mt-4 list-disc list-inside space-y-1 text-sm text-slate-600">
              {items.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <Link
              to="/contact"
              className="inline-block mt-5 text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              Request a quote →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}