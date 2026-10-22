import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight } from 'lucide-react'

const INFO = {
  phone: '+91 8310193407',
  email: 'rajaeleworkcmy@gmail.com',
  address: 'N.R. Extension Behind BESCOM Office , Chintamani-563 125 , Karnataka, India',
  whatsapp: 'https://wa.me/919449653503',
}

export default function Contact() {
  const cards = [
    { icon: Phone, title: 'Phone', text: INFO.phone, href: INFO.phoneLink },
    { icon: Mail, title: 'Email', text: INFO.email, href: `mailto:${INFO.email}` },
    { icon: MapPin, title: 'Address', text: INFO.address },
  ]

  return (
    <div className="bg-[#EFF6FF]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">Contact</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-blue-950 md:text-4xl">Contact Us</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Call, message or visit us. For a price for your project, use the quotation form.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, text, href }) => (
            <div key={title} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="rounded-lg bg-orange-100 p-3 text-orange-600"><Icon size={24} /></div>
              <div>
                <h3 className="font-heading font-semibold text-blue-950">{title}</h3>
                {href
                  ? <a href={href} className="text-sm text-slate-600 hover:text-orange-600">{text}</a>
                  : <p className="text-sm text-slate-600">{text}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={INFO.whatsapp} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
          <a href={INFO.phoneLink}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 font-semibold text-blue-950 hover:border-orange-400">
            <Phone size={18} /> Call now
          </a>
          <Link to="/quote"
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
            Get a Quote <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}