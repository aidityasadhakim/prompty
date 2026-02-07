import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function NotFound(props: any) {
  const children = props.children
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-accent-primary opacity-20">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">
            Page Not Found
          </h2>
          <p className="text-text-secondary">
            {children ||
              "The page you are looking for doesn't exist or has been moved."}
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className={cn(
              'px-6 py-2 rounded-lg bg-accent-primary text-white font-medium',
              'hover:bg-accent-primary/90 transition-colors duration-200',
            )}
          >
            Go Home
          </Link>
          <Link
            to="/trending"
            className={cn(
              'px-6 py-2 rounded-lg bg-secondary text-text-primary font-medium',
              'hover:bg-secondary/80 transition-colors duration-200',
            )}
          >
            View Trending
          </Link>
        </div>
      </div>
    </div>
  )
}
