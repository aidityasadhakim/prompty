import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp } from 'lucide-react'
import type { GalleryImage } from '@/lib/schema'
import { ImageCard } from '@/components/ImageCard'
import { getTrendingImages } from '@/server/functions/trending'

export const Route = createFileRoute('/trending')({
  component: TrendingPage,
})

function TrendingPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trending', { limit: 20 }],
    queryFn: () => getTrendingImages({ data: { limit: 20 } }),
  })

  return (
    <div className="min-h-screen bg-background-primary pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-accent-primary" />
          <h1 className="text-3xl font-semibold text-text-primary">Trending</h1>
        </div>

        <p className="text-text-secondary mb-8">
          Most liked images from the past 7 days
        </p>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400">Error loading trending images</p>
          </div>
        )}

        {data && data.data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary">No trending images yet</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
            {data.data.map((image: GalleryImage) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
