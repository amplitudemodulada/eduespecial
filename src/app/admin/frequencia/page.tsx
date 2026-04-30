'use client'

import { useState, useEffect } from 'react'
import { getAlunos, getFrequencia, saveFrequencia } from '@/lib/demo'
import { useUser } from '@/lib/useUser'

export default function FrequenciaPage() {
  const { isDemo } = useUser()
  const [alunos, setAlunos] = useState<any[]>([])
  const [frequencia, setFrequencia] = useState<any[]>([])
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    setAlunos(getAlunos())
    setFrequencia(getFrequencia())
  }, [])

  const getStatusAluno = (alunoId: string) => {
    const reg = frequencia.find(f => f.aluno_id === alunoId && f.data === dataSelecionada)
    return reg?.status || null
  }

  const registrar = (alunoId: string, status: string) => {
    saveFrequencia({ aluno_id: alunoId, data: dataSelecionada, status })
    setFrequencia(getFrequencia())
  }

  const presentes = alunos.filter(a => getStatusAluno(a.id) === 'presente').length
  const ausentes = alunos.filter(a => getStatusAluno(a.id) === 'ausente').length

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Frequência</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="date"
          value={dataSelecionada}
          onChange={e => setDataSelecionada(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', fontSize: '1rem' }}
        />
        <span style={{ background: '#dcfce7', color: '#166534', padding: '0.4rem 1rem', borderRadius: 20, fontWeight: 600 }}>
          Presentes: {presentes}
        </span>
        <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.4rem 1rem', borderRadius: 20, fontWeight: 600 }}>
          Ausentes: {ausentes}
        </span>
      </div>

      {alunos.length === 0 ? (
        <p style={{ color: '#666' }}>Nenhum aluno cadastrado.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}>Aluno</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}>Necessidade</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno, i) => {
              const status = getStatusAluno(aluno.id)
              return (
                <tr key={aluno.id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{aluno.nome}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#666' }}>{aluno.tipo_necessidade}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {status === 'presente' && <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.85rem' }}>Presente</span>}
                    {status === 'ausente' && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.85rem' }}>Ausente</span>}
                    {!status && <span style={{ color: '#aaa', fontSize: '0.85rem' }}>—</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {isDemo ? (
                      <span style={{ color: '#aaa', fontSize: '0.85rem' }}>somente leitura</span>
                    ) : (
                      <>
                        <button onClick={() => registrar(aluno.id, 'presente')}
                          style={{ background: status === 'presente' ? '#16a34a' : '#e2e8f0', color: status === 'presente' ? '#fff' : '#333', border: 'none', padding: '0.35rem 0.9rem', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                          Presente
                        </button>
                        <button onClick={() => registrar(aluno.id, 'ausente')}
                          style={{ background: status === 'ausente' ? '#dc2626' : '#e2e8f0', color: status === 'ausente' ? '#fff' : '#333', border: 'none', padding: '0.35rem 0.9rem', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                          Ausente
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
