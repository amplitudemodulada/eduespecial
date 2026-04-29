'use client'

import { useState, useEffect } from 'react'
import { getAlunos, getFrequencia, initDemoData } from '@/lib/demo'

export default function DemoPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [frequencia, setFrequencia] = useState<any[]>([])

  useEffect(() => {
    initDemoData()
    setAlunos(getAlunos())
    setFrequencia(getFrequencia())
  }, [])

  const presencas = frequencia.filter(f => f.status === 'presente').length
  const faltas = frequencia.filter(f => f.status === 'ausente').length
  const taxa = presencas + faltas > 0 ? Math.round((presencas / (presencas + faltas)) * 100) : 0

  const card = (label: string, value: string | number, bg: string, color: string) => (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>{label}</div>
    </div>
  )

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#713f12', fontSize: '0.9rem' }}>
        Modo Demo — dados armazenados localmente no navegador
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Visão Geral</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {card('Total de Alunos', alunos.length, '#dbeafe', '#1e40af')}
        {card('Alunos Ativos', alunos.filter(a => a.status === 'ativo').length, '#dcfce7', '#166534')}
        {card('Presenças', presencas, '#dcfce7', '#16a34a')}
        {card('Faltas', faltas, '#fee2e2', '#dc2626')}
        {card('Taxa de Presença', `${taxa}%`, '#f3f4f6', taxa >= 75 ? '#16a34a' : '#dc2626')}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>Alunos Cadastrados</h2>
        {alunos.length === 0 ? (
          <p style={{ color: '#999' }}>Nenhum aluno cadastrado.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem' }}>Nome</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem' }}>Necessidade</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map(a => (
                <tr key={a.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{a.nome}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#666' }}>{a.tipo_necessidade}</td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    <span style={{ background: a.status === 'ativo' ? '#dcfce7' : '#f3f4f6', color: a.status === 'ativo' ? '#166534' : '#6b7280', padding: '0.15rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
                      {a.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
