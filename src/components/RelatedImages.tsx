import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { GalleryImage } from '@/lib/schema'
import { ImageCard } from '@/components/ImageCard'
import { cn } from '@/lib/utils'

interface RelatedImagesProps {
  images: Array<GalleryImage>
  currentImageId: number
  title?: string
}

export function RelatedImages({
  images,
  currentImageId,
  title = 'Related Images',
}: RelatedImagesProps) {
  if (images.length === 0) {
    return null
  }

  const filteredImages = images.filter((img) => img.id !== currentImageId)

  if (filteredImages.length === 0) {
    return null
  }

  return (
    <section className="py-8 border-t border-border-default">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        <Link
          to="/gallery"
          className={cn(
            'flex items-center gap-1',
            'text-sm text-text-secondary',
            'hover:text-accent-primary transition-colors',
          )}
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div
        className={cn(
          'grid gap-4',
          'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
        )}
      >
        {filteredImages.slice(0, 6).map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </section>
  )
}
