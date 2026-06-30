import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import StudentsPage from './pages/Students'
import ExamsPage from './pages/Exams'
import ResultsPage from './pages/Results'
import UploadPage from './pages/Upload'
import AiGrading from './pages/AiGrading'
import ReportsPage from './pages/Reports'
import Login from './pages/LoginTemp'
import About from './pages/About'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './styles.css'

function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Topbar />
        <main className="p-6 pt-20 lg:pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute allowedRoles={['admin']}><StudentsPage /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute allowedRoles={['admin', 'student']}><ExamsPage /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute allowedRoles={['admin', 'student']}><ResultsPage /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute allowedRoles={['admin']}><UploadPage /></ProtectedRoute>} />
            <Route path="/aigrading" element={<ProtectedRoute allowedRoles={['admin']}><AiGrading /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
//create root
