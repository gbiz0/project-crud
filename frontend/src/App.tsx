import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import { isAuthenticated } from './services/auth'
import Register from './pages/Register'
import Fornecedores from './pages/Fornecedores'
import ContasPagar from './pages/ContasPagar'

function App() {
  const RequireAuth = ({ children }: { children: ReactElement }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />
    }
    return children
  }
  const PublicOnly = ({ children }: { children: ReactElement }) => {
    if (isAuthenticated()) {
      return <Navigate to="/" replace />
    }
    return children
  }
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/fornecedores" element={<RequireAuth><Fornecedores /></RequireAuth>} />
      <Route path="/contas-pagar" element={<RequireAuth><ContasPagar /></RequireAuth>} />
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  )
}

export default App
