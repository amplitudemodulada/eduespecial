'use client'

import { useRouter } from 'next/navigation'

export default function ResponsavelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const handleLogout = () => { sessionStorage.removeItem('user'); router.push('/login') }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#7c3aed', color: '#fff', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>EduEspecial — Responsável</span>
        <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '0.35rem 1rem', borderRadius: 6, cursor: 'pointer' }}>Sair</button>
      </header>
      <main style={{ flex: 1, background: '#f8fafc' }}>{children}</main>
    </div>
  )
}
