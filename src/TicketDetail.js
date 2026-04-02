import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

function TicketDetail({ token, ticketId, onBack, permissions }) {
  const { theme } = useTheme()
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (err.response?.status === 403) {
        alert('No tienes permisos para asignarte este ticket')
      }
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
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px', color: theme.text }}>

      {/* Back */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c6af7', fontSize: 14, marginBottom: 16, fontWeight: 600, padding: 0 }}>
        ← Volver
      </button>

      {/* Card principal */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <h2 style={{ color: theme.text, margin: 0, fontSize: 20, fontWeight: 700, flex: 1 }}>{ticket.title}</h2>
          <span style={{ background: statusColor[ticket.status], padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#000', flexShrink: 0 }}>
            {ticket.status}
          </span>
        </div>

        {ticket.description && (
          <p style={{ color: theme.textMuted, marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>{ticket.description}</p>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: theme.textMuted, background: theme.bgSecondary, padding: '4px 10px', borderRadius: 6 }}>
            Prioridad: <strong style={{ color: theme.text }}>{ticket.priority}</strong>
          </span>
          <span style={{ fontSize: 12, color: theme.textMuted, background: theme.bgSecondary, padding: '4px 10px', borderRadius: 6 }}>
            Creado: <strong style={{ color: theme.text }}>{new Date(ticket.created_at).toLocaleDateString()}</strong>
          </span>
          <span style={{ fontSize: 12, color: theme.textMuted, background: theme.bgSecondary, padding: '4px 10px', borderRadius: 6 }}>
            Por: <strong style={{ color: theme.text }}>{ticket.created_by_name}</strong>
          </span>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
          {!ticket.assigned_to && permissions.includes('assign_ticket') && (
            <button onClick={handleAssign}
              style={{ padding: '8px 18px', background: '#6af7c2', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#000' }}>
              ✋ Asignarme
            </button>
          )}
          {ticket.status !== 'resolved' && permissions.includes('change_status') && (
            <button onClick={() => handleStatus('resolved')}
              style={{ padding: '8px 18px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              ✓ Marcar resuelto
            </button>
          )}
          {ticket.status !== 'closed' && permissions.includes('change_status') && (
            <button onClick={() => handleStatus('closed')}
              style={{ padding: '8px 18px', background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              Cerrar ticket
            </button>
          )}
        </div>
      </div>

      {/* Comentarios */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h4 style={{ color: theme.text, marginBottom: 16, fontSize: 15, fontWeight: 700 }}>💬 Comentarios</h4>

        {ticket.comments.length === 0
          ? <p style={{ color: theme.textMuted, fontSize: 13 }}>Sin comentarios aún.</p>
          : ticket.comments.map(c => (
            <div key={c.id} style={{ borderLeft: `3px solid #7c6af7`, paddingLeft: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ fontSize: 13, color: theme.text }}>{c.author}</strong>
                <span style={{ fontSize: 11, color: theme.textMuted }}>{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: 14, color: theme.text, lineHeight: 1.5 }}>{c.body}</p>
            </div>
          ))
        }

        {permissions.includes('add_comment') && (
          <div style={{ marginTop: 16, borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
            <textarea
              placeholder="Escribe un comentario..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', fontSize: 14, height: 80, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box', resize: 'vertical' }}
            />
            <button onClick={handleComment} disabled={sending}
              style={{ padding: '8px 20px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 8 }}>
              {sending ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        )}
      </div>

      {/* Historial */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: 24, marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h4 style={{ color: theme.text, marginBottom: 16, fontSize: 15, fontWeight: 700 }}>📋 Historial</h4>
        {ticket.events.map((e, i) => (
          <div key={e.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14, position: 'relative' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c6af7', marginTop: 4, flexShrink: 0, zIndex: 1 }} />
            {i < ticket.events.length - 1 && (
              <div style={{ position: 'absolute', left: 4, top: 14, width: 2, height: '100%', background: theme.border }} />
            )}
            <div>
              <p style={{ fontSize: 13, color: theme.text, margin: 0 }}>
                <strong>{e.by}</strong> — {e.event_type.replace(/_/g, ' ')}
              </p>
              <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{new Date(e.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )


}

export default TicketDetail
