import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://saas-tickets-backend-production.up.railway.app/api'


function Tickets({ token, onSelect }) {
  const [tickets, setTickets]       = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId]   = useState('')
  const [creating, setCreating]       = useState(false)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API}/tickets`, { headers })
      setTickets(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`, { headers })
      setCategories(res.data)
      if (res.data.length > 0) setCategoryId(res.data[0].id)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTickets()
    fetchCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async () => {
    if (!title || !categoryId) return
    setCreating(true)
    try {
      await axios.post(`${API}/tickets`, {
        title,
        description,
        category_id: categoryId,
        priority: 'medium'
      }, { headers })
      setTitle('')
      setDescription('')
      fetchTickets()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const statusColor = {
    open:        '#6af7c2',
    in_progress: '#f7a06a',
    resolved:    '#7c6af7',
    closed:      '#5a5a7a'
  }

  if (loading) return <p style={{ padding: 40 }}>Cargando tickets...</p>

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Tickets</h2>

      {/* Formulario nuevo ticket */}
      <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginTop: 20, marginBottom: 30 }}>
        <h4 style={{ marginBottom: 12 }}>Nuevo ticket</h4>
        <input
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14, height: 80 }}
        />
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{ padding: '8px 20px', background: '#7c6af7', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14 }}
        >
          {creating ? 'Creando...' : 'Crear ticket'}
        </button>
      </div>

      {/* Lista de tickets */}
      {tickets.length === 0
        ? <p>No hay tickets aún.</p>
        : tickets.map(ticket => (
          <div key={ticket.id}
            onClick={() => onSelect(ticket.id)}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{ticket.title}</strong>
              <span style={{
                background: statusColor[ticket.status],
                padding: '2px 10px', borderRadius: 20,
                fontSize: 12, color: '#000'
              }}>
                {ticket.status}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: 13, marginTop: 6 }}>{ticket.description}</p>
            <p style={{ color: '#999', fontSize: 11, marginTop: 4 }}>
              Prioridad: {ticket.priority} · Creado: {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      }
    </div>
  )
}

export default Tickets
