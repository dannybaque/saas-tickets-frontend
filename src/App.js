import { useTheme } from './ThemeContext'
import { useState,useEffect } from 'react'
import './App.css'
import Login from './Login'
import Register from './Register'
import Tickets from './Tickets'
import TicketDetail from './TicketDetail'
import Users from './Users'
import Roles from './Roles'
import Categories from './Categories'
import Permissions from './Permissions'
import Dashboard from './Dashboard'
import Reports from './Reports'
import axios from 'axios'





function App() {
  const { theme, mode, toggleTheme }          = useTheme()
  const [menuOpen, setMenuOpen]               = useState(false)
  const [token, setToken]                     = useState(null)
  const [selectedId, setSelectedId]           = useState(null)
  const [showRegister, setShowRegister]       = useState(false)
  const [view, setView]                       = useState('dashboard')
  const [userPermissions, setUserPermissions] = useState([])
  const [trialExpired, setTrialExpired] = useState(false)

  





  const handleLogin = async (token) => {
  setToken(token)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const res = await fetch(`${process.env.REACT_APP_API}/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const perms = await res.json()
      const userPerms = perms
        .filter(p => p.level === payload.level && p.allowed)
        .map(p => p.action)
      setUserPermissions(userPerms)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUserPermissions([])
    setView('dashboard')
  }
  const refreshPermissions = async () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const res = await fetch(`${process.env.REACT_APP_API}/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const perms = await res.json()
      const userPerms = perms
        .filter(p => p.level === payload.level && p.allowed)
        .map(p => p.action)
      setUserPermissions(userPerms)
    } catch (err) {
      console.error(err)
    }
  }


  useEffect(() => {
  const interceptor = axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 402) {
        setTrialExpired(true)
      }
      return Promise.reject(error)
    }
  )
  return () => axios.interceptors.response.eject(interceptor)
}, [])


  return (
    
<div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, transition: 'background 0.3s, color 0.3s' }}>
            {trialExpired && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 40, maxWidth: 400, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>⏰</p>
            <h2 style={{ marginBottom: 12 }}>Tu período de prueba terminó</h2>
            <p style={{ color: '#666', marginBottom: 24, fontSize: 15 }}>Contáctanos para activar tu plan y seguir usando Dysior.</p>
            <a href='mailto:hola@dysior.com'
              style={{ display: 'block', padding: '12px 24px', background: '#7c6af7', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
              Contactar a hola@dysior.com
            </a>
          </div>
        </div>
      )}

      {!token && !showRegister && <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />}
      {!token && showRegister && <Register onRegister={handleLogin} onSwitchToLogin={() => setShowRegister(false)} />}
      {token && (
        <div>
          <div style={{ background: '#12121a', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>Dysior</span>

            {/* Botón hamburguesa */}
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>
              {menuOpen ? '✕' : '☰'}
            </button>

            {/* Menú desktop */}
            <div className="menu-desktop">
              <button className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>Inicio</button>
              <button className={`nav-btn ${view === 'tickets' ? 'active' : ''}`} onClick={() => setView('tickets')}>Tickets</button>
              {userPermissions.includes('manage_users') && <button className={`nav-btn ${view === 'users' ? 'active' : ''}`} onClick={() => { setView('users'); setSelectedId(null) }}>Usuarios</button>}
              {userPermissions.includes('manage_roles') && <button className={`nav-btn ${view === 'roles' ? 'active' : ''}`} onClick={() => { setView('roles'); setSelectedId(null) }}>Roles</button>}
              {userPermissions.includes('manage_categories') && <button className={`nav-btn ${view === 'categories' ? 'active' : ''}`} onClick={() => { setView('categories'); setSelectedId(null) }}>Categorías</button>}
              {userPermissions.includes('manage_roles') && <button className={`nav-btn ${view === 'permissions' ? 'active' : ''}`} onClick={() => { setView('permissions'); setSelectedId(null) }}>Permisos</button>}
              {userPermissions.includes('manage_roles') && <button className={`nav-btn ${view === 'reports' ? 'active' : ''}`} onClick={() => { setView('reports'); setSelectedId(null) }}>Reportes</button>}
              <button className="nav-btn danger" onClick={handleLogout}>Cerrar sesión</button>
              <button
                className="nav-btn"
                onClick={toggleTheme}
                style={{ fontSize: 18, padding: '4px 10px' }}>
                {mode === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          <div className={`menu-mobile ${menuOpen ? 'open' : ''}`}>
            <button className={`mobile-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => { setView('dashboard'); setMenuOpen(false) }}>Inicio</button>
            <button className={`mobile-btn ${view === 'tickets' ? 'active' : ''}`} onClick={() => { setView('tickets'); setMenuOpen(false) }}>Tickets</button>
            {userPermissions.includes('manage_users') && <button className={`mobile-btn ${view === 'users' ? 'active' : ''}`} onClick={() => { setView('users'); setSelectedId(null); setMenuOpen(false) }}>Usuarios</button>}
            {userPermissions.includes('manage_roles') && <button className={`mobile-btn ${view === 'roles' ? 'active' : ''}`} onClick={() => { setView('roles'); setSelectedId(null); setMenuOpen(false) }}>Roles</button>}
            {userPermissions.includes('manage_categories') && <button className={`mobile-btn ${view === 'categories' ? 'active' : ''}`} onClick={() => { setView('categories'); setSelectedId(null); setMenuOpen(false) }}>Categorías</button>}
            {userPermissions.includes('manage_roles') && <button className={`mobile-btn ${view === 'permissions' ? 'active' : ''}`} onClick={() => { setView('permissions'); setSelectedId(null); setMenuOpen(false) }}>Permisos</button>}
            {userPermissions.includes('manage_roles') && <button className={`mobile-btn ${view === 'reports' ? 'active' : ''}`} onClick={() => { setView('reports'); setSelectedId(null); setMenuOpen(false) }}>Reportes</button>}
            <button className="mobile-btn danger" onClick={() => { handleLogout(); setMenuOpen(false) }}>Cerrar sesión</button>
            <button className="mobile-btn" onClick={() => { toggleTheme(); setMenuOpen(false) }}>
              {mode === 'light' ? '🌙 Modo oscuro' : '☀️ Modo claro'}
            </button>
          </div>

          {view === 'tickets' && !selectedId && <Tickets token={token} onSelect={setSelectedId} permissions={userPermissions} />}
          {view === 'tickets' && selectedId && <TicketDetail token={token} ticketId={selectedId} onBack={() => setSelectedId(null)} permissions={userPermissions} />}
          {view === 'users' && <Users token={token} />}
          {view === 'roles' && <Roles token={token} />}
          {view === 'categories' && <Categories token={token} />}
          {view === 'permissions' && <Permissions token={token} onPermissionChange={refreshPermissions} />}
          {view === 'dashboard' && <Dashboard token={token} onSelectTicket={(id) => { setSelectedId(id); setView('tickets') }} />}
          {view === 'reports' && <Reports token={token} />}

        </div>
      )}
    </div>
  )

}

export default App
