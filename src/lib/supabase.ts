import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

// Mode demo - sem banco real
export const isDemoMode = true

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'admin' | 'professor' | 'responsavel' | 'demo'

export interface User {
  id: string
  email: string
  role: UserRole
  nome: string
  created_at: string
}

export interface Aluno {
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