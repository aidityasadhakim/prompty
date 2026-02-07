import { useEffect, useState } from 'react'
import { validateSession } from '@/server/functions/admin'

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const sessionId = localStorage.getItem('sessionId')

      if (!sessionId) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      try {
        const result = await validateSession({ data: { sessionId } })
        setIsAdmin(result.isAdmin)
      } catch {
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAdmin, isLoading }
}
