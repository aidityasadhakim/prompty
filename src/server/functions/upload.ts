import { createServerFn } from '@tanstack/react-start'
import type { ImageMetadata } from '@/lib/schema'
import { getDb } from '@/lib/db'
import { generateR2UploadUrl } from '@/lib/r2'

export const uploadImage = createServerFn({
  method: 'POST',
})
  .inputValidator((input: { filename: string; metadata: ImageMetadata }) => ({
    filename: input.filename,
    metadata: input.metadata,
  }))
  .handler(
    async ({
      data,
    }): Promise<{
      uploadUrl: string
      filename: string
      publicUrl: string
    }> => {
      const r2Result = generateR2UploadUrl(data.filename)
      return r2Result
    },
  )

export const confirmUpload = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (input: { filename: string; r2_url: string; metadata: ImageMetadata }) => ({
      filename: input.filename,
      r2_url: input.r2_url,
      metadata: input.metadata,
    }),
  )
  .handler(async ({ data }): Promise<{ id: number; success: boolean }> => {
    const { r2_url, metadata } = data

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
  })
