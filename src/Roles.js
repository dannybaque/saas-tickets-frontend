import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

function Roles({ token }) {
  const { theme } = useTheme()
  const [roles, setRoles]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [name, setName]         = useState('')
  const [level, setLevel]       = useState('')
  const [creating, setCreating] = useState(false)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API}/roles`, { headers })
      setRoles(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async () => {
    if (!name || !level) return
    setCreating(true)
    try {
      await axios.post(`${API}/roles`, { name, level: parseInt(level) }, { headers })
      setName('')
      setLevel('')
      fetchRoles()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/roles/${id}`, { headers })
      fetchRoles()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Cargando roles...</p>

return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px', color: theme.text }}>
      <h2 style={{ color: theme.text, marginBottom: 20 }}>Gestión de Roles</h2>

      <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, padding: 20, borderRadius: 10, marginBottom: 24 }}>
        <h4 style={{ marginBottom: 12, color: theme.text }}>Nuevo Rol</h4>
        <input
          placeholder='Nombre del rol'
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 8, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}
        />
        <input
          type='number'
          placeholder='Nivel (1=base, 2=medio, 3=alto)'
          value={level}
          onChange={e => setLevel(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 12, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}
        />
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{ width: '100%',padding: '10px 20px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
          {creating ? 'Creando...' : 'Crear Rol'}
        </button>
      </div>

      {roles.length === 0
        ? <p style={{ color: theme.textMuted }}>No hay roles aún.</p>
        : roles.map(role => (
          <div key={role.id} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <strong style={{ color: theme.text }}>{role.name}</strong>
                <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: theme.bgSecondary, color: theme.textMuted }}>
                  Nivel {role.level}
                </span>
              </div>
              <button
                onClick={() => handleDelete(role.id)}
                style={{ padding: '6px 14px', background: 'transparent', color: '#f76a8a', border: '1px solid #f76a8a', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                Eliminar
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )

}

export default Roles
