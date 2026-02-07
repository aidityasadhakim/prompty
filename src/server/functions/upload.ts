import { createServerFn } from '@tanstack/react-start'
import type { ImageMetadata } from '@/lib/schema'
import { getDb } from '@/lib/db'
import { uploadFileToR2, validateImageFile } from '@/lib/r2'

export const uploadImage = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (input: {
      fileData: string // base64 encoded file
      filename: string
      contentType: string
      metadata: ImageMetadata
    }) => ({
      fileData: input.fileData,
      filename: input.filename,
      contentType: input.contentType,
      metadata: input.metadata,
    }),
  )
  .handler(
    async ({ data }): Promise<{ publicUrl: string; success: boolean }> => {
      try {
        // Decode base64 file data
        const fileBuffer = Buffer.from(data.fileData, 'base64')

        // Validate file
        validateImageFile(fileBuffer, data.filename, data.contentType)

        // Upload to R2
        const { publicUrl } = await uploadFileToR2(
          fileBuffer,
          data.filename,
          data.contentType,
        )

        // Insert into database
        const db = getDb()

        const insertImage = db.prepare(`
          INSERT INTO images (r2_url, aspect_ratio, style_tags, quality)
          VALUES (?, ?, ?, ?)
        `)

        const result = insertImage.run(
          publicUrl,
          data.metadata.meta.aspect_ratio,
          JSON.stringify(data.metadata.meta.style),
          data.metadata.meta.quality,
        )

        const imageId = Number(result.lastInsertRowid)

        const insertMetadata = db.prepare(`
          INSERT INTO metadata (image_id, meta_data, character_lock, scene, subject)
          VALUES (?, ?, ?, ?, ?)
        `)

        insertMetadata.run(
          imageId,
          JSON.stringify(data.metadata.meta),
          data.metadata.character_lock
            ? JSON.stringify(data.metadata.character_lock)
            : null,
          JSON.stringify(data.metadata.scene),
          JSON.stringify(data.metadata.subject),
        )

        return { publicUrl, success: true }
      } catch (error) {
        console.error('Upload error:', error)
        throw new Error(
          error instanceof Error ? error.message : 'Upload failed',
        )
      }
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
