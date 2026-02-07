import { getEnv } from './env'

interface R2UploadUrl {
  uploadUrl: string
  filename: string
  publicUrl: string
}

export function generateR2UploadUrl(filename: string): R2UploadUrl {
  const env = getEnv()
  const { accountId, bucketName } = env.cloudflare.r2

  const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const key = `images/${uniqueFilename}`

  const uploadUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${env.cloudflare.r2.accessKeyId}%2F${new Date().toISOString().split('T')[0]}%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=${new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')}&X-Amz-Expires=900&X-Amz-Signature=placeholder`

  return {
    uploadUrl,
    filename: uniqueFilename,
    publicUrl: `${env.cloudflare.r2.publicUrl}/${key}`,
  }
}

export function buildImageUrl(
  filename: string,
  options?: {
    width?: number
    height?: number
    fit?: 'cover' | 'contain' | 'crop' | 'scale'
  },
): string {
  const env = getEnv()
  const baseUrl = env.cloudflare.r2.publicUrl

  const params = new URLSearchParams()
  if (options?.width) params.set('width', options.width.toString())
  if (options?.height) params.set('height', options.height.toString())
  if (options?.fit) params.set('fit', options.fit)

  const queryString = params.toString()
  return queryString
    ? `${baseUrl}/${filename}?${queryString}`
    : `${baseUrl}/${filename}`
}

export function getThumbnailUrl(filename: string): string {
  return buildImageUrl(filename, { width: 300, height: 300, fit: 'cover' })
}

export function getFullImageUrl(filename: string): string {
  return buildImageUrl(filename)
}
