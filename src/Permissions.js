import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API

const ACTIONS = [
  { key: 'create_ticket',      label: 'Crear tickets' },
  { key: 'assign_ticket',      label: 'Asignarse tickets' },
  { key: 'change_status',      label: 'Cambiar estado' },
  { key: 'add_comment',        label: 'Agregar comentarios' },
  { key: 'manage_users',       label: 'Gestionar usuarios' },
  { key: 'manage_roles',       label: 'Gestionar roles' },
  { key: 'manage_categories',  label: 'Gestionar categorías' },
]

function Permissions({ token, onPermissionChange }) {
  const { theme } = useTheme()
  const [permissions, setPermissions] = useState([])
  const [roles, setRoles]             = useState([])
  const [loading, setLoading]         = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchAll = async () => {
    try {
      const [permsRes, rolesRes] = await Promise.all([
        axios.get(`${API}/permissions`, { headers }),
        axios.get(`${API}/roles`, { headers })
      ])
      setPermissions(permsRes.data)
      setRoles(rolesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isAllowed = (level, action) => {
    const perm = permissions.find(p => p.level === level && p.action === action)
    return perm ? perm.allowed : false
  }

  const handleToggle = async (level, action, current) => {
    try {
      await axios.post(`${API}/permissions`, {
        level,
        action,
        allowed: !current
      }, { headers })
      fetchAll()
      onPermissionChange()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Cargando permisos...</p>

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px', color: theme.text }}>
      <h2 style={{ color: theme.text, marginBottom: 4 }}>Gestión de Permisos</h2>
      <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 24 }}>
        Configura qué puede hacer cada nivel jerárquico.
      </p>

      <div style={{ overflowX: 'auto', background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: theme.nav }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600 }}>Acción</th>
              {roles.map(role => (
                <th key={role.id} style={{ padding: '12px 16px', textAlign: 'center', color: 'white', fontWeight: 600 }}>
                  {role.name}<br/>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Nivel {role.level}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIONS.map((action, i) => (
              <tr key={action.key} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 0 ? theme.cardBg : theme.bgSecondary }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: theme.text }}>{action.label}</td>
                {roles.map(role => {
                  const allowed = isAllowed(role.level, action.key)
                  return (
                    <td key={role.id} style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggle(role.level, action.key, allowed)}
                        style={{
                          width: 40, height: 22, borderRadius: 11,
                          background: allowed ? '#7c6af7' : theme.border,
                          border: 'none', cursor: 'pointer',
                          position: 'relative', transition: 'background 0.2s'
                        }}>
                        <span style={{
                          position: 'absolute', top: 3,
                          left: allowed ? 20 : 3,
                          width: 16, height: 16, borderRadius: '50%',
                          background: 'white', transition: 'left 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

}

export default Permissions
