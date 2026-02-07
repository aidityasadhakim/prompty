import { ErrorComponent, Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-xl w-full">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Something went wrong
          </h2>
          <p className="text-text-secondary text-sm">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              router.invalidate()
            }}
            className={cn(
              'px-6 py-2 rounded-lg bg-accent-primary text-white font-medium',
              'hover:bg-accent-primary/90 transition-colors duration-200',
            )}
          >
            Try Again
          </button>
          <Link
            to="/"
            className={cn(
              'px-6 py-2 rounded-lg bg-secondary text-text-primary font-medium',
              'hover:bg-secondary/80 transition-colors duration-200',
            )}
          >
            Go Home
          </Link>
        </div>

        {isDevelopment && (
          <div className="mt-8 text-left w-full overflow-hidden rounded-lg border border-border-default bg-background-secondary p-4">
            <ErrorComponent error={error} />
          </div>
        )}
      </div>
    </div>
  )
}
