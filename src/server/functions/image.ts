import type { ImageWithFullMetadata } from '@/lib/schema'
import { getDb } from '@/lib/db'
import { getFullImageUrl } from '@/lib/r2'

interface GetImageByIdInput {
  id: number
}

export async function getImageById(
  input: GetImageByIdInput,
): Promise<ImageWithFullMetadata & { like_count: number; is_liked: boolean }> {
  const id = Number(input.id)
  if (!id || id <= 0) {
    throw new Error('Invalid image ID')
  }

  const db = getDb()

  const imageQuery = `
    SELECT id, r2_url, aspect_ratio, style_tags, quality, created_at, updated_at
    FROM images WHERE id = ?
  `
  const image = db.prepare(imageQuery).get(id) as
    | {
        id: number
        r2_url: string
        aspect_ratio: string
        style_tags: string
        quality: string | null
        created_at: string
        updated_at: string
      }
    | undefined

  if (!image) {
    throw new Error('Image not found')
  }

  const metadataQuery = `
    SELECT id, image_id, meta_data, character_lock, scene, subject
    FROM metadata WHERE image_id = ?
  `
  const metadata = db.prepare(metadataQuery).get(id) as
    | {
        id: number
        image_id: number
        meta_data: string
        character_lock: string | null
        scene: string
        subject: string
      }
    | undefined

  if (!metadata) {
    throw new Error('Metadata not found')
  }

  const likesQuery = `
    SELECT COUNT(*) as like_count
    FROM likes WHERE image_id = ?
  `
  const likesResult = db.prepare(likesQuery).get(id) as { like_count: number }
  const likeCount = likesResult.like_count

  return {
    image: {
      id: image.id,
      r2_url: getFullImageUrl(image.r2_url),
      aspect_ratio: image.aspect_ratio,
      style_tags: JSON.parse(image.style_tags) as Array<string>,
      quality: image.quality,
      created_at: image.created_at,
      updated_at: image.updated_at,
    },
    metadata: {
      id: metadata.id,
      image_id: metadata.image_id,
      meta_data: JSON.parse(metadata.meta_data),
      character_lock: metadata.character_lock
        ? JSON.parse(metadata.character_lock)
        : null,
      scene: JSON.parse(metadata.scene),
      subject: JSON.parse(metadata.subject),
    },
    like_count: likeCount,
    is_liked: false,
  }
}
