import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import Tickets from './Tickets'
import TicketDetail from './TicketDetail'
import Users from './Users'
import Roles from './Roles'
import Categories from './Categories'
import Permissions from './Permissions'
import Dashboard from './Dashboard'


function App() {
  const [token, setToken]                     = useState(null)
  const [selectedId, setSelectedId]           = useState(null)
  const [showRegister, setShowRegister]       = useState(false)
  const [view, setView]                       = useState('dashboard')
  const [userPermissions, setUserPermissions] = useState([])

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

  return (
    <div>
      {!token && !showRegister && <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />}
      {!token && showRegister && <Register onRegister={handleLogin} onSwitchToLogin={() => setShowRegister(false)} />}
      {token && (
        <div>
          <div style={{ background: '#12121a', padding: '12px 20px', display: 'flex', gap: 12 }}>
            <button
              onClick={() => setView('dashboard')}
              style={{ padding: '6px 16px', background: view === 'dashboard' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
              Inicio
            </button>
            <button
              onClick={() => setView('tickets')}
              style={{ padding: '6px 16px', background: view === 'tickets' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
              Tickets
            </button>
            {userPermissions.includes('manage_users') && 
              <button
                onClick={() => { setView('users'); setSelectedId(null) }}
                style={{ padding: '6px 16px', background: view === 'users' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
                Usuarios
              </button>
            }
            {userPermissions.includes('manage_roles') && 
              <button
                onClick={() => { setView('roles'); setSelectedId(null)  } }
                style={{ padding: '6px 16px', background: view === 'roles' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
                Roles
              </button>
            }
            {userPermissions.includes('manage_categories') && 
              <button
                onClick={() => { setView('categories'); setSelectedId(null) }}
                style={{ padding: '6px 16px', background: view === 'categories' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
                Categorias
              </button>
            }
            {userPermissions.includes('manage_roles') && 
              <button
                onClick={() => { setView('permissions'); setSelectedId(null) }}
                style={{ padding: '6px 16px', background: view === 'permissions' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
                Permisos
              </button>
            }
          </div>
          {view === 'tickets' && !selectedId && <Tickets token={token} onSelect={setSelectedId} permissions={userPermissions} />}
          {view === 'tickets' && selectedId && <TicketDetail token={token} ticketId={selectedId} onBack={() => setSelectedId(null)} permissions={userPermissions} />}
          {view === 'users' && <Users token={token} />}
          {view === 'roles' && <Roles token={token} />}
          {view === 'categories' && <Categories token={token} />}
          {view === 'permissions' && <Permissions token={token} />}
          {view === 'dashboard' && <Dashboard token={token} onSelectTicket={(id) => { setSelectedId(id); setView('tickets') }} />}
            
        </div>
      )}
    </div>
  )

}

export default App
