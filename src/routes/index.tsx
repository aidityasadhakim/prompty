import { createFileRoute } from '@tanstack/react-router'
import { Zap, Image, Download, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

export default function LandingPage() {
  const features = [
    {
      icon: <Image className="w-8 h-8 text-accent-primary" aria-hidden="true" />,
      title: 'Curated Gallery',
      description:
        'Discover high-quality AI-generated images with detailed metadata',
    },
    {
      icon: <Download className="w-8 h-8 text-accent-secondary" aria-hidden="true" />,
      title: 'JSON Export',
      description:
        'Export structured metadata for your own AI generation workflows',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-accent-tertiary" aria-hidden="true" />,
      title: 'Trending Content',
      description:
        'Explore the most popular images and styles in the community',
    },
    {
      icon: <Zap className="w-8 h-8 text-accent-primary" aria-hidden="true" />,
      title: 'Fast Search',
      description:
        'Find exactly what you need with powerful filtering and search',
    },
  ]

  const galleryPreviews = [
    { alt: 'Dark gradient preview showing deep blue tones', color: '#05060b' },
    { alt: 'Dark slate gradient preview with rich texture', color: '#12141c' },
    { alt: 'Teal and green gradient preview in dark tones', color: '#2A4245' },
    { alt: 'Purple accent gradient preview with subtle violet hues', color: '#6074DD' },
  ]

  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5" />

        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 tracking-tight">
              AI Image
              <span className="block bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Prompt Gallery
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-10">
              Discover, explore, and export AI-generated images with complete
              structured metadata. Your creative companion for AI art
              generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/gallery"
                className={cn(
                  'inline-flex items-center gap-2',
                  'px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl',
                  'hover:bg-accent-hover transition-all duration-300',
                  'shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40',
                )}
              >
                <Image className="w-5 h-5" aria-hidden="true" />
                Explore Gallery
              </a>
              <a
                href="#features"
                className={cn(
                  'inline-flex items-center gap-2',
                  'px-8 py-4 bg-secondary text-text-primary font-semibold rounded-xl',
                  'hover:bg-secondary/80 transition-all duration-300',
                  'border border-border-default',
                )}
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up animation-delay-300">
            {galleryPreviews.map((preview, index) => (
              <div
                key={index}
                className={cn(
                  'aspect-square rounded-2xl overflow-hidden',
                  index === 0
                    ? 'bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20'
                    : index === 1
                    ? 'bg-gradient-to-bl from-accent-secondary/20 to-accent-tertiary/20'
                    : index === 2
                    ? 'bg-gradient-to-tr from-accent-tertiary/20 to-accent-primary/20'
                    : 'bg-gradient-to-tl from-accent-primary/10 to-accent-secondary/10',
                )}
              >
                <img
                  src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='${encodeURIComponent(preview.color)}' width='100' height='100'/%3E%3C/svg%3E`}
                  alt={preview.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-text-primary text-center mb-4">
            Why Prompty?
          </h2>
          <p className="text-text-secondary text-center max-w-2xl mx-auto mb-16">
            Built for AI art creators who want quality metadata and seamless
            workflows.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'group p-6 rounded-2xl',
                  'bg-secondary/30 border border-border-default',
                  'hover:border-accent-primary/50 transition-all duration-300',
                  'hover:shadow-lg hover:shadow-accent-primary/10',
                )}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Ready to explore?
          </h2>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto mb-10">
            Start discovering AI-generated images with complete, structured
            metadata today.
          </p>
          <a
            href="/gallery"
            className={cn(
              'inline-flex items-center gap-2',
              'px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl',
              'hover:bg-accent-hover transition-all duration-300',
              'shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40',
            )}
          >
            <Image className="w-5 h-5" aria-hidden="true" />
            Browse Gallery
          </a>
        </div>
      </section>

      <footer className="py-8 border-t border-border-default">
        <div className="container mx-auto px-4 text-center text-text-muted">
          <p>© 2026 Prompty. AI Image Prompt Gallery.</p>
        </div>
      </footer>
    </div>
  )
}
