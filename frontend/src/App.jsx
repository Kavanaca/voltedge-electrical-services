import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Login from './pages/Login'
import EnquiriesPage from './features/enquiries/EnquiriesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="enquiries" replace />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}