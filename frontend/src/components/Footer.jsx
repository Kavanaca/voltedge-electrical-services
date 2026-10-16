import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-white text-lg font-bold">VoltEdge Electricals</h3>
          <p className="mt-2 text-sm">
            Electrical contracting, solar and power distribution solutions.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold">Contact</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={16} /> +91 00000 00000</li>
            <li className="flex items-center gap-2"><Mail size={16} /> info@example.com</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Karnataka, India</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold">Licence</h4>
          <p className="mt-2 text-sm">
            Licence details will be added after verification from the official document.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700 text-center text-xs py-4">
        © {new Date().getFullYear()} VoltEdge Electricals. All rights reserved.
      </div>
    </footer>
  )
}