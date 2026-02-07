import type { GalleryImage, PaginatedImages } from '@/lib/schema'
import { getDb } from '@/lib/db'
import { getThumbnailUrl } from '@/lib/r2'

interface GetImagesInput {
  page?: number
  limit?: number
  aspectRatio?: string
  style?: string
  search?: string
}

export async function getImages(
  input: GetImagesInput,
): Promise<PaginatedImages> {
  const page = Math.max(1, Number(input.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(input.limit) || 20))
  const { aspectRatio, style, search } = input

  const db = getDb()
  const offset = (page - 1) * limit

  const whereClauses: Array<string> = []
  const params: Array<string | number> = []

  if (aspectRatio) {
    whereClauses.push('aspect_ratio = ?')
    params.push(aspectRatio)
  }

  if (style) {
    whereClauses.push('style_tags LIKE ?')
    params.push(`%"${style}"%`)
  }

  if (search) {
    whereClauses.push('(style_tags LIKE ? OR quality LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }

  const whereClause =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const countQuery = `SELECT COUNT(*) as total FROM images ${whereClause}`
  const countResult = db.prepare(countQuery).get(...params) as { total: number }
  const total = countResult.total

  const query = `
    SELECT
      id,
      r2_url,
      aspect_ratio,
      style_tags,
      quality,
      created_at
    FROM images
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `
  const paramsWithLimit = [...params, limit, offset]

  const rows = db.prepare(query).all(...paramsWithLimit) as Array<{
    id: number
    r2_url: string
    aspect_ratio: string
    style_tags: string
    quality: string | null
    created_at: string
  }>

  const likesQuery = `
    SELECT image_id, COUNT(*) as like_count
    FROM likes
    WHERE image_id IN (${rows.map(() => '?').join(',') || '0'})
    GROUP BY image_id
  `
  const likeCounts = db
    .prepare(likesQuery)
    .all(...rows.map((r) => r.id)) as Array<{
    image_id: number
    like_count: number
  }>
  const likeCountMap = new Map(
    likeCounts.map((l) => [l.image_id, l.like_count]),
  )

  const images: Array<GalleryImage> = rows.map((row) => ({
    id: row.id,
    r2_url: getThumbnailUrl(row.r2_url),
    aspect_ratio: row.aspect_ratio,
    style_tags: JSON.parse(row.style_tags) as Array<string>,
    quality: row.quality,
    like_count: likeCountMap.get(row.id) || 0,
    created_at: row.created_at,
  }))

  return {
    data: images,
    pagination: {
      page,
      limit,
      total,
      hasMore: offset + images.length < total,
    },
  }
}
