'use client'

export type PlanoLicenca = 'basico' | 'profissional' | 'enterprise'

export interface Licenca {
  chave: string
  plano: PlanoLicenca
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

function prefixoPlano(plano: PlanoLicenca): string {
  return { basico: 'EDU', profissional: 'PRO', enterprise: 'ENT' }[plano]
}

export function gerarChave(plano: PlanoLicenca): string {
  return `${prefixoPlano(plano)}-${segmento(4)}-${segmento(4)}-${segmento(4)}-${segmento(4)}`
}

function diasPlano(plano: PlanoLicenca): number {
  return { basico: 365, profissional: 365, enterprise: 730 }[plano]
}

export function criarLicenca(plano: PlanoLicenca, escola: string): Licenca {
  const agora = new Date()
  const validade = new Date(agora)
  validade.setDate(validade.getDate() + diasPlano(plano))
  return {
    chave: gerarChave(plano),
    plano,
    escola,
    geradaEm: agora.toISOString(),
    validaAte: validade.toISOString(),
    ativa: false,
  }
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
  const lista = getLicencasGeradas().map(l =>
    l.chave === chave ? { ...l, ativa: false } : l
  )
  localStorage.setItem(STORAGE_GERADAS, JSON.stringify(lista))
  const ativa = getLicencaAtiva()
  if (ativa?.chave === chave) localStorage.removeItem(STORAGE_ATIVA)
}

export function getLicencaAtiva(): Licenca | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_ATIVA)
  if (!raw) return null
  return JSON.parse(raw)
}

export function ativarLicenca(chave: string): { ok: boolean; erro?: string } {
  const lista = getLicencasGeradas()
  const lic = lista.find(l => l.chave === chave.trim().toUpperCase())
  if (!lic) return { ok: false, erro: 'Chave não encontrada.' }
  if (new Date(lic.validaAte) < new Date()) return { ok: false, erro: 'Licença expirada.' }
  if (lic.usadaEm) return { ok: false, erro: 'Esta chave já foi utilizada.' }

  const atualizada = { ...lic, ativa: true, usadaEm: new Date().toISOString() }
  const novaLista = lista.map(l => l.chave === chave ? atualizada : l)
  localStorage.setItem(STORAGE_GERADAS, JSON.stringify(novaLista))
  localStorage.setItem(STORAGE_ATIVA, JSON.stringify(atualizada))
  return { ok: true }
}

export function labelPlano(plano: PlanoLicenca): string {
  return { basico: 'Básico', profissional: 'Profissional', enterprise: 'Enterprise' }[plano]
}

export function corPlano(plano: PlanoLicenca): { bg: string; color: string } {
  return {
    basico:       { bg: '#dbeafe', color: '#1e40af' },
    profissional: { bg: '#dcfce7', color: '#166534' },
    enterprise:   { bg: '#fef3c7', color: '#92400e' },
  }[plano]
}
