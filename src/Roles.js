import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

function Roles({ token }) {
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
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Gestión de Roles</h2>
      <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginTop: 20, marginBottom: 30 }}>
        <h4 style={{ marginBottom: 12 }}>Nuevo Rol</h4>
        <input
          placeholder='Nombre del rol'
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}
        />
        <input
          type='number'
          placeholder='Nivel (1=base, 2=medio, 3=alto)'
          value={level}
          onChange={e => setLevel(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}
        />
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{ padding: '8px 20px', background: '#7c6af7', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14 }}>
          {creating ? 'Creando...' : 'Crear Rol'}
        </button>
      </div>
      {roles.length === 0
        ? <p>No hay roles aún.</p>
        : roles.map(role => (
          <div key={role.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{role.name}</strong>
                <span style={{ marginLeft: 12, fontSize: 12, color: '#999' }}>Nivel {role.level}</span>
              </div>
              <button
                onClick={() => handleDelete(role.id)}
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

export default Roles
