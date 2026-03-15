import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import Tickets from './Tickets'
import TicketDetail from './TicketDetail'
import Users from './Users'
import Roles from './Roles'
import Categories from './Categories'


function App() {
  const [token, setToken]               = useState(null)
  const [selectedId, setSelectedId]     = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [view, setView]                 = useState('tickets')

  return (
    <div>
      {!token && !showRegister && <Login onLogin={setToken} onSwitchToRegister={() => setShowRegister(true)} />}
      {!token && showRegister && <Register onRegister={setToken} onSwitchToLogin={() => setShowRegister(false)} />}
      {token && (
        <div>
          <div style={{ background: '#12121a', padding: '12px 20px', display: 'flex', gap: 12 }}>
            <button
              onClick={() => setView('tickets')}
              style={{ padding: '6px 16px', background: view === 'tickets' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
              Tickets
            </button>
            <button
              onClick={() => { setView('users'); setSelectedId(null) }}
              style={{ padding: '6px 16px', background: view === 'users' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
              Usuarios
            </button>
            <button
              onClick={() => { setView('roles'); setSelectedId(null) }}
              style={{ padding: '6px 16px', background: view === 'roles' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
              Roles
            </button>
            <button
              onClick={() => { setView('categories'); setSelectedId(null) }}
              style={{ padding: '6px 16px', background: view === 'categories' ? '#7c6af7' : 'transparent', color: 'white', border: '1px solid #7c6af7', borderRadius: 4, cursor: 'pointer' }}>
              Categorias
            </button>
          </div>
          {view === 'tickets' && !selectedId && <Tickets token={token} onSelect={setSelectedId} />}
          {view === 'tickets' && selectedId && <TicketDetail token={token} ticketId={selectedId} onBack={() => setSelectedId(null)} />}
          {view === 'users' && <Users token={token} />}
          {view === 'roles' && <Roles token={token} />}
          {view === 'categories' && <Categories token={token} />}
        </div>
      )}
    </div>
  )

}

export default App
