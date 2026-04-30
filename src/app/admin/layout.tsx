'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import './admin.css'

const menuItems = [
  { href: '/admin/alunos', label: 'Alunos', icon: '👥' },
  { href: '/admin/frequencia', label: 'Frequência', icon: '📋' },
  { href: '/admin/planos', label: 'Planos', icon: '📝' },
  { href: '/admin/relatorios', label: 'Relatórios', icon: '📊' },
  { href: '/admin/comunicados', label: 'Comunicados', icon: '📢' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

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
            {menuItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/perfil" className="btn btn-ghost">Meu Perfil</Link>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}