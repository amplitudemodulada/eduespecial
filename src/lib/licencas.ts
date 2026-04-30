'use client'

export const EMAIL_SUPORTE = 'suporte@msdosinformatica.com.br'

export type PeriodoLicenca = '7d' | '15d' | '30d' | '1a'

export interface Licenca {
  chave: string
  periodo: PeriodoLicenca
  escola: string
  geradaEm: string
  validaAte: string
  ativa: boolean
  usadaEm?: string
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function segmento(len: number): string {
  return Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

export const PERIODOS: { value: PeriodoLicenca; label: string; dias: number }[] = [
  { value: '7d',  label: '7 dias',   dias: 7   },
  { value: '15d', label: '15 dias',  dias: 15  },
  { value: '30d', label: '30 dias',  dias: 30  },
  { value: '1a',  label: '1 ano',    dias: 365 },
]

export function labelPeriodo(p: PeriodoLicenca): string {
  return PERIODOS.find(x => x.value === p)?.label || p
}

export function prefixoPeriodo(p: PeriodoLicenca): string {
  return { '7d': 'D07', '15d': 'D15', '30d': 'D30', '1a': 'ANO' }[p]
}

export function criarLicenca(periodo: PeriodoLicenca, escola: string): Licenca {
  const dias = PERIODOS.find(x => x.value === periodo)!.dias
  const agora = new Date()
  const validade = new Date(agora)
  validade.setDate(validade.getDate() + dias)
  const chave = `${prefixoPeriodo(periodo)}-${segmento(4)}-${segmento(4)}-${segmento(4)}-${segmento(4)}`
  return { chave, periodo, escola, geradaEm: agora.toISOString(), validaAte: validade.toISOString(), ativa: false }
}

const STORAGE_GERADAS = 'eduespecial_licencas_geradas'
const STORAGE_ATIVA   = 'eduespecial_licenca_ativa'

export function getLicencasGeradas(): Licenca[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(STORAGE_GERADAS) || '[]')
}

export function salvarLicenca(l: Licenca): void {
  const lista = getLicencasGeradas()
  lista.unshift(l)
  localStorage.setItem(STORAGE_GERADAS, JSON.stringify(lista))
}

export function revogarLicenca(chave: string): void {
  const lista = getLicencasGeradas().map(l => l.chave === chave ? { ...l, ativa: false } : l)
  localStorage.setItem(STORAGE_GERADAS, JSON.stringify(lista))
  if (getLicencaAtiva()?.chave === chave) localStorage.removeItem(STORAGE_ATIVA)
}

export function getLicencaAtiva(): Licenca | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_ATIVA)
  return raw ? JSON.parse(raw) : null
}

export function ativarLicenca(chave: string): { ok: boolean; erro?: string } {
  const lista = getLicencasGeradas()
  const lic = lista.find(l => l.chave === chave.trim().toUpperCase())
  if (!lic)              return { ok: false, erro: 'Chave não encontrada.' }
  if (new Date(lic.validaAte) < new Date()) return { ok: false, erro: 'Licença expirada.' }
  if (lic.usadaEm)       return { ok: false, erro: 'Esta chave já foi utilizada.' }
  const atualizada = { ...lic, ativa: true, usadaEm: new Date().toISOString() }
  localStorage.setItem(STORAGE_GERADAS, JSON.stringify(lista.map(l => l.chave === lic.chave ? atualizada : l)))
  localStorage.setItem(STORAGE_ATIVA, JSON.stringify(atualizada))
  return { ok: true }
}

export function corPeriodo(p: PeriodoLicenca): { bg: string; color: string } {
  return {
    '7d':  { bg: '#fef9c3', color: '#713f12' },
    '15d': { bg: '#dbeafe', color: '#1e40af' },
    '30d': { bg: '#ede9fe', color: '#5b21b6' },
    '1a':  { bg: '#dcfce7', color: '#166534' },
  }[p]
}

export function diasRestantes(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000))
}
