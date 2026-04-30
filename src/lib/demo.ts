'use client'

import { Aluno, User } from './supabase'

const STORAGE_KEYS = {
  users: 'eduespecial_users',
  alunos: 'eduespecial_alunos',
  frequencia: 'eduespecial_frequencia',
  planos: 'eduespecial_planos',
  comunicados: 'eduespecial_comunicados'
}

const demoUsers = [
  { id: '1', email: 'admin@escola.com', password: '123456', role: 'admin' as const, nome: 'Administrador', created_at: new Date().toISOString() },
  { id: '2', email: 'professor@escola.com', password: '123456', role: 'professor' as const, nome: 'Professor', created_at: new Date().toISOString() },
  { id: '3', email: 'demo@escola.com', password: '123456', role: 'demo' as const, nome: 'Demo', created_at: new Date().toISOString() }
]

const demoAlunos = [
  { id: 'a1', nome: 'Ana Clara Souza', data_nascimento: '2015-03-10', cpf: '111.111.111-11', responsavel: 'Maria Souza', contato_responsavel: '(11) 99999-0001', email_responsavel: 'maria@email.com', endereco: 'Rua das Flores, 100', tipo_necessidade: 'TEA - Autismo', emergencia_contato: 'João Souza', emergencia_fone: '(11) 99999-0002', data_entrada: '2024-02-01', status: 'ativo', created_at: '2024-02-01T00:00:00Z', updated_at: '2024-02-01T00:00:00Z' },
  { id: 'a2', nome: 'Pedro Henrique Lima', data_nascimento: '2014-07-22', cpf: '222.222.222-22', responsavel: 'Carlos Lima', contato_responsavel: '(11) 98888-0001', email_responsavel: 'carlos@email.com', endereco: 'Av. Brasil, 200', tipo_necessidade: 'TDAH', emergencia_contato: 'Lucia Lima', emergencia_fone: '(11) 98888-0002', data_entrada: '2024-03-15', status: 'ativo', created_at: '2024-03-15T00:00:00Z', updated_at: '2024-03-15T00:00:00Z' },
  { id: 'a3', nome: 'Julia Martins', data_nascimento: '2016-01-05', cpf: '333.333.333-33', responsavel: 'Sandra Martins', contato_responsavel: '(11) 97777-0001', email_responsavel: 'sandra@email.com', endereco: 'Rua da Paz, 300', tipo_necessidade: 'Síndrome de Down', emergencia_contato: 'Roberto Martins', emergencia_fone: '(11) 97777-0002', data_entrada: '2024-01-10', status: 'ativo', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'a4', nome: 'Lucas Ferreira', data_nascimento: '2013-11-18', cpf: '444.444.444-44', responsavel: 'Paulo Ferreira', contato_responsavel: '(11) 96666-0001', email_responsavel: 'paulo@email.com', endereco: 'Rua Nova, 400', tipo_necessidade: 'TEA - Autismo', emergencia_contato: 'Ana Ferreira', emergencia_fone: '(11) 96666-0002', data_entrada: '2023-08-20', status: 'ativo', created_at: '2023-08-20T00:00:00Z', updated_at: '2023-08-20T00:00:00Z' },
  { id: 'a5', nome: 'Isabela Costa', data_nascimento: '2015-09-30', cpf: '555.555.555-55', responsavel: 'Fernanda Costa', contato_responsavel: '(11) 95555-0001', email_responsavel: 'fernanda@email.com', endereco: 'Av. Central, 500', tipo_necessidade: 'Deficiência Visual', emergencia_contato: 'Marcos Costa', emergencia_fone: '(11) 95555-0002', data_entrada: '2024-04-01', status: 'inativo', created_at: '2024-04-01T00:00:00Z', updated_at: '2024-04-01T00:00:00Z' },
]

const demoFrequencia = [
  ...['2026-04-28', '2026-04-29', '2026-04-30'].flatMap(data => [
    { id: `f-${data}-a1`, aluno_id: 'a1', data, status: 'presente', horario_entrada: '08:00', horario_saida: '12:00', created_at: `${data}T08:00:00Z` },
    { id: `f-${data}-a2`, aluno_id: 'a2', data, status: 'presente', horario_entrada: '08:10', horario_saida: '12:00', created_at: `${data}T08:10:00Z` },
    { id: `f-${data}-a3`, aluno_id: 'a3', data, status: 'ausente', justificativa: 'Consulta médica', created_at: `${data}T08:00:00Z` },
    { id: `f-${data}-a4`, aluno_id: 'a4', data, status: 'presente', horario_entrada: '08:05', horario_saida: '12:00', created_at: `${data}T08:05:00Z` },
  ])
]

