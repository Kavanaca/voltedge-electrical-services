import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Quote from './pages/Quote'
import Login from './pages/Login'
import EnquiriesPage from './features/enquiries/EnquiriesPage'
import QuotationsPage from './features/quotations/QuotationsPage'
import QuotationFormPage from './features/quotations/QuotationFormPage'
import QuotationDetailPage from './features/quotations/QuotationDetailPage'
import ProjectsPage from './features/projects/ProjectsPage'
import ProjectFormPage from './features/projects/ProjectFormPage'
import ProjectDetailPage from './features/projects/ProjectDetailPage'
import EmployeesPage from './features/employees/EmployeesPage'
import InvoicesPage from './features/invoices/InvoicesPage'
import InvoiceFormPage from './features/invoices/InvoiceFormPage'
import InvoiceDetailPage from './features/invoices/InvoiceDetailPage'
import SolarPage from './features/solar/SolarPage'
import SolarFormPage from './features/solar/SolarFormPage'
import DocumentsPage from './features/documents/DocumentsPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
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
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/new" element={<InvoiceFormPage />} />
            <Route path="invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="solar" element={<SolarPage />} />
            <Route path="solar/new" element={<SolarFormPage />} />
            <Route path="solar/:id/edit" element={<SolarFormPage />} />
            <Route path="documents" element={<DocumentsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}