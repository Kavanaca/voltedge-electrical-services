import { Link } from 'react-router-dom'
import { Zap, Sun, Lightbulb, Building2, Users, Factory } from 'lucide-react'

const services = [
  { icon: Factory, title: 'HT/LT Lines & Substations', text: 'Overhead lines, cabling and 66 kV / 11 kV substation works.' },
  { icon: Lightbulb, title: 'Streetlights', text: 'LED streetlight supply, installation and maintenance for layouts and roads.' },
  { icon: Building2, title: 'Building Electrification', text: 'Residential, commercial and industrial electrical installations.' },
  { icon: Sun, title: 'Rooftop Solar', text: 'Solar panel installation for homes, businesses and industries.' },
  { icon: Users, title: 'Technical Manpower', text: 'Qualified electricians and technicians for your projects.' },
  { icon: Zap, title: 'Power Distribution', text: 'Reliable distribution systems from planning to commissioning.' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Complete Electrical Contracting, Solar and Power Distribution Solutions
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl">
            Licensed electrical contractor delivering safe, reliable and on-time projects across Karnataka.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-md font-semibold">
              Request a Quotation
            </Link>
            <Link to="/services" className="border border-slate-500 hover:bg-slate-800 px-6 py-3 rounded-md font-semibold">
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">What We Do</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <Icon className="text-amber-500" size={32} />
              <h3 className="mt-4 font-semibold text-lg text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Need an electrical contractor?</h2>
          <p className="mt-2 text-slate-600">Tell us about your project and we will send you a quotation.</p>
          <Link to="/contact" className="inline-block mt-6 bg-slate-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-slate-800">
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  )
}