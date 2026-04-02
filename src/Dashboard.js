import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

function Dashboard({ token, onSelectTicket }) {
  const { theme } = useTheme()
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
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px', color: theme.text }}>
      <h2 style={{ color: theme.text, marginBottom: 4 }}>Dashboard</h2>
      <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 20 }}>Resumen de actividad</p>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, padding: '16px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#6af7c2', margin: 0, lineHeight: 1 }}>{data.open}</p>
          <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>Abiertos</p>
        </div>
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, padding: '16px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#f7a06a', margin: 0, lineHeight: 1 }}>{data.assigned}</p>
          <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>Asignados</p>
        </div>
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, padding: '16px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#7c6af7', margin: 0, lineHeight: 1 }}>{data.resolved}</p>
          <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>Resueltos</p>
        </div>
      </div>

      {/* Actividad reciente */}
      <h4 style={{ marginBottom: 12, color: theme.text, fontSize: 14, fontWeight: 600 }}>Actividad reciente</h4>
      {data.recent.map(ticket => (
        <div key={ticket.id}
          onClick={() => onSelectTicket(ticket.id)}
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 8, padding: '12px 14px',
            marginBottom: 8, cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'opacity 0.15s'
          }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
            <strong style={{ fontSize: 14, color: theme.text, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ticket.title}</strong>
            <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
              {ticket.created_by_name} · {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
          <span style={{ background: statusColor[ticket.status], padding: '2px 8px', borderRadius: 20, fontSize: 11, flexShrink: 0, color: '#000' }}>
            {ticket.status}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
