'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAlunos, saveAluno, deleteAluno, initDemoData } from '@/lib/demo'

interface Aluno {
  id: string
  nome: string
  data_nascimento: string
  cpf: string
  rg?: string
  responsavel: string
  contato_responsavel: string
  email_responsavel: string
  endereco: string
  tipo_necessidade: string
  laudo_medico?: string
  diagnostico_detalhado?: string
  observacoes_medicas?: string
  medicamentos?: string
  foto?: string
  emergencia_contato: string
  emergencia_fone: string
  data_entrada: string
  status: string
}

const TIPOS_NECESSIDADE = [
  'Autismo',
  'Síndrome de Down',
  'Deficiência Intelectual',
  'Deficiência Física',
  'Deficiência Visual',
  'Deficiência Auditiva',
  'TDHA',
  'Síndrome de Asperger',
  'Outros'
]

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')

  const [form, setForm] = useState<Partial<Aluno>>({
    nome: '',
    data_nascimento: '',
    cpf: '',
    rg: '',
    responsavel: '',
    contato_responsavel: '',
    email_responsavel: '',
    endereco: '',
    tipo_necessidade: '',
    laudo_medico: '',
    diagnostico_detalhado: '',
    observacoes_medicas: '',
    medicamentos: '',
    emergencia_contato: '',
    emergencia_fone: '',
    data_entrada: new Date().toISOString().split('T')[0],
    status: 'ativo'
  })

  const router = useRouter()

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    initDemoData()
    fetchAlunos()
  }, [])

  const fetchAlunos = () => {
    try {
      const data = getAlunos()
      setAlunos(data)
    } catch (err) {
      console.error('Erro ao buscar alunos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      saveAluno(form)
      setShowModal(false)
      resetForm()
      fetchAlunos()
    } catch (err) {
      console.error('Erro ao salvar:', err)
      alert('Erro ao salvar aluno')
    }
  }

  const resetForm = () => {
    setForm({
      nome: '',
      data_nascimento: '',
      cpf: '',
      rg: '',
      responsavel: '',
      contato_responsavel: '',
      email_responsavel: '',
      endereco: '',
      tipo_necessidade: '',
      laudo_medico: '',
      diagnostico_detalhado: '',
      observacoes_medicas: '',
      medicamentos: '',
      emergencia_contato: '',
      emergencia_fone: '',
      data_entrada: new Date().toISOString().split('T')[0],
      status: 'ativo'
    })
    setEditingId(null)
  }

  const editAluno = (aluno: Aluno) => {
    setForm(aluno)
    setEditingId(aluno.id)
    setShowModal(true)
  }

  const removeAluno = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return
    deleteAluno(id)
    fetchAlunos()
  }

  const filteredAlunos = alunos.filter(aluno => {
    if (filter !== 'todos' && aluno.status !== filter) return false
    if (search && !aluno.nome.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="alunos-container">
      <div className="flex flex-between mb-3">
        <h1>Alunos</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true) }}>
          + Novo Aluno
        </button>
      </div>

      <div className="filters mb-3">
        <input
          type="text"
          className="input"
          placeholder="Buscar aluno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        
        <select
          className="select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: '150px', marginLeft: '1rem' }}
        >
          <option value="todos">Todos</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : filteredAlunos.length === 0 ? (
        <div className="empty">Nenhum aluno encontrado</div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Nascimento</th>
                <th>CPF</th>
                <th>Responsável</th>
                <th>Tipo Necessidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlunos.map(aluno => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{new Date(aluno.data_nascimento).toLocaleDateString('pt-BR')}</td>
                  <td>{aluno.cpf}</td>
                  <td>{aluno.responsavel}</td>
                  <td>{aluno.tipo_necessidade}</td>
                  <td>
                    <span className={`badge ${aluno.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>
                      {aluno.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost text-sm" onClick={() => editAluno(aluno)}>
                      Editar
                    </button>
                    <button 
                      className="btn btn-ghost text-sm text-danger" 
                      onClick={() => removeAluno(aluno.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar' : 'Novo'} Aluno</h2>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Nome *</label>
                  <input
                    type="text"
                    className="input"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Nascimento *</label>
                  <input
                    type="date"
                    className="input"
                    value={form.data_nascimento}
                    onChange={e => setForm({ ...form, data_nascimento: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CPF *</label>
                  <input
                    type="text"
                    className="input"
                    value={form.cpf}
                    onChange={e => setForm({ ...form, cpf: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">RG</label>
                  <input
                    type="text"
                    className="input"
                    value={form.rg}
                    onChange={e => setForm({ ...form, rg: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Responsável *</label>
                  <input
                    type="text"
                    className="input"
                    value={form.responsavel}
                    onChange={e => setForm({ ...form, responsavel: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contato Responsável *</label>
                  <input
                    type="text"
                    className="input"
                    value={form.contato_responsavel}
                    onChange={e => setForm({ ...form, contato_responsavel: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Responsável *</label>
                  <input
                    type="email"
                    className="input"
                    value={form.email_responsavel}
                    onChange={e => setForm({ ...form, email_responsavel: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Endereço *</label>
                  <input
                    type="text"
                    className="input"
                    value={form.endereco}
                    onChange={e => setForm({ ...form, endereco: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Necessidade *</label>
                  <select
                    className="select"
                    value={form.tipo_necessidade}
                    onChange={e => setForm({ ...form, tipo_necessidade: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    {TIPOS_NECESSIDADE.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Laudo Médico</label>
                  <input
                    type="text"
                    className="input"
                    value={form.laudo_medico}
                    onChange={e => setForm({ ...form, laudo_medico: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Diagnóstico Detalhado</label>
                  <input
                    type="text"
                    className="input"
                    value={form.diagnostico_detalhado}
                    onChange={e => setForm({ ...form, diagnostico_detalhado: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Medicamentos</label>
                  <input
                    type="text"
                    className="input"
                    value={form.medicamentos}
                    onChange={e => setForm({ ...form, medicamentos: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergência - Contato *</label>
                  <input
                    type="text"
                    className="input"
                    value={form.emergencia_contato}
                    onChange={e => setForm({ ...form, emergencia_contato: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergência - Fone *</label>
                  <input
                    type="text"
                    className="input"
                    value={form.emergencia_fone}
                    onChange={e => setForm({ ...form, emergencia_fone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Entrada *</label>
                  <input
                    type="date"
                    className="input"
                    value={form.data_entrada}
                    onChange={e => setForm({ ...form, data_entrada: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="select"
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Observações Médicas</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={form.observacoes_medicas}
                    onChange={e => setForm({ ...form, observacoes_medicas: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .alunos-container {
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .filters {
          display: flex;
          gap: 1rem;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .modal {
          background: white;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  )
}