import { createServerFn } from '@tanstack/react-start'
import type { GalleryImage } from '@/lib/schema'
import { getDb } from '@/lib/db'
import { getThumbnailUrl } from '@/lib/r2'

export const getRelatedImages = createServerFn({
  method: 'GET',
})
  .inputValidator((input: { imageId: number; limit?: number }) => ({
    imageId: input.imageId,
    limit: input.limit || 6,
  }))
  .handler(async ({ data }): Promise<{ data: Array<GalleryImage> }> => {
    const { imageId, limit } = data

    const db = getDb()

    const originalImage = db
      .prepare('SELECT aspect_ratio, style_tags FROM images WHERE id = ?')
      .get(imageId) as { aspect_ratio: string; style_tags: string } | undefined

    if (!originalImage) {
      return { data: [] }
    }

    const styleTags = JSON.parse(originalImage.style_tags) as Array<string>
    const primaryStyle = styleTags[0] || ''

    let query = ''
    let params: Array<string | number> = []

    if (primaryStyle) {
      query = `
        SELECT id, r2_url, aspect_ratio, style_tags, quality, created_at
        FROM images
        WHERE id != ?
          AND style_tags LIKE ?
        ORDER BY created_at DESC
        LIMIT ?
      `
      params = [imageId, `%${primaryStyle}%`, limit]
    } else {
      query = `
        SELECT id, r2_url, aspect_ratio, style_tags, quality, created_at
        FROM images
        WHERE id != ?
        ORDER BY created_at DESC
        LIMIT ?
      `
      params = [imageId, limit]
    }

    const rows = db.prepare(query).all(...params) as Array<{
      id: number
      r2_url: string
      aspect_ratio: string
      style_tags: string
      quality: string | null
      created_at: string
    }>

    if (rows.length < limit) {
      const existingIds = rows.map((r) => r.id)
      const additionalQuery = `
        SELECT id, r2_url, aspect_ratio, style_tags, quality, created_at
        FROM images
        WHERE id != ?
          AND id NOT IN (${existingIds.length > 0 ? existingIds.join(',') : '0'})
        ORDER BY created_at DESC
        LIMIT ?
      `
      const additionalRows = db
        .prepare(additionalQuery)
        .all(imageId, limit - rows.length) as Array<{
        id: number
        r2_url: string
        aspect_ratio: string
        style_tags: string
        quality: string | null
        created_at: string
      }>
      rows.push(...additionalRows)
    }

    const likesQuery = `
      SELECT image_id, COUNT(*) as like_count
      FROM likes
      WHERE image_id IN (${rows.map(() => '?').join(',') || '0'})
      GROUP BY image_id
    `
    const likeCounts =
      rows.length > 0
        ? (db.prepare(likesQuery).all(...rows.map((r) => r.id)) as Array<{
            image_id: number
            like_count: number
          }>)
        : []
    const likeCountMap = new Map(
      likeCounts.map((l) => [l.image_id, l.like_count]),
    )

    const images: Array<GalleryImage> = rows.slice(0, limit).map((row) => ({
      id: row.id,
      r2_url: getThumbnailUrl(row.r2_url),
      aspect_ratio: row.aspect_ratio,
      style_tags: JSON.parse(row.style_tags) as Array<string>,
      quality: row.quality,
      like_count: likeCountMap.get(row.id) || 0,
      created_at: row.created_at,
    }))

    return { data: images }
  })
