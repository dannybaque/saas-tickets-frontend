import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

function Categories({ token }) {
  const { theme } = useTheme()
  const [categories, setCategories] = useState([])
  const [roles, setRoles]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [name, setName]             = useState('')
  const [roleId, setRoleId]         = useState('')
  const [creating, setCreating]     = useState(false)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`, { headers })
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API}/roles`, { headers })
      setRoles(res.data)
      if (res.data.length > 0) setRoleId(res.data[0].id)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchRoles()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async () => {
    if (!name || !roleId) return
    setCreating(true)
    try {
      await axios.post(`${API}/categories`, {
        name,
        target_role_id: roleId
      }, { headers })
      setName('')
      fetchCategories()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/categories/${id}`, { headers })
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Cargando categorías...</p>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px', color: theme.text }}>
      <h2 style={{ color: theme.text, marginBottom: 20 }}>Gestión de Categorías</h2>

      <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, padding: 20, borderRadius: 10, marginBottom: 24 }}>
        <h4 style={{ marginBottom: 12, color: theme.text }}>Nueva Categoría</h4>
        <input
          placeholder='Nombre de categoría'
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 8, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}
        />
        <select
          value={roleId}
          onChange={e => setRoleId(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 12, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name} — Nivel {role.level}</option>
          ))}
        </select>
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{ width: '100%',padding: '10px 20px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
          {creating ? 'Creando...' : 'Crear Categoría'}
        </button>
      </div>

      {categories.length === 0
        ? <p style={{ color: theme.textMuted }}>No hay categorías aún.</p>
        : categories.map(cat => (
          <div key={cat.id} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: theme.text }}>{cat.name}</strong>
              <button
                onClick={() => handleDelete(cat.id)}
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

export default Categories
