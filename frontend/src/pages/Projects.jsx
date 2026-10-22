import { Link } from 'react-router-dom'
import {
  Lightbulb, Factory, Sun, Building2, Zap, Users, MapPin, CalendarDays, ArrowRight,
} from 'lucide-react'

// To show a real photo, set image to a path such as '/images/projects/streetlight.jpg'
// (save the file in frontend/public/images/projects/).
// These are SAMPLE entries. Replace them with your real projects.
const projects = [
  { icon: Lightbulb, title: 'Sample: Layout Streetlight Installation', location: 'Karnataka', type: 'Streetlights', year: '2025', image: '' },
  { icon: Factory, title: 'Sample: 11 kV Line and Substation Work', location: 'Karnataka', type: 'HT/LT & Substation', year: '2025', image: '' },
  { icon: Sun, title: 'Sample: Rooftop Solar for Factory', location: 'Karnataka', type: 'Solar', year: '2026', image: '' },
  { icon: Building2, title: 'Sample: Apartment Building Electrification', location: 'Karnataka', type: 'Building Electrification', year: '2025', image: '' },
  { icon: Zap, title: 'Sample: 66 kV Substation Commissioning', location: 'Karnataka', type: 'Substation', year: '2026', image: '' },
  { icon: Users, title: 'Sample: Technical Manpower for Industrial Site', location: 'Karnataka', type: 'Manpower', year: '2025', image: '' },
  { icon: Lightbulb, title: 'Sample: LED Streetlight Replacement', location: 'Karnataka', type: 'Streetlights', year: '2026', image: '' },
  { icon: Sun, title: 'Sample: Residential Rooftop Solar', location: 'Karnataka', type: 'Solar', year: '2026', image: '' },
  { icon: Factory, title: 'Sample: Underground Cabling Work', location: 'Karnataka', type: 'HT/LT & Cabling', year: '2025', image: '' },
]

export default function Projects() {
  return (
    <section className="bg-[#EFF6FF]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-orange-500">
          Our work
        </p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold text-blue-950 md:text-4xl">
          Our Projects
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded bg-orange-400" />
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          A selection of our completed work.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(({ icon: Icon, title, location, type, year, image }) => (
            <div
              key={title}
              className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
            >
              {/* Photo area */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 via-white to-orange-100">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-blue-300">
                    <Icon size={64} />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow">
                  {type}
                </span>
              </div>

              {/* Details */}
              <div className="p-5">
                <h2 className="font-heading text-lg font-semibold text-blue-950">{title}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin size={15} className="text-orange-500" /> {location}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={15} className="text-orange-500" /> {year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-14 rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
          <h2 className="font-heading text-xl font-bold text-blue-950 md:text-2xl">
            Have a similar project in mind?
          </h2>
          <p className="mt-2 text-slate-600">Tell us about it and we will send you a quotation.</p>
          <Link
            to="/quote"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Get a Quote <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}