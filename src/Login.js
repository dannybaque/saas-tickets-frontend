import { useState } from 'react'
import axios from 'axios'

//const API = 'http://localhost:3000/api'
const API = 'https://saas-tickets-backend-production.up.railway.app/api'


function Login({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password })
      onLogin(res.data.token)
    } catch (err) {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', fontFamily: 'sans-serif' }}>
      <h2>Iniciar sesión</h2>
      <div style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, fontSize: 14 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, fontSize: 14 }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: 10, background: '#7c6af7', color: 'white', border: 'none', fontSize: 14, cursor: 'pointer' }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
                <button
          onClick={async () => {
            try {
              const res = await axios.post(`${API}/auth/register`, {
                company_name: 'Empresa Test',
                slug: 'empresa-test',
                admin_email: 'admin@test.com',
                password: '123456'
              })
              onLogin(res.data.token)
            } catch (err) {
              alert('Error al registrar')
            }
          }}
          style={{ width: '100%', padding: 10, background: '#6af7c2', color: 'black', border: 'none', fontSize: 14, cursor: 'pointer', marginTop: 8 }}
        >
          Registrar empresa de prueba
        </button>

      </div>
    </div>
  )
}

export default Login
