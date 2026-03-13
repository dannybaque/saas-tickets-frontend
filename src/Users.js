import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://saas-tickets-backend-production.up.railway.app/api'

function Users({ token }) {
  const [users, setUsers]       = useState([])
  const [roles, setRoles]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId]     = useState('')
  const [creating, setCreating] = useState(false)
  const headers = { Authorization: `Bearer ${token}` }

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, { headers })
      setUsers(res.data)
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
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async () => {
    if (!name || !email || !password) return
    setCreating(true)
    try {
      await axios.post(`${API}/users`, {
        name, email, password,
        role_id: roleId || null,
        is_active: true
      }, { headers })
      setName('')
      setEmail('')
      setPassword('')
      fetchUsers()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const handleStatus = async (id, is_active) => {
    try {
      await axios.put(`${API}/users/${id}/status`, { is_active: !is_active }, { headers })
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Cargando Usuarios...</p>

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Registro de Usuarios</h2>
      <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginTop: 20, marginBottom: 30 }}>
        <h4 style={{ marginBottom: 12 }}>Nuevo Usuario</h4>
        <input
          placeholder='Nombre'
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}
        />
        <input
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}
        />
        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}
        />
        <select
          value={roleId}
          onChange={e => setRoleId(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, fontSize: 14 }}>
          <option value=''>Sin rol asignado</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{ padding: '8px 20px', background: '#7c6af7', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14 }}>
          {creating ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>
      {users.length === 0
        ? <p>No hay usuarios aún.</p>
        : users.map(user => (
          <div key={user.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{user.name}</strong>
              <button
                onClick={() => handleStatus(user.id, user.is_active)}
                style={{ padding: '4px 12px', background: user.is_active ? '#f76a8a' : '#6af7c2', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                {user.is_active ? 'Inactivar' : 'Activar'}
              </button>
            </div>
            <p style={{ color: '#666', fontSize: 13, marginTop: 6 }}>{user.email}</p>
            <p style={{ color: '#999', fontSize: 11, marginTop: 4 }}>
              Creado: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      }
    </div>
  )
}

export default Users
