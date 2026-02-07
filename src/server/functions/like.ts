import { getDb } from '@/lib/db'

interface ToggleLikeInput {
  imageId: number
  sessionId?: string
}

export async function toggleLike(
  input: ToggleLikeInput,
): Promise<{ like_count: number; is_liked: boolean }> {
  const imageId = Number(input.imageId)
  if (!imageId || imageId <= 0) {
    throw new Error('Invalid image ID')
  }

  const sessionId = input.sessionId || 'anonymous'
  const db = getDb()

  const existingLike = db
    .prepare('SELECT id FROM likes WHERE image_id = ? AND session_id = ?')
    .get(imageId, sessionId) as { id: number } | undefined

  if (existingLike) {
    db.prepare('DELETE FROM likes WHERE image_id = ? AND session_id = ?').run(
      imageId,
      sessionId,
    )
  } else {
    db.prepare('INSERT INTO likes (image_id, session_id) VALUES (?, ?)').run(
      imageId,
      sessionId,
    )
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
}
