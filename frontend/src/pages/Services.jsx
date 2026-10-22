import { Link } from 'react-router-dom'
import { Factory, Zap, Lightbulb, Building2, Sun, Users, ArrowRight, CheckCircle2 } from 'lucide-react'

const services = [
  {
    icon: Factory,
    title: 'HT/LT Lines, Overhead Lines & Cabling',
    option: 'HT/LT Lines & Cabling',
    image: '/images/services/htlt.jpg',
    items: ['High-tension and low-tension line work', 'Overhead lines on poles and towers', 'Underground and tray cabling', 'Labour support'],
  },
  {
    icon: Zap,
    title: 'Substations (66 kV / 11 kV)',
    option: 'Substation Work',
    image: '/images/services/substation.jpg',
    items: ['Substation installation and works', 'Transformer and switchgear connections', 'Testing and commissioning'],
  },
  {
    icon: Lightbulb,
    title: 'Streetlights',
    option: 'Streetlights',
    image: '/images/services/streetlight.jpg',
    items: ['Streetlight installation in layouts and roads', 'Pole installation and cabling', 'LED streetlight replacement', 'Maintenance and repair'],
  },
  {
    icon: Building2,
    title: 'Building Electrification',
    option: 'Building Electrification',
    image: '/images/services/building.jpg',
    items: ['Household wiring and electrification', 'Residential projects', 'Commercial projects', 'Industrial projects and panels'],
  },
  {
    icon: Sun,
    title: 'Rooftop Solar',
    option: 'Rooftop Solar',
    image: '/images/services/solar.jpg',
    items: ['Residential, commercial and industrial rooftop solar', 'System design and installation', 'Maintenance support'],
  },
  {
    icon: Users,
    title: 'Technical Manpower',
    option: 'Technical Manpower',
    image: '/images/services/manpower.jpg',
    items: ['Electricians and technicians', 'Engineers for project needs', 'Short-term and long-term supply'],
  },
]

export default function Services() {
  return (
    <section className="bg-[#EFF6FF] px-4 pt-6 pb-12 md:pt-8 md:pb-16">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
          What we do
        </p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold text-blue-950 md:text-4xl">
          Our Services
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          Complete electrical solutions under one roof.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map(({ icon: Icon, title, option, image, items }) => (
            <div
              key={title}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
            >
              {/* Background photo */}
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${image}')` }}
              />
              {/* Fade in the same light colour as the cards */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 from-45% via-slate-50/90 to-slate-50/60 transition group-hover:via-slate-50/80 group-hover:to-slate-50/40" />

              <div className="relative flex flex-1 flex-col p-6">
                <div className="flex items-center gap-4">
                  <div className="inline-flex rounded-lg bg-blue-100 p-3 text-blue-900 transition group-hover:bg-orange-500 group-hover:text-white">
                    <Icon size={26} />
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-blue-950">{title}</h2>
                </div>

                <ul className="mt-5 flex-1 space-y-2 text-sm font-medium text-slate-700">
                  {items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-orange-500" />
                      {i}
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/quote?service=${encodeURIComponent(option)}`}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Request a quote <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}