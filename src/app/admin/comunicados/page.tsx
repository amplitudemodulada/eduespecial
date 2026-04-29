'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'eduespecial_comunicados'

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<any[]>([])
  const [form, setForm] = useState({ titulo: '', mensagem: '', prioridade: 'normal' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setComunicados(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  }, [])

  const salvar = () => {
    if (!form.titulo || !form.mensagem) return
    const novo = { ...form, id: Date.now().toString(), data_publicacao: new Date().toISOString().split('T')[0], created_at: new Date().toISOString() }
    const lista = [...comunicados, novo]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
    setComunicados(lista)
    setForm({ titulo: '', mensagem: '', prioridade: 'normal' })
    setShowForm(false)
  }

  const excluir = (id: string) => {
    const lista = comunicados.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
    setComunicados(lista)
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Comunicados</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          + Novo Comunicado
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>Novo Comunicado</h2>
          <input placeholder="Título" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
          <textarea placeholder="Mensagem" value={form.mensagem} onChange={e => setForm({ ...form, mensagem: e.target.value })}
            rows={4} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', marginBottom: '0.75rem', boxSizing: 'border-box', resize: 'vertical' }} />
          <select value={form.prioridade} onChange={e => setForm({ ...form, prioridade: e.target.value })}
            style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', marginBottom: '1rem' }}>
            <option value="normal">Normal</option>
            <option value="urgente">Urgente</option>
          </select>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={salvar} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Publicar</button>
            <button onClick={() => setShowForm(false)} style={{ background: '#e2e8f0', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {comunicados.length === 0 ? (
        <p style={{ color: '#666' }}>Nenhum comunicado publicado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[...comunicados].reverse().map(c => (
            <div key={c.id} style={{ background: '#fff', border: `2px solid ${c.prioridade === 'urgente' ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 10, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontWeight: 600, margin: 0 }}>{c.titulo}</h3>
                    <span style={{ background: c.prioridade === 'urgente' ? '#fee2e2' : '#dbeafe', color: c.prioridade === 'urgente' ? '#991b1b' : '#1e40af', padding: '0.15rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                      {c.prioridade === 'urgente' ? 'URGENTE' : 'Normal'}
                    </span>
                  </div>
                  <p style={{ color: '#555', margin: 0, lineHeight: 1.5 }}>{c.mensagem}</p>
                  <span style={{ color: '#999', fontSize: '0.8rem' }}>{c.data_publicacao}</span>
                </div>
                <button onClick={() => excluir(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1.2rem', padding: '0 0.5rem' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
