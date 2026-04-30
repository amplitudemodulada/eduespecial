'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const u = sessionStorage.getItem('user')
    if (!u) { router.push('/login'); return }
    setUser(JSON.parse(u))
  }, [router])

  const trocarSenha = (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem(null)

    const users = JSON.parse(localStorage.getItem('eduespecial_users') || '[]')
    const idx = users.findIndex((u: any) => u.id === user.id)

    if (idx === -1) {
      setMensagem({ tipo: 'erro', texto: 'Usuário não encontrado.' })
      return
    }

    if (users[idx].password !== senhaAtual) {
      setMensagem({ tipo: 'erro', texto: 'Senha atual incorreta.' })
      return
    }

    if (novaSenha.length < 6) {
      setMensagem({ tipo: 'erro', texto: 'A nova senha deve ter pelo menos 6 caracteres.' })
      return
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem.' })
      return
    }

    users[idx].password = novaSenha
    localStorage.setItem('eduespecial_users', JSON.stringify(users))

    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
    setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' })
  }

  const voltar = () => {
    if (!user) return
    const rotas: Record<string, string> = {
      admin: '/admin/alunos',
      professor: '/professor/frequencia',
      responsavel: '/responsavel',
      demo: '/demo',
    }
    router.push(rotas[user.role] || '/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '2rem', width: '100%', maxWidth: 420 }}>
        <button onClick={voltar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: '0.9rem', marginBottom: '1.5rem', padding: 0 }}>
          ← Voltar
        </button>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>Meu Perfil</h1>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>{user.email} — <strong>{user.role}</strong></p>

        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Alterar Senha</h2>

        {mensagem && (
          <div style={{
            background: mensagem.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2',
            color: mensagem.tipo === 'sucesso' ? '#166534' : '#991b1b',
            border: `1px solid ${mensagem.tipo === 'sucesso' ? '#86efac' : '#fca5a5'}`,
            borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem'
          }}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={trocarSenha} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.4rem', color: '#374151' }}>
              Senha Atual
            </label>
            <input
              type="password"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              required
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.4rem', color: '#374151' }}>
              Nova Senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.4rem', color: '#374151' }}>
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={e => setConfirmarSenha(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
            Alterar Senha
          </button>
        </form>
      </div>
    </div>
  )
}
