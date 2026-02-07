import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { Image } from '@unpic/react'
import type { GalleryImage } from '@/lib/schema'
import { cn } from '@/lib/utils'

interface ImageCardProps {
  image: GalleryImage
  onLike?: (id: number) => void
  isLiked?: boolean
}

export function ImageCard({ image, onLike, isLiked = false }: ImageCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(image.like_count)
  const [imageError, setImageError] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
    onLike?.(image.id)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Link
      to="/image/$imageId"
      params={{ imageId: image.id.toString() }}
      className="group relative block rounded-xl overflow-hidden bg-secondary/50 break-inside-avoid mb-4"
    >
      {imageError ? (
        <div className="w-full aspect-[3/4] flex flex-col items-center justify-center bg-secondary/30 text-text-secondary p-6">
          <svg
            className="w-12 h-12 mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-center">Image not available</p>
        </div>
      ) : (
        <Image
          src={image.r2_url}
          alt={`AI generated image #${image.id}`}
          layout="fullWidth"
          className={cn(
            'w-full h-auto object-cover transition-transform duration-300',
            'group-hover:scale-105',
          )}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-background-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="absolute top-3 right-3">
        <button
          onClick={handleLike}
          className={cn(
            'p-2 rounded-full transition-all duration-200',
            liked
              ? 'bg-accent-primary text-white'
              : 'bg-secondary/80 backdrop-blur-sm text-text-secondary hover:text-accent-primary',
          )}
          aria-label={liked ? 'Remove like' : 'Like this image'}
        >
          <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 right-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
        <div className="flex flex-wrap gap-1">
          {image.style_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-accent-primary/20 text-accent-primary border border-accent-primary/30"
            >
              {tag}
            </span>
          ))}
          {image.style_tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-secondary/80 text-text-secondary">
              {`+${image.style_tags.length - 3}`}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 text-text-secondary text-xs">
          <span className="bg-secondary/80 backdrop-blur-sm px-2 py-1 rounded">
            {image.aspect_ratio}
          </span>
          <span className="flex items-center gap-1 bg-secondary/80 backdrop-blur-sm px-2 py-1 rounded">
            <Heart className="w-3 h-3" />
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  )
}
