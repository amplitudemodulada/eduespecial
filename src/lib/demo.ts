'use client'

import { Aluno, User } from './supabase'

const STORAGE_KEYS = {
  users: 'eduespecial_users',
  alunos: 'eduespecial_alunos',
  frequencia: 'eduespecial_frequencia',
  planos: 'eduespecial_planos',
  comunicados: 'eduespecial_comunicados'
}

const demoUsers: User[] = [
  { id: '1', email: 'admin@escola.com', role: 'admin', nome: 'Administrador', created_at: new Date().toISOString() },
  { id: '2', email: 'professor@escola.com', role: 'professor', nome: 'Professor', created_at: new Date().toISOString() },
  { id: '3', email: 'demo@escola.com', role: 'demo', nome: 'Demo', created_at: new Date().toISOString() }
]

export function initDemoData() {
  if (typeof window === 'undefined') return
  
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(demoUsers))
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.alunos)) {
    localStorage.setItem(STORAGE_KEYS.alunos, JSON.stringify([]))
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.frequencia)) {
    localStorage.setItem(STORAGE_KEYS.frequencia, JSON.stringify([]))
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.planos)) {
    localStorage.setItem(STORAGE_KEYS.planos, JSON.stringify([]))
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.comunicados)) {
    localStorage.setItem(STORAGE_KEYS.comunicados, JSON.stringify([]))
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