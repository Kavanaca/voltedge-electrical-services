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
import QuotationsPage from './features/quotations/QuotationsPage'
import QuotationFormPage from './features/quotations/QuotationFormPage'
import QuotationDetailPage from './features/quotations/QuotationDetailPage'
import ProjectsPage from './features/projects/ProjectsPage'
import ProjectFormPage from './features/projects/ProjectFormPage'
import ProjectDetailPage from './features/projects/ProjectDetailPage'
import EmployeesPage from './features/employees/EmployeesPage'

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
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="quotations/new" element={<QuotationFormPage />} />
          <Route path="quotations/:id" element={<QuotationDetailPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<ProjectFormPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="employees" element={<EmployeesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}