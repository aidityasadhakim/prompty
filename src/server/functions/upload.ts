import type { ImageMetadata } from '@/lib/schema'
import { getDb } from '@/lib/db'
import { generateR2UploadUrl } from '@/lib/r2'

interface UploadImageInput {
  filename: string
  metadata: ImageMetadata
}

export async function uploadImage(
  input: UploadImageInput,
): Promise<{ uploadUrl: string; filename: string; publicUrl: string }> {
  const { filename, metadata } = input

  if (!filename || !metadata) {
    throw new Error('Missing required fields')
  }

  const r2Result = generateR2UploadUrl(filename)
  return r2Result
}

interface ConfirmUploadInput {
  filename: string
  r2_url: string
  metadata: ImageMetadata
}

export async function confirmUpload(
  input: ConfirmUploadInput,
): Promise<{ id: number; success: boolean }> {
  const { filename, r2_url, metadata } = input

  if (!filename || !r2_url || !metadata) {
    throw new Error('Missing required fields')
  }

  const db = getDb()

  const insertImage = db.prepare(`
    INSERT INTO images (r2_url, aspect_ratio, style_tags, quality)
    VALUES (?, ?, ?, ?)
  `)

  const result = insertImage.run(
    r2_url,
    metadata.meta.aspect_ratio,
    JSON.stringify(metadata.meta.style),
    metadata.meta.quality,
  )

  const imageId = Number(result.lastInsertRowid)

  const insertMetadata = db.prepare(`
    INSERT INTO metadata (image_id, meta_data, character_lock, scene, subject)
    VALUES (?, ?, ?, ?, ?)
  `)

  insertMetadata.run(
    imageId,
    JSON.stringify(metadata.meta),
    metadata.character_lock ? JSON.stringify(metadata.character_lock) : null,
    JSON.stringify(metadata.scene),
    JSON.stringify(metadata.subject),
  )

  return { id: imageId, success: true }
}
