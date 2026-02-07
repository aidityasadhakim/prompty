import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { ImageCard } from '@/components/ImageCard'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import type { GalleryImage, AspectRatio, StyleTag } from '@/lib/schema'

export const Route = createFileRoute('/gallery')({
  component: GalleryPage,
})

function GalleryPage() {
  const [search, setSearch] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio | null>(null)
  const [style, setStyle] = useState<StyleTag | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['images', { page: 1, limit: 20, aspectRatio, style, search }],
    queryFn: async () => {
      const response = await fetch(
        `/api/images?page=1&limit=20${aspectRatio ? `&aspectRatio=${aspectRatio}` : ''}${style ? `&style=${style}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
      )
      if (!response.ok) throw new Error('Failed to fetch images')
      return response.json()
    },
  })

  const handleSearchSubmit = useCallback((value: string) => {
    setSearch(value)
  }, [])

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <FilterPanel
              selectedAspectRatio={aspectRatio}
              selectedStyle={style}
              onAspectRatioChange={setAspectRatio}
              onStyleChange={setStyle}
            />
          </aside>

          <main className="flex-1">
            <div className="mb-8">
              <SearchBar
                value={search}
                onChange={() => {}}
                onSubmit={handleSearchSubmit}
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary" />
              </div>
            )}

            {error && (
              <div className="text-center py-20">
                <p className="text-red-400">Error loading images</p>
              </div>
            )}

            {data && data.data.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-secondary">No images found</p>
              </div>
            )}

            {data && data.data.length > 0 && (
              <>
                <div
                  className={cn(
                    'grid gap-4',
                    'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
                  )}
                >
                  {data.data.map((image: GalleryImage) => (
                    <ImageCard key={image.id} image={image} />
                  ))}
                </div>

                {data.pagination.hasMore && (
                  <div className="mt-8 text-center">
                    <button className="px-6 py-3 bg-secondary text-text-primary rounded-lg hover:bg-secondary/80 transition-colors">
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
