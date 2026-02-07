import { getDb } from '@/lib/db'
import { getThumbnailUrl } from '@/lib/r2'
import { GalleryImage } from '@/lib/schema'

interface GetTrendingImagesInput {
  limit?: number
}

export async function getTrendingImages(
  input: GetTrendingImagesInput,
): Promise<{ data: GalleryImage[] }> {
  const limit = Math.min(50, Math.max(1, Number(input.limit) || 10))

  const db = getDb()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const query = `
    SELECT
      i.id,
      i.r2_url,
      i.aspect_ratio,
      i.style_tags,
      i.quality,
      i.created_at,
      COALESCE(l.like_count, 0) as like_count
    FROM images i
    LEFT JOIN (
      SELECT image_id, COUNT(*) as like_count
      FROM likes
      GROUP BY image_id
    ) l ON i.id = l.image_id
    WHERE i.created_at >= ?
    ORDER BY
      (COALESCE(l.like_count, 0) * 1.0) DESC,
      i.created_at DESC
    LIMIT ?
  `

  const rows = db
    .prepare(query)
    .all(sevenDaysAgo.toISOString(), limit) as Array<{
    id: number
    r2_url: string
    aspect_ratio: string
    style_tags: string
    quality: string | null
    created_at: string
    like_count: number
  }>

  const images: GalleryImage[] = rows.map((row) => ({
    id: row.id,
    r2_url: getThumbnailUrl(row.r2_url),
    aspect_ratio: row.aspect_ratio,
    style_tags: JSON.parse(row.style_tags) as string[],
    quality: row.quality,
    like_count: row.like_count,
    created_at: row.created_at,
  }))

  return { data: images }
}
