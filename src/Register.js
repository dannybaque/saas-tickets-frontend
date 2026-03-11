import { useState } from "react";
import axios from "axios";

const API = 'https://saas-tickets-backend-production.up.railway.app/api'

function Register({ onRegister, onSwitchToLogin}){
    const [admin_email, setEmail]             = useState('')
    const [password, setPassword]       = useState('')
    const [company_name, setCompanyname] = useState('')
    const [error, setError]             = useState(null)
    const [loading, setLoading]         = useState(false)

    const handleRegister = async () => {
        setLoading(true)
        setError(null)

        try {
            const slug = company_name.toLocaleLowerCase().replace(/\s+/g, '-')
            const res = await axios.post(`${API}/auth/register`,{admin_email,password,company_name,slug})
            onRegister(res.data.token)
        } catch (err) {
            setError('Registro incorrecto') 
        }finally{
            setLoading(false)
        }
    }

    return(
        <div style={{maxWidth:400, margin: '100px auto', fontFamily: 'sans-serif'}}>
            <h2>Registrar Empresa</h2>
            <div style={{marginTop:20}}>
                <input
                    type="text"
                    placeholder="Company Name"
                    value={company_name}
                    onChange={e =>setCompanyname(e.target.value)}
                    style={{width: '100%',padding:10,marginBottom:10,fontSize:14}}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={admin_email}
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
                    onClick={handleRegister}
                    disabled= {loading}
                    style={{width: '100%', padding: 10, background: '#7c6af7', color: 'white', border: 'none', fontSize: 14, cursor: 'pointer' }}
                >
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>
                <button
                    onClick={() => onSwitchToLogin()}
                    style={{ width: '100%', padding: 10, background: 'none', border: '1px solid #ccc', color: '#666', fontSize: 14, cursor: 'pointer', marginTop: 8 }}
                >
                    ¿Ya tienes cuenta? Iniciar sesión
                </button>

            </div>
        </div>
    )
}
export default Register