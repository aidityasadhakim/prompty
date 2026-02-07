import { createServerFn } from '@tanstack/react-start'
import { getDb } from '@/lib/db'

export const toggleLike = createServerFn({
  method: 'POST',
})
  .inputValidator((input: { imageId: number; sessionId?: string }) => {
    if (!input.imageId || input.imageId <= 0)
      throw new Error('Invalid image ID')
    return { imageId: input.imageId, sessionId: input.sessionId }
  })
  .handler(
    async ({ data }): Promise<{ like_count: number; is_liked: boolean }> => {
      const { imageId } = data
      const sessionId = data.sessionId || 'anonymous'
      const db = getDb()

      const existingLike = db
        .prepare('SELECT id FROM likes WHERE image_id = ? AND session_id = ?')
        .get(imageId, sessionId) as { id: number } | undefined

      if (existingLike) {
        db.prepare(
          'DELETE FROM likes WHERE image_id = ? AND session_id = ?',
        ).run(imageId, sessionId)
      } else {
        db.prepare(
          'INSERT INTO likes (image_id, session_id) VALUES (?, ?)',
        ).run(imageId, sessionId)
      }

      const likesQuery =
        'SELECT COUNT(*) as like_count FROM likes WHERE image_id = ?'
      const likesResult = db.prepare(likesQuery).get(imageId) as {
        like_count: number
      }

      return {
        like_count: likesResult.like_count,
        is_liked: !existingLike,
      }
    },
  )
