import { describe, it, expect } from 'vitest'
import { GalleryImage } from '@/lib/schema'

describe('Schema Types', () => {
  it('should define GalleryImage type correctly', () => {
    const mockImage: GalleryImage = {
      id: 1,
      r2_url: 'https://example.com/image.jpg',
      aspect_ratio: '1:1',
      style_tags: ['photorealistic', 'portrait'],
      quality: 'ultra',
      like_count: 42,
      created_at: '2026-02-07',
    }

    expect(mockImage.id).toBe(1)
    expect(mockImage.aspect_ratio).toBe('1:1')
    expect(mockImage.style_tags).toHaveLength(2)
    expect(mockImage.like_count).toBe(42)
  })

  it('should handle optional fields', () => {
    const mockImage: GalleryImage = {
      id: 1,
      r2_url: 'https://example.com/image.jpg',
      aspect_ratio: '9:16',
      style_tags: ['anime'],
      quality: null,
      like_count: 0,
      created_at: '2026-02-07',
    }

    expect(mockImage.quality).toBeNull()
    expect(mockImage.style_tags).toContain('anime')
  })
})
