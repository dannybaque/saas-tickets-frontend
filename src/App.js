import { useState } from 'react'
import Login from './Login'
import Tickets from './Tickets'
import TicketDetail from './TicketDetail'

function App() {
  const [token, setToken]         = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div>
      {!token && <Login onLogin={setToken} />}
      {token && !selectedId && <Tickets token={token} onSelect={setSelectedId} />}
      {token && selectedId && <TicketDetail token={token} ticketId={selectedId} onBack={() => setSelectedId(null)} />}
    </div>
  )
}

export default App
