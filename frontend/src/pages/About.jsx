import { ShieldCheck, Clock, Wrench } from 'lucide-react'

const points = [
  { icon: ShieldCheck, title: 'Licensed Contractor', text: 'Government of Karnataka approved electrical contractor licence (details to be verified and added).' },
  { icon: Wrench, title: 'Skilled Team', text: 'Experienced engineers, electricians and technicians for every project.' },
  { icon: Clock, title: 'On-time Delivery', text: 'Planned schedules, safe working practices and quality workmanship.' },
]

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">About Us</h1>
      <p className="mt-4 text-slate-600 max-w-3xl">
        VoltEdge Electricals is an electrical contracting company providing HT/LT line work,
        substation works, streetlight installation, building electrification, rooftop solar
        and technical manpower services for residential, commercial and industrial customers.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {points.map(({ icon: Icon, title, text }) => (
          <div key={title} className="border rounded-lg p-6 shadow-sm">
            <Icon className="text-amber-500" size={32} />
            <h3 className="mt-4 font-semibold text-lg">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}