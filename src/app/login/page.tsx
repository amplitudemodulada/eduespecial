'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, initDemoData } from '@/lib/demo'
import './login.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => { initDemoData() }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const user = login(email, password)
    if (!user) { setError('E-mail ou senha incorretos.'); setLoading(false); return }
    sessionStorage.setItem('user', JSON.stringify(user))
    setLoading(false)
    if (user.role === 'admin') router.push('/admin/alunos')
    else if (user.role === 'professor') router.push('/professor/frequencia')
    else if (user.role === 'responsavel') router.push('/responsavel')
    else router.push('/admin/alunos')
  }

  return (
    <div className="login-page">

      {/* ── Lado esquerdo ── */}
      <div className="login-left">
        <div className="bubbles">
          {[...Array(6)].map((_, i) => <div key={i} className="bubble" />)}
        </div>

        <div className="login-brand">
          <span className="login-brand-icon">🌟</span>
          <h1>EduEspecial</h1>
          <p>Sistema de Gestão Escolar Inclusiva</p>
        </div>

        <div className="login-cards">
          <div className="login-feature-card">
            <span className="login-feature-icon">👧🧒</span>
            <div className="login-feature-text">
              <strong>Gestão de Alunos</strong>
              <span>Cadastro completo com laudos e necessidades</span>
            </div>
          </div>
          <div className="login-feature-card">
            <span className="login-feature-icon">📋</span>
            <div className="login-feature-text">
              <strong>Controle de Frequência</strong>
              <span>Registro diário de presença e ausências</span>
            </div>
          </div>
          <div className="login-feature-card">
            <span className="login-feature-icon">📝</span>
            <div className="login-feature-text">
              <strong>Planos Individualizados</strong>
              <span>Metas e estratégias para cada aluno</span>
            </div>
          </div>
          <div className="login-feature-card">
            <span className="login-feature-icon">📢</span>
            <div className="login-feature-text">
              <strong>Comunicados</strong>
              <span>Informações para toda a comunidade escolar</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lado direito ── */}
      <div className="login-right">
        <div className="login-form-box">
          <h2 className="login-form-title">Bem-vindo! 👋</h2>
          <p className="login-form-subtitle">Acesse sua conta para continuar</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="login-field">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="off"
                required
              />
            </div>

            <div className="login-field">
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>

          <div className="login-footer-note">
            <span>🔒</span>
            Acesso restrito a usuários autorizados pela escola
          </div>
        </div>

        <div className="login-legal">
          <p>© {new Date().getFullYear()} <strong>Msdos Informática Ltda</strong> — Todos os direitos reservados.</p>
          <p>
            Este sistema trata dados pessoais em conformidade com a{' '}
            <abbr title="Lei Geral de Proteção de Dados — Lei nº 13.709/2018">LGPD (Lei nº 13.709/2018)</abbr>{' '}
            e observa os princípios da{' '}
            <abbr title="Lei de Acesso à Informação — Lei nº 12.527/2011">Lei de Acesso à Informação (Lei nº 12.527/2011)</abbr>.
          </p>
        </div>
      </div>

    </div>
  )
}
