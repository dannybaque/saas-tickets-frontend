import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3000/api'

function TicketDetail({ token, ticketId, onBack }) {
  const [ticket, setTicket]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`${API}/tickets/${ticketId}`, { headers })
      setTicket(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  const handleComment = async () => {
    if (!comment) return
    setSending(true)
    try {
      await axios.post(`${API}/tickets/${ticketId}/comments`,
        { body: comment, is_internal: false },
        { headers }
      )
      setComment('')
      fetchTicket()
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const handleStatus = async (status) => {
    try {
      await axios.put(`${API}/tickets/${ticketId}/status`,
        { status },
        { headers }
      )
      fetchTicket()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAssign = async () => {
    try {
      await axios.put(`${API}/tickets/${ticketId}/assign`,
        {},
        { headers }
      )
      fetchTicket()
    } catch (err) {
      console.error(err)
    }
  }

  const statusColor = {
    open:        '#6af7c2',
    in_progress: '#f7a06a',
    resolved:    '#7c6af7',
    closed:      '#5a5a7a'
  }

  if (loading) return <p style={{ padding: 40 }}>Cargando...</p>
  if (!ticket) return <p style={{ padding: 40 }}>Ticket no encontrado</p>

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>

      {/* Header */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c6af7', fontSize: 14, marginBottom: 20 }}>
        ← Volver
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2>{ticket.title}</h2>
        <span style={{ background: statusColor[ticket.status], padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
          {ticket.status}
        </span>
      </div>

      <p style={{ color: '#666', marginTop: 8 }}>{ticket.description}</p>
      <p style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
        Prioridad: {ticket.priority} · Creado: {new Date(ticket.created_at).toLocaleDateString()}
      </p>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
        {!ticket.assigned_to && (
          <button onClick={handleAssign}
            style={{ padding: '6px 14px', background: '#6af7c2', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
            Asignarme
          </button>
        )}
        {ticket.status !== 'resolved' && (
          <button onClick={() => handleStatus('resolved')}
            style={{ padding: '6px 14px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
            Marcar resuelto
          </button>
        )}
        {ticket.status !== 'closed' && (
          <button onClick={() => handleStatus('closed')}
            style={{ padding: '6px 14px', background: '#5a5a7a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
            Cerrar ticket
          </button>
        )}
      </div>

      {/* Comentarios */}
      <div style={{ marginTop: 32 }}>
        <h4>Comentarios</h4>
        {ticket.comments.length === 0
          ? <p style={{ color: '#999', fontSize: 13 }}>Sin comentarios aún.</p>
          : ticket.comments.map(c => (
            <div key={c.id} style={{ background: '#f5f5f5', borderRadius: 6, padding: 12, marginTop: 10 }}>
              <strong style={{ fontSize: 13 }}>{c.author}</strong>
              <p style={{ fontSize: 13, marginTop: 4 }}>{c.body}</p>
              <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{new Date(c.created_at).toLocaleString()}</p>
            </div>
          ))
        }

        <div style={{ marginTop: 16 }}>
          <textarea
            placeholder="Escribe un comentario..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 14, height: 80, marginBottom: 8 }}
          />
          <button onClick={handleComment} disabled={sending}
            style={{ padding: '8px 20px', background: '#7c6af7', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            {sending ? 'Enviando...' : 'Comentar'}
          </button>
        </div>
      </div>

      {/* Historial */}
      <div style={{ marginTop: 32, marginBottom: 40 }}>
        <h4>Historial</h4>
        {ticket.events.map(e => (
          <div key={e.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c6af7', marginTop: 5, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13 }}>
                <strong>{e.by}</strong> — {e.event_type.replace('_', ' ')}
              </p>
              <p style={{ fontSize: 11, color: '#999' }}>{new Date(e.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default TicketDetail
