import crypto from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { getDb } from '@/lib/db'
import { getEnv } from '@/lib/env'

export const adminLogin = createServerFn({
  method: 'POST',
})
  .inputValidator((input: { password: string }) => {
    if (!input.password) throw new Error('Password is required')
    return { password: input.password }
  })
  .handler(
    async ({ data }): Promise<{ success: boolean; sessionId?: string }> => {
      const env = getEnv()

      const isValid = data.password === env.admin.password

      if (!isValid) {
        throw new Error('Invalid password')
      }

      const sessionId = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      const db = getDb()
      db.prepare(
        `
      INSERT INTO sessions (id, admin, expires_at)
      VALUES (?, 1, ?)
    `,
      ).run(sessionId, expiresAt)

      return { success: true, sessionId }
    },
  )

export const validateSession = createServerFn({
  method: 'GET',
})
  .inputValidator((input: { sessionId: string }) => ({
    sessionId: input.sessionId,
  }))
  .handler(
    async ({ data }): Promise<{ isValid: boolean; isAdmin: boolean }> => {
      const { sessionId } = data

      if (!sessionId) {
        return { isValid: false, isAdmin: false }
      }

      const db = getDb()
      const session = db
        .prepare(
          `
      SELECT id, admin, expires_at FROM sessions WHERE id = ?
    `,
        )
        .get(sessionId) as
        | { id: string; admin: number; expires_at: string }
        | undefined

      if (!session) {
        return { isValid: false, isAdmin: false }
      }

      const isExpired = new Date(session.expires_at) < new Date()
      if (isExpired) {
        db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
        return { isValid: false, isAdmin: false }
      }

      return { isValid: true, isAdmin: session.admin === 1 }
    },
  )

export const adminLogout = createServerFn({
  method: 'POST',
})
  .inputValidator((input: { sessionId: string }) => ({
    sessionId: input.sessionId,
  }))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    const { sessionId } = data

    if (!sessionId) {
      return { success: false }
    }

    const db = getDb()
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)

    return { success: true }
  })
