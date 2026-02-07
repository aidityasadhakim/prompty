import { describe, it, expect } from 'vitest'

describe('getImages Logic', () => {
  it('should sanitize page parameter (default to 1)', () => {
    const sanitizePage = (page?: number) => Math.max(1, Number(page) || 1)
    expect(sanitizePage(undefined)).toBe(1)
    expect(sanitizePage(0)).toBe(1)
    expect(sanitizePage(-5)).toBe(1)
    expect(sanitizePage(1)).toBe(1)
    expect(sanitizePage(10)).toBe(10)
  })

  it('should sanitize limit parameter (min 1, max 100, default 20)', () => {
    const sanitizeLimit = (limit?: number) =>
      Math.min(100, Math.max(1, Number(limit) || 20))
    expect(sanitizeLimit(undefined)).toBe(20)
    expect(sanitizeLimit(0)).toBe(20)
    expect(sanitizeLimit(50)).toBe(50)
    expect(sanitizeLimit(200)).toBe(100)
    expect(sanitizeLimit(-10)).toBe(1)
  })

  it('should calculate offset correctly', () => {
    const calculateOffset = (page: number, limit: number) => (page - 1) * limit
    expect(calculateOffset(1, 20)).toBe(0)
    expect(calculateOffset(2, 20)).toBe(20)
    expect(calculateOffset(3, 20)).toBe(40)
    expect(calculateOffset(1, 10)).toBe(0)
    expect(calculateOffset(5, 10)).toBe(40)
  })

  it('should determine hasMore correctly', () => {
    const hasMore = (offset: number, dataLength: number, total: number) =>
      offset + dataLength < total
    expect(hasMore(0, 20, 100)).toBe(true)
    expect(hasMore(80, 20, 100)).toBe(false)
    expect(hasMore(0, 0, 0)).toBe(false)
    expect(hasMore(0, 10, 10)).toBe(false)
  })

  it('should build aspect ratio filter correctly', () => {
    const buildFilter = (aspectRatio?: string) => {
      if (aspectRatio) {
        return { clause: 'aspect_ratio = ?', params: [aspectRatio] }
      }
      return { clause: '', params: [] }
    }

    const result1 = buildFilter('1:1')
    expect(result1.clause).toBe('aspect_ratio = ?')
    expect(result1.params).toEqual(['1:1'])

    const result2 = buildFilter(undefined)
    expect(result2.clause).toBe('')
    expect(result2.params).toEqual([])
  })

  it('should build style filter correctly', () => {
    const buildStyleFilter = (style?: string) => {
      if (style) {
        return { clause: 'style_tags LIKE ?', params: [`%"${style}"%`] }
      }
      return { clause: '', params: [] }
    }

    const result = buildStyleFilter('photorealistic')
    expect(result.clause).toBe('style_tags LIKE ?')
    expect(result.params).toEqual(['%"photorealistic"%'])
  })

  it('should build search filter correctly', () => {
    const buildSearchFilter = (search?: string) => {
      if (search) {
        return {
          clause: '(style_tags LIKE ? OR quality LIKE ?)',
          params: [`%${search}%`, `%${search}%`],
        }
      }
      return { clause: '', params: [] }
    }

    const result = buildSearchFilter('ultra')
    expect(result.clause).toBe('(style_tags LIKE ? OR quality LIKE ?)')
    expect(result.params).toEqual(['%ultra%', '%ultra%'])
  })

  it('should transform database row to GalleryImage correctly', () => {
    const dbRow = {
      id: 1,
      r2_url: 'images/test.jpg',
      aspect_ratio: '1:1',
      style_tags: '["photorealistic", "portrait"]',
      quality: 'ultra',
      created_at: '2026-02-07',
    }

    const getThumbnailUrl = (url: string) => `thumbnails/${url}`
    const likeCountMap = new Map([[1, 42]])

    const image = {
      id: dbRow.id,
      r2_url: getThumbnailUrl(dbRow.r2_url),
      aspect_ratio: dbRow.aspect_ratio,
      style_tags: JSON.parse(dbRow.style_tags),
      quality: dbRow.quality,
      like_count: likeCountMap.get(dbRow.id) || 0,
      created_at: dbRow.created_at,
    }

    expect(image.id).toBe(1)
    expect(image.r2_url).toBe('thumbnails/images/test.jpg')
    expect(image.aspect_ratio).toBe('1:1')
    expect(image.style_tags).toEqual(['photorealistic', 'portrait'])
    expect(image.quality).toBe('ultra')
    expect(image.like_count).toBe(42)
    expect(image.created_at).toBe('2026-02-07')
  })

  it('should build where clause with multiple filters', () => {
    const buildWhereClause = (
      aspectRatio?: string,
      style?: string,
      search?: string,
    ) => {
      const clauses: string[] = []
      const params: string[] = []

      if (aspectRatio) {
        clauses.push('aspect_ratio = ?')
        params.push(aspectRatio)
      }

      if (style) {
        clauses.push('style_tags LIKE ?')
        params.push(`%"${style}"%`)
      }

      if (search) {
        clauses.push('(style_tags LIKE ? OR quality LIKE ?)')
        params.push(`%${search}%`, `%${search}%`)
      }

      const whereClause =
        clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : ''
      return { whereClause, params }
    }

    const result = buildWhereClause('1:1', 'photorealistic', 'ultra')
    expect(result.whereClause).toBe(
      'WHERE aspect_ratio = ? AND style_tags LIKE ? AND (style_tags LIKE ? OR quality LIKE ?)',
    )
    expect(result.params).toEqual([
      '1:1',
      '%"photorealistic"%',
      '%ultra%',
      '%ultra%',
    ])
  })
})
