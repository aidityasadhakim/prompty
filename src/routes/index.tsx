import { useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { AspectRatio, GalleryImage, StyleTag } from '@/lib/schema'
import { ImageCard } from '@/components/ImageCard'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import { getImages } from '@/server/functions/images'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [search, setSearch] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio | null>(null)
  const [style, setStyle] = useState<StyleTag | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['images', { page: 1, limit: 50, aspectRatio, style, search }],
    queryFn: () =>
      getImages({
        data: {
          page: 1,
          limit: 50,
          aspectRatio: aspectRatio ?? undefined,
          style: style ?? undefined,
          search: search || undefined,
        },
      }),
  })

  const handleSearchSubmit = useCallback((value: string) => {
    setSearch(value)
  }, [])

  return (
    <div className="min-h-screen bg-background-primary pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          {/* Top Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-30 bg-background-primary/95 backdrop-blur py-4 -mx-4 px-4 border-b border-border-default">
            <div className="w-full md:w-auto flex-1 max-w-2xl">
              <SearchBar
                value={search}
                onChange={() => {}}
                onSubmit={handleSearchSubmit}
                placeholder="Search prompts, styles..."
              />
            </div>
          </div>

          <div className="w-full">
            <FilterPanel
              selectedAspectRatio={aspectRatio}
              selectedStyle={style}
              onAspectRatioChange={setAspectRatio}
              onStyleChange={setStyle}
            />
          </div>

          <main className="min-h-[500px]">
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
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
                  {data.data.map((image: GalleryImage) => (
                    <ImageCard key={image.id} image={image} />
                  ))}
                </div>

                {data.pagination.hasMore && (
                  <div className="mt-8 text-center py-8">
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
