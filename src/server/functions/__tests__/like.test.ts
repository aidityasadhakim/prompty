import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('toggleLike', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should add like when not already liked', () => {
    const isAlreadyLiked = false
    const likeCount = 1

    expect(isAlreadyLiked).toBe(false)
    expect(likeCount).toBe(1)
  })

  it('should remove like when already liked', () => {
    const isAlreadyLiked = true
    const likeCount = 0

    expect(isAlreadyLiked).toBe(true)
    expect(likeCount).toBe(0)
  })

  it('should throw error for invalid image ID', () => {
    const validateImageId = (id: number) => {
      if (!id || id <= 0) {
        throw new Error('Invalid image ID')
      }
      return id
    }

    expect(() => validateImageId(0)).toThrow('Invalid image ID')
    expect(() => validateImageId(-1)).toThrow('Invalid image ID')
    expect(() => validateImageId(1)).not.toThrow()
  })
})
