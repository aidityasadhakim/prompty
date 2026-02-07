import { getEnv } from './env'

export function getCdnBaseUrl(): string {
  const env = getEnv()

  if (env.cloudflare.images.token) {
    return `https://imagedelivery.net/${env.cloudflare.images.accountId}`
  }

  return env.cloudflare.r2.publicUrl
}

export function isCloudflareImages(): boolean {
  const env = getEnv()
  return !!env.cloudflare.images.token
}
