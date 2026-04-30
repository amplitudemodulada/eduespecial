'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const u = sessionStorage.getItem('user')
    if (!u) { router.push('/login'); return }
    setUser(JSON.parse(u))
  }, [router])

  const isDemo = user?.role === 'demo'
  const isAdmin = user?.role === 'admin'

  return { user, isDemo, isAdmin }
}
