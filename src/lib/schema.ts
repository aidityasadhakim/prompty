export interface ImageMeta {
  quality: string
  resolution: string
  camera: string
  lens: string
  aspect_ratio: string
  style: Array<string>
}

export interface CharacterLock {
  age_range: string
  ethnicity: string
  hair_color: string
  hair_style: string
  hair_length: string
  eye_description: string
  face_shape: string
  nose: string
  lips: string
  skin: string
  body_type: string
  distinguishing_features: Array<string>
}

export interface Scene {
  location_type: string
  setting_details: string
  time_of_day: string
  lighting_description: string
  atmospheric_qualities: Array<string>
}

export interface Subject {
  pose_description: string
  outfit_details: string
  product_placement: string
}

export interface ImageMetadata {
  meta: ImageMeta
  character_lock: CharacterLock | null
  scene: Scene
  subject: Subject
}

export interface ImageRecord {
  id: number
  r2_url: string
  aspect_ratio: string
  style_tags: Array<string>
  quality: string | null
  created_at: string
  updated_at: string
}

export interface MetadataRecord {
  id: number
  image_id: number
  meta_data: ImageMeta
  character_lock: CharacterLock | null
  scene: Scene
  subject: Subject
}

export interface GalleryImage {
  id: number
  r2_url: string
  aspect_ratio: string
  style_tags: Array<string>
  quality: string | null
  like_count: number
  created_at: string
}

export interface ImageWithFullMetadata {
  image: ImageRecord
  metadata: MetadataRecord
  like_count: number
  is_liked: boolean
}

export interface PaginatedImages {
  data: Array<GalleryImage>
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export type AspectRatio = '1:1' | '3:2' | '2:3' | '9:16' | '16:9' | 'custom'

export const ASPECT_RATIOS: Array<AspectRatio> = [
  '1:1',
  '3:2',
  '2:3',
  '9:16',
  '16:9',
  'custom',
]

export const STYLE_TAGS = [
  'photorealistic',
  'abstract',
  'anime',
  'anime-style',
  'digital art',
  'oil painting',
  'film photography',
  'macro photography',
  'portrait',
  'landscape',
  'fashion',
  'editorial',
  'fantasy',
  'sci-fi',
  'nature',
  'wildlife',
] as const

export type StyleTag = (typeof STYLE_TAGS)[number]
