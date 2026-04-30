'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import './admin.css'

const menuItems = [
  { href: '/admin/alunos', label: 'Alunos', icon: '👥' },
  { href: '/admin/frequencia', label: 'Frequência', icon: '📋' },
  { href: '/admin/planos', label: 'Planos', icon: '📝' },
  { href: '/admin/relatorios', label: 'Relatórios', icon: '📊' },
  { href: '/admin/comunicados', label: 'Comunicados', icon: '📢' },
  { href: '/admin/usuarios', label: 'Usuários', icon: '👤', adminOnly: true },
  { href: '/admin/licencas', label: 'Licenças', icon: '🔑', adminOnly: true },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const u = sessionStorage.getItem('user')
    if (u) setIsDemo(JSON.parse(u).role === 'demo')
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div className="admin-layout">
      <header className="header">
        <div className="container header-content">
          <div className="logo">EduEspecial</div>
          <nav className="nav">
            {menuItems.map(item => {
              if (item.adminOnly && isDemo) return null
              return (
                <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? 'active' : ''}`}>
                  {item.icon} {item.label}
                </Link>
              )
            })}
          </nav>
          <Link href="/perfil" className="btn btn-ghost">Meu Perfil</Link>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {isDemo && (
        <div style={{ background: '#fef9c3', borderBottom: '1px solid #fde047', padding: '0.4rem 1.5rem', fontSize: '0.85rem', color: '#713f12', textAlign: 'center' }}>
          Modo somente leitura — conta demo
        </div>
      )}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}