const demoPlanos = [
  { id: 'p1', aluno_id: 'a1', objetivo_geral: 'Desenvolver comunicação verbal e interação social', habilidades: 'Identificação de emoções, contato visual', metas: 'Ampliar vocabulário para 50 palavras funcionais', estrategias: 'ABA, PECS, jogos cooperativos', materiais: 'Cartões visuais, tablets', data_inicio: '2024-02-01', status: 'andamento', created_at: '2024-02-01T00:00:00Z' },
  { id: 'p2', aluno_id: 'a2', objetivo_geral: 'Melhorar foco e organização escolar', habilidades: 'Atenção sustentada, sequenciamento', metas: 'Concluir tarefas em 30 minutos sem interrupção', estrategias: 'Rotinas visuais, pausas estruturadas, reforço positivo', materiais: 'Timer visual, agenda colorida', data_inicio: '2024-03-15', status: 'andamento', created_at: '2024-03-15T00:00:00Z' },
  { id: 'p3', aluno_id: 'a3', objetivo_geral: 'Estimular autonomia nas atividades diárias', habilidades: 'Motricidade fina, autocuidado', metas: 'Realizar higiene pessoal com supervisão mínima', estrategias: 'Modelagem, encadeamento de tarefas', materiais: 'Materiais adaptados, apoio visual', data_inicio: '2024-01-10', status: 'concluido', created_at: '2024-01-10T00:00:00Z' },
]

const demoComunicados = [
  { id: 'c1', titulo: 'Reunião de Pais - Maio', mensagem: 'Informamos que a reunião de pais e mestres será realizada no dia 15/05 às 19h no auditório da escola.', prioridade: 'normal', destinatario_tipo: 'todos', data_publicacao: '2026-04-29', created_at: '2026-04-29T10:00:00Z' },
  { id: 'c2', titulo: 'Feriado - 01 de Maio', mensagem: 'Não haverá aula no dia 01/05 (Dia do Trabalhador). As atividades retornam normalmente na quinta-feira, dia 02/05.', prioridade: 'urgente', destinatario_tipo: 'todos', data_publicacao: '2026-04-29', created_at: '2026-04-29T09:00:00Z' },
  { id: 'c3', titulo: 'Cardápio da Semana', mensagem: 'O cardápio atualizado da semana está disponível na secretaria e no mural da escola.', prioridade: 'normal', destinatario_tipo: 'todos', data_publicacao: '2026-04-28', created_at: '2026-04-28T08:00:00Z' },
]

export function initDemoData() {
  if (typeof window === 'undefined') return

  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(demoUsers))
  }

  if (!localStorage.getItem(STORAGE_KEYS.alunos)) {
    localStorage.setItem(STORAGE_KEYS.alunos, JSON.stringify(demoAlunos))
  }

  if (!localStorage.getItem(STORAGE_KEYS.frequencia)) {
    localStorage.setItem(STORAGE_KEYS.frequencia, JSON.stringify(demoFrequencia))
  }

  if (!localStorage.getItem(STORAGE_KEYS.planos)) {
    localStorage.setItem(STORAGE_KEYS.planos, JSON.stringify(demoPlanos))
  }

  if (!localStorage.getItem(STORAGE_KEYS.comunicados)) {
    localStorage.setItem(STORAGE_KEYS.comunicados, JSON.stringify(demoComunicados))
  }
}

export function login(email: string, password: string): User | null {
  initDemoData()
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]')
  const user = users.find((u: any) => u.email === email && u.password === password)
  return user || null
}

export function getAlunos(): any[] {
  initDemoData()
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.alunos) || '[]')
}

export function saveAluno(aluno: any): void {
  const alunos = getAlunos()
  if (aluno.id) {
    const index = alunos.findIndex((a: any) => a.id === aluno.id)
    if (index >= 0) {
      alunos[index] = { ...aluno, updated_at: new Date().toISOString() }
    }
  } else {
    aluno.id = Date.now().toString()
    aluno.created_at = new Date().toISOString()
    aluno.updated_at = new Date().toISOString()
    alunos.push(aluno)
  }
  localStorage.setItem(STORAGE_KEYS.alunos, JSON.stringify(alunos))
}

export function deleteAluno(id: string): void {
  const alunos = getAlunos().filter((a: any) => a.id !== id)
  localStorage.setItem(STORAGE_KEYS.alunos, JSON.stringify(alunos))
}

export function getFrequencia(): any[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.frequencia) || '[]')
}

export function saveFrequencia(item: any): void {
  if (typeof window === 'undefined') return
  const frequencia = getFrequencia()
  const index = frequencia.findIndex((f: any) => f.aluno_id === item.aluno_id && f.data === item.data)
  if (index >= 0) {
    frequencia[index] = item
  } else {
    item.id = Date.now().toString()
    item.created_at = new Date().toISOString()
    frequencia.push(item)
  }
  localStorage.setItem(STORAGE_KEYS.frequencia, JSON.stringify(frequencia))
}