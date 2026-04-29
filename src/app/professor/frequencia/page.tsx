'use client'

import { useState, useEffect } from 'react'
import { getAlunos, getFrequencia, saveFrequencia, initDemoData } from '@/lib/demo'

export default function ProfessorFrequenciaPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [frequencia, setFrequencia] = useState<any[]>([])
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    initDemoData()
    setAlunos(getAlunos())
    setFrequencia(getFrequencia())
  }, [])

  const getStatus = (alunoId: string) =>
    frequencia.find(f => f.aluno_id === alunoId && f.data === dataSelecionada)?.status || null

  const registrar = (alunoId: string, status: string) => {
    saveFrequencia({ aluno_id: alunoId, data: dataSelecionada, status })
    setFrequencia(getFrequencia())
  }

  const presentes = alunos.filter(a => getStatus(a.id) === 'presente').length

  return (
    <div style={{ padding: '1.5rem', maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem' }}>Registro de Frequência</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input type="date" value={dataSelecionada} onChange={e => setDataSelecionada(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', fontSize: '1rem' }} />
        <span style={{ background: '#dcfce7', color: '#166534', padding: '0.4rem 1rem', borderRadius: 20, fontWeight: 600 }}>
          {presentes}/{alunos.length} presentes
        </span>
      </div>

      {alunos.length === 0 ? (
        <p style={{ color: '#666' }}>Nenhum aluno cadastrado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {alunos.map(aluno => {
            const status = getStatus(aluno.id)
            return (
              <div key={aluno.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{aluno.nome}</div>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>{aluno.tipo_necessidade}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => registrar(aluno.id, 'presente')}
                    style={{ background: status === 'presente' ? '#16a34a' : '#e2e8f0', color: status === 'presente' ? '#fff' : '#333', border: 'none', padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                    Presente
                  </button>
                  <button onClick={() => registrar(aluno.id, 'ausente')}
                    style={{ background: status === 'ausente' ? '#dc2626' : '#e2e8f0', color: status === 'ausente' ? '#fff' : '#333', border: 'none', padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                    Ausente
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
