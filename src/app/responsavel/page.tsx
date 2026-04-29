'use client'

import { useState, useEffect } from 'react'
import { getFrequencia, initDemoData } from '@/lib/demo'

export default function ResponsavelPage() {
  const [frequencia, setFrequencia] = useState<any[]>([])
  const [comunicados, setComunicados] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    initDemoData()
    const u = sessionStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    setFrequencia(getFrequencia().slice(-10).reverse())
    setComunicados(JSON.parse(localStorage.getItem('eduespecial_comunicados') || '[]').reverse())
  }, [])

  return (
    <div style={{ padding: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Olá, {user?.nome || 'Responsável'}
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Acompanhe a frequência e comunicados do seu filho.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>Frequência Recente</h2>
          {frequencia.length === 0 ? (
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Sem registros.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {frequencia.map(f => (
                <div key={f.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#555' }}>{f.data}</span>
                  <span style={{ background: f.status === 'presente' ? '#dcfce7' : '#fee2e2', color: f.status === 'presente' ? '#166534' : '#991b1b', padding: '0.15rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
                    {f.status === 'presente' ? 'Presente' : 'Ausente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>Comunicados</h2>
          {comunicados.length === 0 ? (
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Sem comunicados.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {comunicados.slice(0, 5).map((c: any) => (
                <div key={c.id} style={{ background: '#fff', border: `1px solid ${c.prioridade === 'urgente' ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 8, padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.titulo}</div>
                  <div style={{ color: '#777', fontSize: '0.8rem', marginTop: '0.25rem' }}>{c.mensagem}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
