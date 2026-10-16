const projects = [
  { title: 'Sample: Layout Streetlight Installation', location: 'Karnataka', type: 'Streetlights', year: '2025' },
  { title: 'Sample: 11 kV Line and Substation Work', location: 'Karnataka', type: 'HT/LT & Substation', year: '2025' },
  { title: 'Sample: Rooftop Solar for Factory', location: 'Karnataka', type: 'Solar', year: '2026' },
]

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Our Projects</h1>
      <p className="mt-3 text-slate-600">A selection of our completed work.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div key={p.title} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="h-40 bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
              Project photo
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-amber-600">{p.type}</span>
              <h3 className="mt-1 font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.location} · {p.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}