import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://saas-tickets-backend-production.up.railway.app/api'

function Categories({ token }) {
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
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Gestión de Categorías</h2>
      <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginTop: 20, marginBottom: 30 }}>
        <h4 style={{ marginBottom: 12 }}>Nueva Categoría</h4>
        <input
          placeholder='Nombre de categoría'
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}
        />
        <select
          value={roleId}
          onChange={e => setRoleId(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name} — Nivel {role.level}</option>
          ))}
        </select>
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{ padding: '8px 20px', background: '#7c6af7', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14 }}>
          {creating ? 'Creando...' : 'Crear Categoría'}
        </button>
      </div>
      {categories.length === 0
        ? <p>No hay categorías aún.</p>
        : categories.map(cat => (
          <div key={cat.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{cat.name}</strong>
              <button
                onClick={() => handleDelete(cat.id)}
                style={{ padding: '4px 12px', background: '#f76a8a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
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
