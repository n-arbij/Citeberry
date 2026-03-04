import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import AuthGuard from './pages/AuthGuard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* /dashboard = roaming guard (no org yet) */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* role-specific dashboards, wrapped in auth guard */}
        <Route path="/admin" element={<AuthGuard role="admin"><AdminDashboard /></AuthGuard>} />
        <Route path="/user"  element={<AuthGuard role="user"><UserDashboard /></AuthGuard>} />
      </Routes>
    </BrowserRouter>
  )
}
