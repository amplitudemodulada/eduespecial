'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/useUser'
import { useRouter } from 'next/navigation'

const STORAGE_KEY = 'eduespecial_users'

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'professor', label: 'Professor' },
  { value: 'responsavel', label: 'Responsável' },
  { value: 'demo', label: 'Demo (somente leitura)' },
]

const roleLabel = (role: string) => ROLES.find(r => r.value === role)?.label || role
const roleColor: Record<string, { bg: string; color: string }> = {
  admin:      { bg: '#dbeafe', color: '#1e40af' },
  professor:  { bg: '#dcfce7', color: '#166534' },
  responsavel:{ bg: '#ede9fe', color: '#5b21b6' },
  demo:       { bg: '#fef9c3', color: '#713f12' },
}

const emptyForm = { nome: '', email: '', password: '', role: 'professor' }

export default function UsuariosPage() {
  const { user: currentUser, isAdmin } = useUser()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (currentUser && !isAdmin) { router.push('/admin/alunos'); return }
    setUsers(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  }, [currentUser, isAdmin, router])

  const resetForm = () => { setForm({ ...emptyForm }); setEditingId(null); setErro('') }

  const abrirNovo = () => { resetForm(); setShowForm(true) }

  const abrirEditar = (u: any) => {
    setForm({ nome: u.nome || '', email: u.email, password: '', role: u.role })
    setEditingId(u.id)
    setShowForm(true)
    setErro('')
  }

  const salvar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    const lista: any[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

    if (!form.nome.trim() || !form.email.trim()) {
      setErro('Nome e e-mail são obrigatórios.'); return
    }

    const emailDuplicado = lista.some(u => u.email === form.email && u.id !== editingId)
    if (emailDuplicado) { setErro('Este e-mail já está em uso.'); return }

    if (editingId) {
      const idx = lista.findIndex(u => u.id === editingId)
      if (idx !== -1) {
        lista[idx] = {
          ...lista[idx],
          nome: form.nome,
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        }
      }
    } else {
      if (!form.password || form.password.length < 6) {
        setErro('A senha deve ter pelo menos 6 caracteres.'); return
      }
      lista.push({
        id: Date.now().toString(),
        nome: form.nome,
        email: form.email,
        password: form.password,
        role: form.role,
        created_at: new Date().toISOString(),
      })
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
    setUsers(lista)
    setShowForm(false)
    resetForm()
    setSucesso(editingId ? 'Usuário atualizado!' : 'Usuário criado!')
    setTimeout(() => setSucesso(''), 3000)
  }

  const excluir = (id: string) => {
    if (id === currentUser?.id) { alert('Você não pode excluir seu próprio usuário.'); return }
    if (!confirm('Excluir este usuário?')) return
    const lista = users.filter(u => u.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
    setUsers(lista)
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Usuários</h1>
        <button onClick={abrirNovo}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          + Novo Usuário
        </button>
      </div>

      {sucesso && (
        <div style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {sucesso}
        </div>
      )}

      {/* Formulário */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1.1rem' }}>
            {editingId ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>

          {erro && (
            <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {erro}
            </div>
          )}

          <form onSubmit={salvar} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Nome completo *</label>
              <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required
                style={{ padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.95rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>E-mail *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                style={{ padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.95rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                Senha {editingId ? '(deixe vazio para manter)' : '*'}
              </label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                minLength={editingId ? 0 : 6} required={!editingId}
                placeholder={editingId ? 'Nova senha (opcional)' : 'Mínimo 6 caracteres'}
                style={{ padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.95rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Perfil *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required
                style={{ padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.95rem', background: '#fff' }}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit"
                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                {editingId ? 'Salvar Alterações' : 'Criar Usuário'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm() }}
                style={{ background: '#e2e8f0', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 8, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de usuários */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>Nome</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>E-mail</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>Perfil</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>Criado em</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const rc = roleColor[u.role] || { bg: '#f3f4f6', color: '#374151' }
              return (
                <tr key={u.id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                    {u.nome}
                    {u.id === currentUser?.id && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#888' }}>(você)</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#555' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: rc.bg, color: rc.color, padding: '0.2rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#888', fontSize: '0.85rem' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <button onClick={() => abrirEditar(u)}
                      style={{ background: 'none', border: '1px solid #d1d5db', color: '#374151', padding: '0.3rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', marginRight: '0.5rem' }}>
                      Editar
                    </button>
                    <button onClick={() => excluir(u.id)} disabled={u.id === currentUser?.id}
                      style={{ background: 'none', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.3rem 0.8rem', borderRadius: 6, cursor: u.id === currentUser?.id ? 'not-allowed' : 'pointer', fontSize: '0.85rem', opacity: u.id === currentUser?.id ? 0.4 : 1 }}>
                      Excluir
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
