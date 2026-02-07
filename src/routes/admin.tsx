import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      window.location.href = '/upload'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-secondary/30 rounded-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-text-primary text-center mb-2">
            Admin Login
          </h1>
          <p className="text-text-secondary text-center mb-6">
            Enter your admin password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={cn(
                  'w-full px-4 py-3 bg-secondary border rounded-lg text-text-primary placeholder-text-muted',
                  'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary',
                )}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className={cn(
                'w-full py-3 bg-accent-primary text-white rounded-lg font-medium',
                'hover:bg-accent-hover transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2',
              )}
            >
              {loading ? 'Logging in...' : 'Login'}{' '}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
