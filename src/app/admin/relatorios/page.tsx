'use client'

import { useState, useEffect } from 'react'
import { getAlunos, getFrequencia } from '@/lib/demo'

export default function RelatoriosPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [frequencia, setFrequencia] = useState<any[]>([])

  useEffect(() => {
    setAlunos(getAlunos())
    setFrequencia(getFrequencia())
  }, [])

  const ativos = alunos.filter(a => a.status === 'ativo').length
  const inativos = alunos.filter(a => a.status === 'inativo').length
  const presencas = frequencia.filter(f => f.status === 'presente').length
  const faltas = frequencia.filter(f => f.status === 'ausente').length
  const total = presencas + faltas
  const taxaPresenca = total > 0 ? Math.round((presencas / total) * 100) : 0

  const porNecessidade = alunos.reduce((acc: Record<string, number>, a) => {
    acc[a.tipo_necessidade] = (acc[a.tipo_necessidade] || 0) + 1
    return acc
  }, {})

  const card = (label: string, value: string | number, color: string) => (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>{label}</div>
    </div>
  )

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Relatórios</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {card('Total de Alunos', alunos.length, '#3b82f6')}
        {card('Alunos Ativos', ativos, '#16a34a')}
        {card('Alunos Inativos', inativos, '#f59e0b')}
        {card('Taxa de Presença', `${taxaPresenca}%`, taxaPresenca >= 75 ? '#16a34a' : '#dc2626')}
        {card('Total Presenças', presencas, '#16a34a')}
        {card('Total Faltas', faltas, '#dc2626')}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.1rem' }}>Alunos por Tipo de Necessidade</h2>
        {Object.keys(porNecessidade).length === 0 ? (
          <p style={{ color: '#999' }}>Sem dados disponíveis.</p>
        ) : (
          Object.entries(porNecessidade).map(([tipo, qtd]) => (
            <div key={tipo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: '#333' }}>{tipo}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 120, background: '#f0f0f0', borderRadius: 20, height: 10 }}>
                  <div style={{ width: `${(qtd / alunos.length) * 100}%`, background: '#3b82f6', borderRadius: 20, height: 10 }} />
                </div>
                <span style={{ fontWeight: 600, minWidth: 24, textAlign: 'right' }}>{qtd}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
