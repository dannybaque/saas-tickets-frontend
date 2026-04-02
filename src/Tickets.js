import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

function Tickets({ token, onSelect, permissions }) {
  const { theme } = useTheme()
  const [tickets, setTickets]       = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId]   = useState('')
  const [creating, setCreating]       = useState(false)
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)



  const headers = { Authorization: `Bearer ${token}` }

  const fetchTickets = async () => {
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (filterStatus) params.status = filterStatus
      if (filterPriority) params.priority = filterPriority

      const res = await axios.get(`${API}/tickets`, { headers, params })
      setTickets(res.data.data)
      setTotalPages(res.data.totalPages)
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
  }, [page])


  const handleCreate = async () => {
    if (!title) {
      alert('El título es obligatorio')
      return
    }
    if (!categoryId) {
      alert('Debes seleccionar una categoría')
      return
    }
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
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px', color: theme.text, background: theme.bg, minHeight: '100vh' }}>
      <h2 style={{ color: theme.text, marginBottom: 20 }}>Tickets</h2>

      {/* Formulario nuevo ticket */}
      {permissions.includes('create_ticket') && (
        <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, padding: 20, borderRadius: 10, marginBottom: 24 }}>
          <h4 style={{ marginBottom: 12, color: theme.text }}>Nuevo ticket</h4>
          <input
            placeholder="Título"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', marginBottom: 8, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', marginBottom: 8, fontSize: 14, height: 80, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box', resize: 'vertical' }}
          />
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', marginBottom: 12, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={handleCreate}
            disabled={creating}
            style={{ width: '100%',padding: '10px 12px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            {creating ? 'Creando...' : 'Crear ticket'}
          </button>
        </div>
      )}

      {/* Búsqueda y filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder='Buscar por título...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '10px 12px', fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '10px 12px', fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText }}>
          <option value=''>Todos los estados</option>
          <option value='open'>Abierto</option>
          <option value='in_progress'>En progreso</option>
          <option value='resolved'>Resuelto</option>
          <option value='closed'>Cerrado</option>
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          style={{ padding: '10px 12px', fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText }}>
          <option value=''>Todas las prioridades</option>
          <option value='low'>Baja</option>
          <option value='medium'>Media</option>
          <option value='high'>Alta</option>
        </select>
        <button
          onClick={fetchTickets}
          style={{ width: '100%',padding: '10px 12px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
          Buscar
        </button>
      </div>

      {/* Lista de tickets */}
      {tickets.length === 0
        ? <p style={{ color: theme.textMuted }}>No hay tickets aún.</p>
        : tickets.map(ticket => (
          <div key={ticket.id}
            onClick={() => onSelect(ticket.id)}
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, padding: 16, marginBottom: 10, cursor: 'pointer', transition: 'opacity 0.15s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: theme.text }}>{ticket.title}</strong>
              <span style={{ background: statusColor[ticket.status], padding: '2px 10px', borderRadius: 20, fontSize: 12, color: '#000', flexShrink: 0, marginLeft: 8 }}>
                {ticket.status}
              </span>
            </div>
            <p style={{ color: theme.textMuted, fontSize: 13, marginTop: 6 }}>{ticket.description}</p>
            <p style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>
              Prioridad: {ticket.priority} · Creado: {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      }

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            style={{ padding: '6px 16px', background: page === 1 ? theme.bgSecondary : '#7c6af7', color: page === 1 ? theme.textMuted : 'white', border: `1px solid ${theme.border}`, borderRadius: 6, cursor: page === 1 ? 'default' : 'pointer', fontSize: 14 }}>
            Anterior
          </button>
          <span style={{ padding: '6px 12px', fontSize: 14, color: theme.textMuted }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            style={{ padding: '6px 16px', background: page === totalPages ? theme.bgSecondary : '#7c6af7', color: page === totalPages ? theme.textMuted : 'white', border: `1px solid ${theme.border}`, borderRadius: 6, cursor: page === totalPages ? 'default' : 'pointer', fontSize: 14 }}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  )


}

export default Tickets
