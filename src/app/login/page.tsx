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

  useEffect(() => {
    initDemoData()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const user = login(email, password)

    if (!user) {
      setError('Email ou senha incorretos')
      setLoading(false)
      return
    }

    sessionStorage.setItem('user', JSON.stringify(user))
    setLoading(false)

    if (user.role === 'admin') {
      router.push('/admin/alunos')
    } else if (user.role === 'professor') {
      router.push('/professor/frequencia')
    } else if (user.role === 'responsavel') {
      router.push('/responsavel')
    } else if (user.role === 'demo') {
      router.push('/admin/alunos')
    }
  }

  return (
    <div className="login-page">
      <div className="card login-card">
        <div className="login-header">
          <div className="login-logo">EduEspecial</div>
          <p className="login-subtitle">Sistema de Gestão Escolar</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@escola.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

      </div>
    </div>
  )
}