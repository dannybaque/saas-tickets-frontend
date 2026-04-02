import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTheme } from './ThemeContext'

const API = process.env.REACT_APP_API

function Reports({ token }) {
  const { theme } = useTheme()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod]   = useState(30)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/reports?period=${period}`, { headers })
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  if (loading) return <p style={{ padding: 40, color: theme.text }}>Cargando reportes...</p>
  if (!data)   return <p style={{ padding: 40, color: theme.text }}>Error al cargar.</p>

  const slaColor = data.sla.percent >= 90 ? '#6af7c2' : data.sla.percent >= 70 ? '#f7a06a' : '#f76a8a'

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px', color: theme.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: theme.text, margin: 0 }}>Reportes</h2>
          <p style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>Métricas de rendimiento del equipo</p>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(Number(e.target.value))}
          style={{ padding: '8px 12px', fontSize: 14, background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, color: theme.inputText }}>
          <option value={7}>Últimos 7 días</option>
          <option value={30}>Últimos 30 días</option>
          <option value={90}>Últimos 90 días</option>
        </select>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>

        {/* SLA */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>SLA Compliance</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: slaColor, margin: 0, lineHeight: 1 }}>{data.sla.percent}%</p>
          <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>{data.sla.within} de {data.sla.total} tickets</p>
        </div>

        {/* MTTR */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>MTTR</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: '#7c6af7', margin: 0, lineHeight: 1 }}>{data.mttr}h</p>
          <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>Tiempo promedio resolución</p>
        </div>

        {/* Backlog */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Backlog</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: '#f7a06a', margin: 0, lineHeight: 1 }}>{data.backlog.total}</p>
          <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>tickets sin resolver</p>
        </div>

      </div>

      {/* Backlog detalle */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <h4 style={{ color: theme.text, marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Backlog por prioridad</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 100, background: theme.bgSecondary, borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#f76a8a', margin: 0 }}>{data.backlog.high}</p>
            <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Alta</p>
          </div>
          <div style={{ flex: 1, minWidth: 100, background: theme.bgSecondary, borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#f7a06a', margin: 0 }}>{data.backlog.medium}</p>
            <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Media</p>
          </div>
          <div style={{ flex: 1, minWidth: 100, background: theme.bgSecondary, borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#6af7c2', margin: 0 }}>{data.backlog.low}</p>
            <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Baja</p>
          </div>
        </div>
      </div>

      {/* Volumen */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <h4 style={{ color: theme.text, marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Volumen de tickets</h4>
        {data.volume.length === 0
          ? <p style={{ color: theme.textMuted, fontSize: 13 }}>Sin datos en este período.</p>
          : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', minHeight: 100, minWidth: data.volume.length * 30 }}>
                {data.volume.map((v, i) => {
                  const max = Math.max(...data.volume.map(d => parseInt(d.count)))
                  const height = max > 0 ? (parseInt(v.count) / max) * 80 : 0
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 24 }}>
                      <span style={{ fontSize: 10, color: theme.textMuted, marginBottom: 4 }}>{v.count}</span>
                      <div style={{ width: '100%', height: `${height}px`, background: '#7c6af7', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                      <span style={{ fontSize: 9, color: theme.textMuted, marginTop: 4, transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>
                        {new Date(v.date).toLocaleDateString('es', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }
      </div>

    </div>
  )
}

export default Reports
