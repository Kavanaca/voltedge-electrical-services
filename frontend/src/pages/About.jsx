import { Link } from 'react-router-dom'
import {
  ShieldCheck, Clock, Wrench, Factory, Lightbulb, Building2, Sun, Users, Zap,
  ArrowRight, CheckCircle2,
} from 'lucide-react'

const COMPANY = 'Raja Electrical Works'

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Licensed Contractor',
    text: 'Government of Karnataka approved electrical contractor licence (details to be verified and added).',
  },
  {
    icon: Wrench,
    title: 'Skilled Team',
    text: 'Experienced engineers, electricians and technicians for every project.',
  },
  {
    icon: Clock,
    title: 'On-time Delivery',
    text: 'Planned schedules, safe working practices and quality workmanship.',
  },
]

const offerings = [
  { icon: Factory, label: 'HT/LT line work and substation works' },
  { icon: Lightbulb, label: 'Streetlight installation' },
  { icon: Building2, label: 'Building electrification' },
  { icon: Sun, label: 'Rooftop solar' },
  { icon: Users, label: 'Technical manpower services' },
  { icon: Zap, label: 'Residential, commercial and industrial customers' },
]

export default function About() {
  return (
    <>{/* Header band */}
<section className="relative overflow-hidden bg-#EFF6FF] text-blue-950">
  <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
  <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

  <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
    <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
      Who we are
    </p>

    <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-blue-950 md:text-5xl">
  About Us
</h1>

<div className="mt-4 h-1.5 w-53 rounded-full bg-orange-500" />

    <p className="mt-4 w-full max-w-6xl text-justify text-lg leading-8 text-slate-700">
  Raja Electrical Works is a trusted electrical contracting company
  committed to delivering reliable, safe, and high-quality electrical
  solutions for residential, commercial, and industrial projects. We
  specialize in HT/LT line installation and maintenance, substation works,
  streetlight installation, building electrification, rooftop solar
  solutions, and skilled technical manpower services.
</p>

<p className="mt-4 w-full max-w-6xl text-justify text-lg leading-8 text-slate-700">
  Our services cover electrical infrastructure development, power
  distribution, internal wiring, lighting systems, and renewable energy
  installations. We focus on understanding each client's needs and
  providing practical, efficient, and cost-effective solutions that meet
  project requirements and applicable safety standards.
</p>
  </div>
</section>
     {/* Highlights */}
      <section className="bg-[#EFF6FF]">
       <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-12">
          <h2 className="text-center font-heading text-3xl font-bold text-blue-950">Why customers trust us</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-7 text-center transition hover:-translate-y-1 hover:border-orange-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto inline-flex rounded-full bg-blue-950 p-4 text-orange-400">
                  <Icon size={30} />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-blue-950">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 text-sm text-slate-700 sm:grid-cols-2">
            {['Safe working practices on every site', 'Clear, itemised quotations',
              'Qualified technical team', 'Quality workmanship'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-orange-500" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}