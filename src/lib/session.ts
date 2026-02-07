import crypto from 'node:crypto'
import { getDb } from './db'

export interface SessionData {
  id: string
  admin: boolean
  expiresAt: Date
}

export function createSession(admin: boolean = false): string {
  const sessionId = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const db = getDb()
  db.prepare(
    `
    INSERT INTO sessions (id, admin, expires_at)
    VALUES (?, ?, ?)
  `,
  ).run(sessionId, admin ? 1 : 0, expiresAt.toISOString())

  return sessionId
}

export function validateSession(sessionId: string): SessionData | null {
  if (!sessionId) return null

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

  if (!session) return null

  const expiresAt = new Date(session.expires_at)
  if (expiresAt < new Date()) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
    return null
  }

  return {
    id: session.id,
    admin: session.admin === 1,
    expiresAt,
  }
}

export function destroySession(sessionId: string): void {
  if (!sessionId) return

  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
}

export function cleanupExpiredSessions(): void {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE expires_at < datetime("now")').run()
}
