import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import Tickets from './Tickets'
import TicketDetail from './TicketDetail'

function App() {
  const [token, setToken]               = useState(null)
  const [selectedId, setSelectedId]     = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div>
      {!token && !showRegister && <Login onLogin={setToken} onSwitchToRegister={()=>setShowRegister(true)}/>}
      {!token && showRegister && <Register onRegister={setToken} onSwitchToLogin={()=>setShowRegister(false)}/>}
      {token && !selectedId && <Tickets token={token} onSelect={setSelectedId} />}
      {token && selectedId && <TicketDetail token={token} ticketId={selectedId} onBack={() => setSelectedId(null)} />}
    </div>
  )
}

export default App
