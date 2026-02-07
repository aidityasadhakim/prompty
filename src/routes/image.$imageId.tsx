import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Download, Heart, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/image/$imageId')({
  component: ImageDetailsPage,
})

function ImageDetailsPage() {
  const { imageId } = useParams({ from: '/image/$imageId' })

  const { data, isLoading, error } = useQuery({
    queryKey: ['image', imageId],
    queryFn: async () => {
      const response = await fetch(`/api/images/${imageId}`)
      if (!response.ok) throw new Error('Failed to fetch image')
      return response.json()
    },
  })

  const handleExport = () => {
    if (!data) return

    const exportData = {
      meta: data.metadata.meta_data,
      character_lock: data.metadata.character_lock,
      scene: data.metadata.scene,
      subject: data.metadata.subject,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompty-${imageId}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <p className="text-red-400">Error loading image</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative">
            <img
              src={data.image.r2_url}
              alt={`AI generated image #${data.image.id}`}
              className="w-full rounded-xl"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                className={cn(
                  'p-3 rounded-full transition-all',
                  data.is_liked
                    ? 'bg-accent-primary text-white'
                    : 'bg-secondary/80 backdrop-blur-sm text-text-secondary hover:text-accent-primary',
                )}
                aria-label={data.is_liked ? 'Remove like' : 'Like this image'}
              >
                <Heart
                  className={cn('w-5 h-5', data.is_liked && 'fill-current')}
                />
              </button>
              <button
                className="p-3 rounded-full bg-secondary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary transition-all"
                aria-label="Share this image"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-text-primary">
                Image Details
              </h1>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
            </div>

            <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-text-primary">Meta</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Quality:</span>
                  <span className="ml-2 text-text-primary">
                    {data.metadata.meta_data.quality}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Resolution:</span>
                  <span className="ml-2 text-text-primary">
                    {data.metadata.meta_data.resolution}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Aspect Ratio:</span>
                  <span className="ml-2 text-text-primary">
                    {data.metadata.meta_data.aspect_ratio}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Style:</span>
                  <div className="ml-2 flex flex-wrap gap-1">
                    {data.metadata.meta_data.style?.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-accent-primary/20 text-accent-primary rounded text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {data.metadata.character_lock && (
              <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-medium text-text-primary">
                  Character Lock
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Age Range:</span>
                    <span className="ml-2 text-text-primary">
                      {data.metadata.character_lock.age_range}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Ethnicity:</span>
                    <span className="ml-2 text-text-primary">
                      {data.metadata.character_lock.ethnicity}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Hair:</span>
                    <span className="ml-2 text-text-primary">
                      {data.metadata.character_lock.hair_color}{' '}
                      {data.metadata.character_lock.hair_style}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-text-primary">Scene</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Location:</span>
                  <span className="ml-2 text-text-primary">
                    {data.metadata.scene.location_type}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Time of Day:</span>
                  <span className="ml-2 text-text-primary">
                    {data.metadata.scene.time_of_day}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Lighting:</span>
                  <span className="ml-2 text-text-primary">
                    {data.metadata.scene.lighting_description}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-text-primary">Subject</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-text-muted">Pose:</span>
                  <span className="ml-2 text-text-primary">
                    {data.metadata.subject.pose_description}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Outfit:</span>
                  <span className="ml-2 text-text-primary">
                    {data.metadata.subject.outfit_details}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
