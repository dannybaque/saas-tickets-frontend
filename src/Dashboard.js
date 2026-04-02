import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

function Dashboard({ token, onSelectTicket }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${API}/dashboard`, { headers })
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusColor = {
    open:        '#6af7c2',
    in_progress: '#f7a06a',
    resolved:    '#7c6af7',
    closed:      '#5a5a7a'
  }

  if (loading) return <p style={{ padding: 40 }}>Cargando dashboard...</p>
  if (!data)   return <p style={{ padding: 40 }}>Error al cargar.</p>

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Dashboard</h2>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24, marginBottom: 32 }}>
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: '#6af7c2', margin: 0 }}>{data.open}</p>
          <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Tickets abiertos</p>
        </div>
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: '#f7a06a', margin: 0 }}>{data.assigned}</p>
          <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Asignados a mí</p>
        </div>
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: '#7c6af7', margin: 0 }}>{data.resolved}</p>
          <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Resueltos esta semana</p>
        </div>
      </div>

      {/* Actividad reciente */}
      <h4 style={{ marginBottom: 12 }}>Actividad reciente</h4>
      {data.recent.map(ticket => (
        <div key={ticket.id}
          onClick={() => onSelectTicket(ticket.id)}
          style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 10, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: 14 }}>{ticket.title}</strong>
            <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              {ticket.created_by_name} · {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
          <span style={{ background: statusColor[ticket.status], padding: '2px 10px', borderRadius: 20, fontSize: 11 }}>
            {ticket.status}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
