import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

function Users({ token }) {
  const { theme } = useTheme()
  const [users, setUsers]           = useState([])
  const [roles, setRoles]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [roleId, setRoleId]         = useState('')
  const [creating, setCreating]     = useState(false)
  const [selected, setSelected]     = useState(null)
  const [editName, setEditName]     = useState('')
  const [editRoleId, setEditRoleId] = useState('')
  const [editActive, setEditActive] = useState(true)
  const [saving, setSaving]         = useState(false)
  const [search, setSearch] = useState('')


  const headers = { Authorization: `Bearer ${token}` }

  const fetchUsers = async () => {
      try {
        const params = {}
        if (search) params.search = search
        const res = await axios.get(`${API}/users`, { headers, params })
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

  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`${API}/users/${id}`, { headers })
      setSelected(res.data)
      setEditName(res.data.name)
      setEditRoleId(res.data.role_id || '')
      setEditActive(res.data.is_active)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await axios.put(`${API}/users/${selected.id}`, {
        name: editName,
        role_id: editRoleId || null,
        is_active: editActive
      }, { headers })
      setSelected(null)
      fetchUsers()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Cargando Usuarios...</p>

 return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px', color: theme.text }}>
      <h2 style={{ color: theme.text, marginBottom: 20 }}>Gestión de Usuarios</h2>

      {/* Formulario nuevo usuario */}
      <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, padding: 20, borderRadius: 10, marginBottom: 24 }}>
        <h4 style={{ marginBottom: 12, color: theme.text }}>Nuevo Usuario</h4>
        <input placeholder='Nombre' value={name} onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 8, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }} />
        <input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 8, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }} />
        <input type='password' placeholder='Contraseña' value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 8, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }} />
        <select value={roleId} onChange={e => setRoleId(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 12, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}>
          <option value=''>Sin rol asignado</option>
          {roles.map(role => <option key={role.id} value={role.id}>{role.name} — Nivel {role.level}</option>)}
        </select>
        <button onClick={handleCreate} disabled={creating}
          style={{ width: '100%',padding: '10px 20px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
          {creating ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>

      {/* Búsqueda */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder='Buscar por nombre o email...' value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }} />
        <button onClick={fetchUsers}
          style={{ padding: '10px 16px', background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
          Buscar
        </button>
      </div>

      {/* Lista de usuarios */}
      <h4 style={{ marginBottom: 12, color: theme.text }}>Usuarios</h4>
      {users.length === 0
        ? <p style={{ color: theme.textMuted }}>No hay usuarios aún.</p>
        : users.map(user => (
          <div key={user.id} onClick={() => handleSelect(user.id)}
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, padding: 16, marginBottom: 10, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'opacity 0.15s' }}>
            <div>
              <strong style={{ color: theme.text }}>{user.name}</strong>
              <p style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>{user.email}</p>
              <p style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                {user.role_name ? `${user.role_name} — Nivel ${user.role_level}` : 'Sin rol asignado'}
              </p>
            </div>
            <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 20, background: user.is_active ? '#6af7c2' : '#f76a8a', color: '#000', flexShrink: 0 }}>
              {user.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        ))
      }

      {/* Panel de detalle */}
      {selected && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: 'min(360px, 100vw)', height: '100%', background: theme.cardBg, boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', padding: 24, overflowY: 'auto', zIndex: 100, borderLeft: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ margin: 0, color: theme.text, fontSize: 17 }}>Detalle de usuario</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: theme.textMuted }}>✕</button>
          </div>

          <p style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</p>
          <p style={{ fontSize: 14, marginBottom: 20, color: theme.text }}>{selected.email}</p>

          <p style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre</p>
          <input value={editName} onChange={e => setEditName(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', marginBottom: 20, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }} />

          <p style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rol</p>
          <select value={editRoleId} onChange={e => setEditRoleId(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', marginBottom: 20, fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText, boxSizing: 'border-box' }}>
            <option value=''>Sin rol</option>
            {roles.map(role => <option key={role.id} value={role.id}>{role.name} — Nivel {role.level}</option>)}
          </select>

          <p style={{ fontSize: 11, color: theme.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estado</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button onClick={() => setEditActive(true)}
              style={{ flex: 1, padding: 10, background: editActive ? '#6af7c2' : theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: editActive ? 600 : 400, color: editActive ? '#000' : theme.textMuted }}>
              Activo
            </button>
            <button onClick={() => setEditActive(false)}
              style={{ flex: 1, padding: 10, background: !editActive ? '#f76a8a' : theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: !editActive ? 600 : 400, color: !editActive ? '#000' : theme.textMuted }}>
              Inactivo
            </button>
          </div>

          <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 16, marginBottom: 16 }}>
            {selected.created_at && <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>Creado: {new Date(selected.created_at).toLocaleDateString()}</p>}
            {selected.updated_at && <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>Modificado: {new Date(selected.updated_at).toLocaleDateString()}</p>}
            {selected.inactive_at && <p style={{ fontSize: 12, color: theme.textMuted }}>Inactivado: {new Date(selected.inactive_at).toLocaleDateString()}</p>}
          </div>

          <button onClick={handleSave} disabled={saving}
            style={{ width: '100%', padding: 12, background: '#7c6af7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  )

}

export default Users
