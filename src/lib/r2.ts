import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getEnv } from './env'

interface R2UploadResult {
  filename: string
  publicUrl: string
  key: string
}

/**
 * Parse style_tags from database, handling both JSON array and string formats
 * @param styleTags - The style_tags value from database
 * @returns Array of style tags
 */
export function parseStyleTags(styleTags: string): string[] {
  try {
    const parsed = JSON.parse(styleTags)
    // If it's already an array, return it
    if (Array.isArray(parsed)) {
      return parsed
    }
    // If it's a string, split by comma
    if (typeof parsed === 'string') {
      return parsed.split(',').map((tag) => tag.trim())
    }
    // Fallback
    return []
  } catch {
    // If JSON.parse fails, treat as comma-separated string
    return styleTags.split(',').map((tag) => tag.trim())
  }
}

/**
 * Upload a file buffer directly to R2 storage
 * @param fileBuffer - The file content as a Buffer
 * @param filename - Original filename
 * @param contentType - MIME type of the file
 * @returns Upload result with public URL
 */
export async function uploadFileToR2(
  fileBuffer: Buffer,
  filename: string,
  contentType: string,
): Promise<R2UploadResult> {
  const env = getEnv()
  const { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl } =
    env.cloudflare.r2

  // Create unique filename
  const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const key = `images/${uniqueFilename}`

  // Configure S3 client for R2
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  // Upload file to R2
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  })

  await s3Client.send(command)

  return {
    filename: uniqueFilename,
    publicUrl: `${publicUrl}/${key}`,
    key,
  }
}

/**
 * Validate file for upload
 * @param fileBuffer - The file content
 * @param filename - Original filename
 * @param contentType - MIME type
 * @throws Error if validation fails
 */
export function validateImageFile(
  fileBuffer: Buffer,
  filename: string,
  contentType: string,
): void {
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (fileBuffer.length > maxSize) {
    throw new Error(
      `File size exceeds 10MB limit. File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB`,
    )
  }

  // Check content type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ]
  if (!allowedTypes.includes(contentType.toLowerCase())) {
    throw new Error(
      `Invalid file type: ${contentType}. Allowed types: ${allowedTypes.join(', ')}`,
    )
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const fileExtension = filename.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    throw new Error(
      `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`,
    )
  }
}

export function buildImageUrl(
  urlOrFilename: string,
  options?: {
    width?: number
    height?: number
    fit?: 'cover' | 'contain' | 'crop' | 'scale'
  },
): string {
  // If it's already a full URL, use it as-is (but add query params if needed)
  if (
    urlOrFilename.startsWith('http://') ||
    urlOrFilename.startsWith('https://')
  ) {
    const params = new URLSearchParams()
    if (options?.width) params.set('width', options.width.toString())
    if (options?.height) params.set('height', options.height.toString())
    if (options?.fit) params.set('fit', options.fit)

    const queryString = params.toString()
    return queryString ? `${urlOrFilename}?${queryString}` : urlOrFilename
  }

  // Otherwise, it's a filename/key, so build the full URL
  const env = getEnv()
  const baseUrl = env.cloudflare.r2.publicUrl

  const params = new URLSearchParams()
  if (options?.width) params.set('width', options.width.toString())
  if (options?.height) params.set('height', options.height.toString())
  if (options?.fit) params.set('fit', options.fit)

  const queryString = params.toString()
  return queryString
    ? `${baseUrl}/${urlOrFilename}?${queryString}`
    : `${baseUrl}/${urlOrFilename}`
}

export function getThumbnailUrl(urlOrFilename: string): string {
  return buildImageUrl(urlOrFilename, { width: 300, height: 300, fit: 'cover' })
}

export function getFullImageUrl(urlOrFilename: string): string {
  return buildImageUrl(urlOrFilename)
}
