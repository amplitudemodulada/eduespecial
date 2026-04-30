'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/useUser'
import { useRouter } from 'next/navigation'
import {
  criarLicenca, salvarLicenca, getLicencasGeradas, getLicencaAtiva,
  ativarLicenca, revogarLicenca, labelPeriodo, corPeriodo, diasRestantes,
  PERIODOS, EMAIL_SUPORTE,
  type Licenca, type PeriodoLicenca
} from '@/lib/licencas'

function copiar(texto: string, setCopied: (v: string) => void) {
  navigator.clipboard.writeText(texto)
  setCopied(texto)
  setTimeout(() => setCopied(''), 2500)
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export default function LicencasPage() {
  const { user: currentUser, isAdmin } = useUser()
  const router = useRouter()

  const [licencas, setLicencas]       = useState<Licenca[]>([])
  const [ativa, setAtiva]             = useState<Licenca | null>(null)
  const [escola, setEscola]           = useState('')
  const [periodo, setPeriodo]         = useState<PeriodoLicenca>('30d')
  const [novaLic, setNovaLic]         = useState<Licenca | null>(null)
  const [chaveInput, setChaveInput]   = useState('')
  const [erroAtiv, setErroAtiv]       = useState('')
  const [sucessoAtiv, setSucessoAtiv] = useState('')
  const [copied, setCopied]           = useState('')
  const [tab, setTab]                 = useState<'ativar' | 'gerar' | 'lista'>('ativar')

  const isSuporte = currentUser?.email === EMAIL_SUPORTE

  useEffect(() => {
    if (currentUser && !isAdmin) { router.push('/admin/alunos'); return }
    setLicencas(getLicencasGeradas())
    setAtiva(getLicencaAtiva())
  }, [currentUser, isAdmin, router])

  const gerar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!escola.trim()) return
    const lic = criarLicenca(periodo, escola.trim())
    salvarLicenca(lic)
    setNovaLic(lic)
    setLicencas(getLicencasGeradas())
    setEscola('')
  }

  const ativar = (e: React.FormEvent) => {
    e.preventDefault()
    setErroAtiv(''); setSucessoAtiv('')
    const res = ativarLicenca(chaveInput)
    if (!res.ok) { setErroAtiv(res.erro || 'Erro.'); return }
    setSucessoAtiv('Licença ativada com sucesso!')
    setAtiva(getLicencaAtiva())
    setLicencas(getLicencasGeradas())
    setChaveInput('')
  }

  const revogar = (chave: string) => {
    if (!confirm('Revogar esta licença?')) return
    revogarLicenca(chave)
    setLicencas(getLicencasGeradas())
    setAtiva(getLicencaAtiva())
  }

  const tabStyle = (t: string): React.CSSProperties => ({
    padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.875rem',
    background: tab === t ? '#3b82f6' : '#e2e8f0',
    color: tab === t ? '#fff' : '#374151',
  })

  return (
    <div style={{ padding: '1.5rem', maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>🔑 Licenças</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Gerencie as licenças de acesso ao sistema</p>

      {/* Status licença ativa */}
      <div style={{
        background: ativa ? '#f0fdf4' : '#fef9c3',
        border: `1px solid ${ativa ? '#86efac' : '#fde047'}`,
        borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: ativa ? '#166534' : '#713f12', marginBottom: '0.25rem' }}>
            {ativa ? '✅ Licença Ativa' : '⚠️ Sem Licença Ativa'}
          </div>
          {ativa ? (
            <div style={{ fontSize: '0.85rem', color: '#374151' }}>
              <code style={{ fontWeight: 700 }}>{ativa.chave}</code> · {labelPeriodo(ativa.periodo)} · <strong>{ativa.escola}</strong><br />
              Válida até <strong>{fmtData(ativa.validaAte)}</strong> · {diasRestantes(ativa.validaAte)} dias restantes
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#713f12' }}>Insira uma chave de licença para ativar o sistema</div>
          )}
        </div>
        {ativa && isSuporte && (
          <button onClick={() => revogar(ativa.chave)}
            style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.4rem 1rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            Revogar
          </button>
        )}
      </div>

      {/* Tabs — Gerar só aparece para suporte */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button style={tabStyle('ativar')} onClick={() => setTab('ativar')}>Ativar Licença</button>
        {isSuporte && <button style={tabStyle('gerar')} onClick={() => setTab('gerar')}>Gerar Chave</button>}
        {isSuporte && <button style={tabStyle('lista')} onClick={() => setTab('lista')}>Histórico ({licencas.length})</button>}
      </div>

      {/* Tab: Ativar */}
      {tab === 'ativar' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>Inserir Chave de Licença</h2>

          {erroAtiv    && <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 8, padding: '0.65rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{erroAtiv}</div>}
          {sucessoAtiv && <div style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', borderRadius: 8, padding: '0.65rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{sucessoAtiv}</div>}

          <form onSubmit={ativar} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              value={chaveInput}
              onChange={e => setChaveInput(e.target.value.toUpperCase())}
              placeholder="D30-XXXX-XXXX-XXXX-XXXX"
              required
              style={{ flex: 1, minWidth: 260, padding: '0.65rem 1rem', borderRadius: 8, border: '2px solid #e5e7eb', fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}
            />
            <button type="submit"
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>
              Ativar
            </button>
          </form>

          {!isSuporte && (
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              Para obter uma chave de licença, entre em contato: <strong>{EMAIL_SUPORTE}</strong>
            </p>
          )}
        </div>
      )}

      {/* Tab: Gerar — exclusivo suporte */}
      {tab === 'gerar' && isSuporte && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Gerar Nova Chave</h2>

          <form onSubmit={gerar}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Nome da Escola / Cliente *</label>
                <input value={escola} onChange={e => setEscola(e.target.value)} required
                  placeholder="Ex: Escola Municipal Criança Feliz"
                  style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.95rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Período *</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {PERIODOS.map(p => {
                    const cp = corPeriodo(p.value)
                    const sel = periodo === p.value
                    return (
                      <button key={p.value} type="button" onClick={() => setPeriodo(p.value)}
                        style={{
                          padding: '0.5rem 1rem', borderRadius: 8, border: `2px solid ${sel ? cp.color : '#e5e7eb'}`,
                          background: sel ? cp.bg : '#fff', color: sel ? cp.color : '#374151',
                          fontWeight: sel ? 700 : 500, cursor: 'pointer', fontSize: '0.875rem'
                        }}>
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <button type="submit"
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
              Gerar Chave
            </button>
          </form>

          {novaLic && (
            <div style={{ marginTop: '1.5rem', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.75rem' }}>✅ Chave gerada com sucesso!</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <code style={{ background: '#fff', border: '1px solid #d1d5db', padding: '0.6rem 1.2rem', borderRadius: 8, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '0.08em', color: '#1e40af' }}>
                  {novaLic.chave}
                </code>
                <button onClick={() => copiar(novaLic.chave, setCopied)}
                  style={{ background: copied === novaLic.chave ? '#dcfce7' : '#e2e8f0', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: copied === novaLic.chave ? '#166534' : '#374151' }}>
                  {copied === novaLic.chave ? '✓ Copiado!' : '📋 Copiar'}
                </button>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#374151' }}>
                <strong>Cliente:</strong> {novaLic.escola} &nbsp;·&nbsp;
                <strong>Período:</strong> {labelPeriodo(novaLic.periodo)} &nbsp;·&nbsp;
                <strong>Válida até:</strong> {fmtData(novaLic.validaAte)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Histórico — exclusivo suporte */}
      {tab === 'lista' && isSuporte && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {licencas.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Nenhuma chave gerada ainda.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Chave', 'Cliente', 'Período', 'Válida até', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: '#6b7280' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {licencas.map((l, i) => {
                  const cp = corPeriodo(l.periodo)
                  const expirada = new Date(l.validaAte) < new Date()
                  return (
                    <tr key={l.chave} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <code style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>{l.chave}</code>
                          <button onClick={() => copiar(l.chave, setCopied)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === l.chave ? '#16a34a' : '#9ca3af', fontSize: '0.85rem' }}>
                            {copied === l.chave ? '✓' : '📋'}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{l.escola}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ background: cp.bg, color: cp.color, padding: '0.15rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                          {labelPeriodo(l.periodo)}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: expirada ? '#dc2626' : '#374151' }}>
                        {fmtData(l.validaAte)}{expirada && ' ⚠'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {l.ativa
                          ? <span style={{ background: '#dcfce7', color: '#166534', padding: '0.15rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Ativa</span>
                          : l.usadaEm
                          ? <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '0.15rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Usada</span>
                          : expirada
                          ? <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.15rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Expirada</span>
                          : <span style={{ background: '#fef9c3', color: '#713f12', padding: '0.15rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Disponível</span>
                        }
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {l.ativa && (
                          <button onClick={() => revogar(l.chave)}
                            style={{ background: 'none', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.25rem 0.65rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' }}>
                            Revogar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
