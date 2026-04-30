'use client'

import { useState, useEffect } from 'react'
import { getAlunos } from '@/lib/demo'
import { useUser } from '@/lib/useUser'

const STORAGE_KEY = 'eduespecial_planos'

export default function PlanosPage() {
  const { isDemo } = useUser()
  const [planos, setPlanos] = useState<any[]>([])
  const [alunos, setAlunos] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ aluno_id: '', objetivo_geral: '', habilidades: '', metas: '', estrategias: '', data_inicio: new Date().toISOString().split('T')[0], status: 'andamento' })

  useEffect(() => {
    setAlunos(getAlunos())
    setPlanos(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  }, [])

  const salvar = () => {
    if (!form.aluno_id || !form.objetivo_geral) return
    const novo = { ...form, id: Date.now().toString(), created_at: new Date().toISOString() }
    const lista = [...planos, novo]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
    setPlanos(lista)
    setForm({ aluno_id: '', objetivo_geral: '', habilidades: '', metas: '', estrategias: '', data_inicio: new Date().toISOString().split('T')[0], status: 'andamento' })
    setShowForm(false)
  }

  const statusColor: Record<string, string> = { andamento: '#dbeafe', concluido: '#dcfce7', arquivado: '#f3f4f6' }
  const statusText: Record<string, string> = { andamento: '#1e40af', concluido: '#166534', arquivado: '#6b7280' }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Planos Individualizados</h1>
        {!isDemo && (
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            + Novo Plano
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>Novo Plano</h2>
          <select value={form.aluno_id} onChange={e => setForm({ ...form, aluno_id: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', marginBottom: '0.75rem', boxSizing: 'border-box' }}>
            <option value="">Selecione o aluno</option>
            {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
          {['objetivo_geral', 'habilidades', 'metas', 'estrategias'].map(campo => (
            <textarea key={campo} placeholder={campo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              value={(form as any)[campo]} onChange={e => setForm({ ...form, [campo]: e.target.value })}
              rows={2} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', marginBottom: '0.75rem', boxSizing: 'border-box', resize: 'vertical' }} />
          ))}
          <input type="date" value={form.data_inicio} onChange={e => setForm({ ...form, data_inicio: e.target.value })}
            style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', marginBottom: '1rem' }} />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={salvar} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Salvar</button>
            <button onClick={() => setShowForm(false)} style={{ background: '#e2e8f0', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {planos.length === 0 ? (
        <p style={{ color: '#666' }}>Nenhum plano cadastrado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {planos.map(p => {
            const aluno = alunos.find(a => a.id === p.aluno_id)
            return (
              <div key={p.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 600, margin: 0 }}>{aluno?.nome || 'Aluno'}</h3>
                  <span style={{ background: statusColor[p.status], color: statusText[p.status], padding: '0.15rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </div>
                <p style={{ color: '#555', margin: '0.25rem 0' }}><strong>Objetivo:</strong> {p.objetivo_geral}</p>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Início: {p.data_inicio}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
