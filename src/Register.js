import { useState } from 'react'
import axios from 'axios'
import { useTheme } from './ThemeContext'

const API = process.env.REACT_APP_API

function Register({ onRegister, onSwitchToLogin }) {
  const { theme, mode, toggleTheme } = useTheme()
  const [admin_email, setEmail]       = useState('')
  const [password, setPassword]       = useState('')
  const [company_name, setCompanyname] = useState('')
  const [error, setError]             = useState(null)
  const [loading, setLoading]         = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    try {
      const slug = company_name.toLocaleLowerCase().replace(/\s+/g, '-')
      const res = await axios.post(`${API}/auth/register`, {
        admin_email,
        password,
        company_name,
        slug
      })
      onRegister(res.data.token)
    } catch (err) {
      setError('Error al registrar. Verifica los datos.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRegister()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: mode === 'dark'
        ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)'
        : 'linear-gradient(135deg, #f8f8fc 0%, #ede9ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
        border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e2f0'}`,
        borderRadius: 16,
        padding: '40px 36px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>

        {/* Toggle tema */}
        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>
            {mode === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, background: '#7c6af7',
            borderRadius: 12, marginBottom: 16
          }}>
            <span style={{ color: 'white', fontSize: 22, fontWeight: 800 }}>D</span>
          </div>
          <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Dysior</h1>
          <p style={{ color: theme.textMuted, fontSize: 14, marginTop: 6 }}>Registra tu empresa</p>
        </div>

        {/* Campos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            placeholder="Nombre de empresa"
            value={company_name}
            onChange={e => setCompanyname(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%', padding: '12px 16px',
              background: theme.input,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: 8, color: theme.inputText,
              fontSize: 15, outline: 'none', boxSizing: 'border-box'
            }}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={admin_email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%', padding: '12px 16px',
              background: theme.input,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: 8, color: theme.inputText,
              fontSize: 15, outline: 'none', boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%', padding: '12px 16px',
              background: theme.input,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: 8, color: theme.inputText,
              fontSize: 15, outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#f76a8a', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%', padding: '13px',
            background: loading ? '#5a4fc7' : '#7c6af7',
            color: 'white', border: 'none',
            borderRadius: 8, fontSize: 15,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 20, transition: 'background 0.2s',
            boxSizing: 'border-box'
          }}>
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: theme.textMuted }}>
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none', border: 'none',
              color: '#7c6af7', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, padding: 0
            }}>
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register
