import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Zap } from 'lucide-react'

// Edit these with your real details.
const INFO = {
  name: 'Raja Electrical Works',
  phone: '91 83101 93407',
  email: 'rajaeleworkscmy@gmail.com',
  area: 'N.R. Extension Behind BESCOM Office , Chintamani-563 125 , Karnataka, India',
}

export default function Footer() {
  return (
    
<footer className="bg-[#1E293B] text-white  py-2">
 <div className="max-w-6xl mx-auto px-4 py-0 grid gap-4 md:grid-cols-4">

        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <Zap className="text-orange-400" /> {INFO.name}
          </div>
          <p className="mt-3 text-sm">
            Electrical contracting, solar and power distribution solutions.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Quick links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-orange-300">About Us</Link></li>
            <li><Link to="/services" className="hover:text-orange-300">Services</Link></li>
            <li><Link to="/projects" className="hover:text-orange-300">Projects</Link></li>
            <li><Link to="/contact" className="hover:text-orange-300">Contact</Link></li>
            <li><Link to="/login" className="hover:text-orange-300">Admin login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={16} /> {INFO.phone}</li>
            <li className="flex items-center gap-2"><Mail size={16} /> {INFO.email}</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> {INFO.area}</li>
       
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Licence</h4>
          <p className="mt-3 text-sm">
            Licence details will be added after verification from the official document.
          </p>
        </div>
      </div>
      <div className="border-t border-blue-900 py-4 text-center text-xs">
        © {new Date().getFullYear()} {INFO.name}. All rights reserved.
      </div>
    </footer>
  )
}